from django.db.models import Q
from rest_framework import serializers

from post.models import Reply, Like
from profiles.models import Profile
from accounts.models import User, Course, Campus
from user.models import UserRelationship, Notification

from datetime import datetime


def get_img_path(obj):
    if obj.img_path:
        profile_img_path = obj.img_path
    else:
        profile_img_path = '/media/profile/default_profile.png'

    return profile_img_path

def get_user_campusname(obj):
    user = User.objects.get(pk=obj.id)
    try:
        campus_name = Campus.objects.get(pk=user.second_course.campus.id).name
    except Exception as e:
        print(e)
        campus_name = Campus.objects.get(pk=user.first_course.campus.id).name
    return campus_name

def get_follow_status(user, login_user_id):
    follow_status = UserRelationship.objects.filter(
        Q(user_follow_id=user.id) & Q(user_follower_id=login_user_id)) \
        .exists()
    return follow_status

class UserRelationshipSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserRelationship
        fields = '__all__'

class FollowSerializer(serializers.ModelSerializer):
    follow_user_img_path = serializers.SerializerMethodField(read_only=True)
    follow_user_id = serializers.IntegerField(source='id', read_only=True)
    follow_user_name = serializers.CharField(source='name', read_only=True)
    follow_user_username = serializers.CharField(source='username', read_only=True)
    follow_user_campusname = serializers.SerializerMethodField(read_only=True)
    follow_status = serializers.SerializerMethodField(read_only=True)
    is_current_user = serializers.SerializerMethodField(read_only=True)


    class Meta:
        model = User
        fields = '__all__'

    def get_follow_user_img_path(self, user):
        return get_img_path(user.profile_set.first())

    def get_follow_user_campusname(self, user):
        return get_user_campusname(user)

    def get_follow_status(self, user):
        login_user_id = self.context.get('login_user_id')
        follow_status = None
        if login_user_id:
            follow_status = get_follow_status(user, login_user_id)
        return follow_status

    def get_is_current_user(self, user):
        login_user_id = self.context.get('login_user_id')
        is_current_user = None
        if login_user_id:
            is_current_user = (user.id == int(login_user_id))
        return is_current_user

class FollowerSerializer(serializers.ModelSerializer):
    follower_user_img_path = serializers.SerializerMethodField(read_only=True)
    follower_user_id = serializers.IntegerField(source='id', read_only=True)
    follower_user_name = serializers.CharField(source='name', read_only=True)
    follower_user_username = serializers.CharField(source='username', read_only=True)
    follower_user_campusname = serializers.SerializerMethodField(read_only=True)
    follow_status = serializers.SerializerMethodField(read_only=True)
    is_current_user = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = '__all__'

    def get_follower_user_img_path(self, user):
        return get_img_path(user.profile_set.first())

    def get_follower_user_campusname(self, user):
        return get_user_campusname(user)

    def get_follow_status(self, user):
        login_user_id = self.context.get('login_user_id')
        follow_status = None
        if login_user_id:
            follow_status = get_follow_status(user, login_user_id)
        return follow_status

    def get_is_current_user(self, user):
        login_user_id = self.context.get('login_user_id')
        is_current_user = None
        if login_user_id:
            is_current_user = (user.id == int(login_user_id))
        return is_current_user

class NotificationSerializer(serializers.ModelSerializer):
    targeting_user_name = serializers.SerializerMethodField(read_only=True)
    occur_date = serializers.SerializerMethodField(read_only=True)
    profile_img_path = serializers.SerializerMethodField(read_only=True)
    post_id = serializers.SerializerMethodField(read_only=True)
    targeting_user_username = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Notification
        fields = '__all__'

    def get_type_list(self, required_fields):
        types = ['reply', 'like', 'follow', 'report']
        if required_fields in ['targeting_user_name', 'profile_img_path']:
            return types[:3]
        elif required_fields in ['post_id', 'targeting_user_username']:
            return types[:2]
        else:
            return types[3]

    def get_model_obj(self, type_, pk):
        obj = None

        if type_ == 'reply':
            obj = Reply.objects.get(id = pk)
        if type_ == 'like':
            obj = Like.objects.get(id = pk)

        return obj

    def get_targeting_user_name(self, notification):
        if notification.type in self.get_type_list('targeting_user_name') :
            return notification.targeting_user.name
        return None

    def get_occur_date(self, notification):
        date = notification.occur_date
        today = datetime.now(date.tzinfo)
        difference = today - date

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
            return date.strftime('%Y년 %m월 %d일')

    def get_profile_img_path(self, notification):
        if notification.type in self.get_type_list('profile_img_path') :
            return get_img_path(notification.targeted_user.profile_set.first())
        return None

    def get_post_id(self, notification):
        type_ = notification.type
        post_id = None

        if type_ in self.get_type_list('post_id') :
            post_id = self.get_model_obj(type_, notification.content_id).post.id

        return post_id

    def get_targeting_user_username(self, notification):
        type_ = notification.type
        targeting_user_username = None

        if type_ in self.get_type_list('targeting_user_username') :
            targeting_user_username = self.get_model_obj(type_, notification.content_id).user.username

        return targeting_user_username