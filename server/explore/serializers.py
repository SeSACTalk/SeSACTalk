from rest_framework import serializers

from profiles.models import Profile
from post.models import HashTag


class UserExploreResultSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source='user.id', read_only = True)
    name = serializers.CharField(source='user.name', read_only = True)
    username = serializers.CharField(source='user.username', read_only = True)

    campus_name = serializers.SerializerMethodField()

    profile_id = serializers.IntegerField(source='id', read_only = True)
    profile_img_path =  serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = (
            'id', 'name', 'username', 'campus_name', 'profile_id', 'profile_img_path'
        )

    def get_campus_name(self, profile):
        # 두 번째 캠퍼스로!
        user = profile.user
        if user.second_course:
            return user.second_course.campus.name
        return user.first_course.campus.name

    def get_profile_img_path(self, profile):
        if profile.img_path:
            profile_img_path = profile.img_path
        else:
            profile_img_path = '/media/profile/default_profile.png'

        return profile_img_path


class HashTagExploreResultSerializer(serializers.ModelSerializer):
    hashtag_name = serializers.CharField(source = 'name', read_only = True)
    hashtag_id = serializers.IntegerField(source = 'id', read_only = True)
    post_ids = serializers.SerializerMethodField(read_only = True)
    count_post = serializers.IntegerField(source = 'post_set.count', read_only = True)

    class Meta:
        model = HashTag
        fields = (
            'hashtag_name', 'hashtag_id', 'post_ids', 'count_post',
        )

    def get_post_ids(self, hashtag):
        return [post.id for post in hashtag.post_set.all()]