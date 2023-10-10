from django.db.models import Q
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
    user = User.objects.get(pk=obj.id)
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
    follow_user_id = serializers.IntegerField(source='id')
    follow_user_name = serializers.CharField(source='name')
    follow_user_username = serializers.CharField(source='username')
    follow_user_campusname = serializers.SerializerMethodField()


    class Meta:
        model = User
        fields = [
                    'follow_user_img_path', 'follow_user_id', 'follow_user_name',
                    'follow_user_username', 'follow_user_campusname'
                ]

    def get_follow_user_img_path(self, user):
        return get_img_path(user.profile_set.first())

    def get_follow_user_campusname(self, user):
        return get_user_campusname(user)

class FollowerSerializer(serializers.ModelSerializer):
    follower_user_img_path = serializers.SerializerMethodField()
    follower_user_id = serializers.IntegerField(source='id')
    follower_user_name = serializers.CharField(source='name')
    follower_user_username = serializers.CharField(source='username')
    follower_user_campusname = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['follower_user_img_path', 'follower_user_id', 'follower_user_name', 'follower_user_username', 'follower_user_campusname']

    def get_follower_user_img_path(self, user):
        return get_img_path(user.profile_set.first())

    def get_follower_user_campusname(self, user):
        return get_user_campusname(user)