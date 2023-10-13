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