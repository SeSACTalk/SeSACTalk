from django.db.models import Q
from rest_framework import serializers

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


    def get_targeting_user_name(self, notification):
        type = notification.type
        targeting_user_name_need_notification_type = ['reply', 'follow', 'like']
        if type in targeting_user_name_need_notification_type :
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
        type = notification.type
        profile_need_notification_type = ['reply', 'follow', 'like']

        if type in profile_need_notification_type:
            return get_img_path(notification.targeted_user.profile_set.first())
        else:
            return None
    class Meta:
        model = Notification
        fields = '__all__'
