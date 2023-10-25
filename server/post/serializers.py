from rest_framework import serializers

from accounts.models import User
from accounts.serializers import UserSerializer
from post.models import Post, Like, Reply, Report
from post.utils import ImgConverter

from datetime import datetime

class PostContentLengthValidator:
    """
        content의 길이 0 < content <= 500 의 유효성을 검사
    """

    def __call__(self, value: str) -> None:
        if not (value and len(value) <= 500):
            raise serializers.ValidationError("Content length less than 0 or exceeded: 500")

class PostSerializer(serializers.ModelSerializer):
# =========================================FIELDS=========================================
    # post field
    hash_tag_name = serializers.SerializerMethodField(read_only=True)
    date = serializers.SerializerMethodField(read_only=True)
    is_current_user = serializers.SerializerMethodField(read_only=True)

    # user field
    is_staff = serializers.BooleanField(source='user.is_staff', read_only=True)
    user_id = serializers.IntegerField(source='user.id', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    name = serializers.CharField(source='user.name', read_only=True)
    campusname = serializers.SerializerMethodField(read_only=True)

    # profile field
    profile_img_path = serializers.SerializerMethodField(read_only=True)

    # like & reply field
    like_set = serializers.IntegerField(source='like_set.count', read_only=True)
    like_status = serializers.SerializerMethodField(read_only=True)
    reply_set = serializers.IntegerField(source='reply_set.count', read_only=True)

# =========================================META=========================================
    class Meta:
        model = Post
        fields = '__all__'
        read_only_fields = ['hash_tag_name', 'date',
                            'is_staff', 'user_id', 'username', 'name', 'campusname',
                            'profile_img_path', 'like_set', 'like_status', 'reply_set']
        extra_kwargs = {
            'img_path' : { 'required':  False },
            'content' : { 'validators':  [PostContentLengthValidator()] },
        }

# =========================================OVERRIED=========================================
    def to_internal_value(self, data):
        copy_querydict = data.copy()
        copy_querydict['user'] = self.context.get('login_user_id')

        return super().to_internal_value(copy_querydict)

    def create(self, validated_data):
        if 'img_path' in validated_data:
            img_converter = ImgConverter(validated_data.get('img_path'))
            origin_or_resize_img_path = img_converter.resize_if_exceeds_size(5)
            validated_data['img_path'] = origin_or_resize_img_path

        return super().create(validated_data)

# =========================================SerializerMethod=========================================

    def get_campusname(self, instance):
        user = instance.user
        second_course = user.second_course
        return_campusname = None

        if user.second_course:
            return_campusname = second_course.campus.name
        else:
            return_campusname = user.first_course.campus.name

        return return_campusname

    def get_date(self, instance):
        post_date = instance.date
        today = datetime.now(post_date.tzinfo)
        difference = today - post_date

        if 7 <= difference.days < 28:
            return f"{difference.days // 7}주"
        elif 1 <= difference.days < 7:
            return f"{difference.days}일"
        elif 0 <= difference.total_seconds() < 86400:
            hours, remainder = divmod(difference.seconds, 3600)
            minutes = remainder // 60
            if hours >= 1:
                return f"{hours}시간"
            else:
                return f"{minutes}분"
        else:
            return post_date.strftime('%Y년 %m월 %d일')

    def get_profile_img_path(self, instance):
        profile = instance.user.profile_set.first()
        if profile.img_path:
            profile_img_path = '/media/' + str(profile.img_path)
        else:
            profile_img_path = '/media/profile/default_profile.png'

        return profile_img_path

    def get_like_status(self, post):
        login_user_id = self.context.get('login_user_id')
        if login_user_id:
            like_status = Like.objects.filter(post_id=post.id, user_id=login_user_id).exists()
            return like_status
        return None

    def get_hash_tag_name(self, post):
        return [hashtag.name for hashtag in post.tags.all()]

    def get_is_current_user(self, instance):
        login_user_id = self.context.get('login_user_id')
        if login_user_id:
            return (instance.user.id == login_user_id)
        return None

class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = '__all__'

class ReplySerializer(serializers.ModelSerializer):
    class Meta:
        model = Reply
        fields = '__all__'

class ReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        fields = '__all__'

    def to_internal_value(self, data):
        copy_querydict = data.copy()
        report_info = self.context.get('report_info')
        report_info_keys = ['content_id', 'reported', 'reporter']

        for key in report_info_keys:
            copy_querydict[key] = report_info[key]

        return super().to_internal_value(copy_querydict)

class ManagerProfileSerializer(UserSerializer):
    class Meta:
        model = User
        fields = [
            'campus_name', 'id', 'username', 'profile_img_path'
        ]

class RecommendPostSerilaier(PostSerializer):
    class Meta:
        model = Post
        fields = [
            'id', 'uuid', 'content', 'date', 'user', 'campusname', 'username', 'name', 'like_set'
        ]

class ReplysSetSerializer(PostSerializer):
    class Meta:
        model = Post
        fields = [
                    'profile_img_path', 'is_current_user',
                    'username', 'name', 'is_staff',
                    'campusname', 'date', 'uuid', 'id', 'content',
                ]

class LikesSetSerializer(PostSerializer):
    class Meta:
        model = Post
        fields = ReplysSetSerializer.Meta.fields