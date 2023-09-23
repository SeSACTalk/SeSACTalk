from rest_framework import serializers

from profiles.models import Profile
from accounts.models import User, Course, Campus
from user.models import UserRelationship

def get_img_path(obj):
    if obj.img_path:
        profile_img_path = obj.img_path
    else:
        profile_img_path = '/media/profile/default_profile.png'

    return profile_img_path

def get_user_campusname(obj):
    user = User.objects.get(pk=obj.user.id)
    try:
        campus_name = Campus.objects.get(pk=user.second_course.campus.id).name
    except Exception as e:
        print(e)
        campus_name = Campus.objects.get(pk=user.first_course.campus.id).name
    return campus_name

class UserRelationshipSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserRelationship
        fields = '__all__'

class FollowSerializer(serializers.ModelSerializer):
    follow_user_img_path = serializers.SerializerMethodField()
    follow_user_name = serializers.CharField(source='user.name')
    follow_user_campusname = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = ['follow_user_img_path', 'follow_user_name', 'follow_user_campusname']

    def get_follow_user_img_path(self, profile):
        return get_img_path(profile)

    def get_follow_user_campusname(self, profile):
        return get_user_campusname(profile)


class FollowerSerializer(serializers.ModelSerializer):
    follower_user_img_path = serializers.SerializerMethodField()
    follower_user_name = serializers.CharField(source='user.name')
    follower_user_campusname = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = ['follower_user_img_path', 'follower_user_name', 'follower_user_campusname']

    def get_follower_user_img_path(self, profile):
        return get_img_path(profile)

    def get_follower_user_campusname(self, profile):
        return get_user_campusname(profile)
