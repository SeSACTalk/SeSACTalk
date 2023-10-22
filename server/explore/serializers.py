from rest_framework import serializers

from profiles.models import Profile
from post.models import HashTag, Post
from post.serializers import LikeSerializer

class UserExploreSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source='user.id', read_only = True)
    name = serializers.CharField(source='user.name', read_only = True)
    username = serializers.CharField(source='user.username', read_only = True)
    is_staff = serializers.BooleanField(source='user.is_staff', read_only = True)

    campus_name = serializers.SerializerMethodField()

    profile_id = serializers.IntegerField(source='id', read_only = True)
    profile_img_path =  serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = '__all__'

    def get_campus_name(self, profile):
        # 두 번째 캠퍼스로!
        user = profile.user
        if user.second_course:
            return user.second_course.campus.name
        return user.first_course.campus.name

    def get_profile_img_path(self, profile):
        if profile.img_path:
            profile_img_path = '/media/' + str(profile.img_path)
        else:
            profile_img_path = '/media/profile/default_profile.png'

        return profile_img_path


class HashTagExploreSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField(read_only=True)
    count_post = serializers.IntegerField(read_only=True)

    class Meta:
        model = HashTag
        fields = (
            'id', 'name', 'count_post',
        )

class HashTagExploreResultSerializer(serializers.ModelSerializer):
    hashtag_name = serializers.CharField(read_only=True)
    username =  serializers.CharField(source= 'user.username', read_only=True)
    name =  serializers.CharField(source= 'user.name', read_only=True)

    like_set = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = '__all__'

    def get_like_set(self, obj):
        likes = obj.like_set.all()
        serializer = LikeSerializer(likes, many = True)
        return serializer.data