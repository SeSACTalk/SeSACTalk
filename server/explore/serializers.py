from rest_framework import serializers

from accounts.models import User
from post.models import HashTag, Post
from post.serializers import PostSerializer
from accounts.serializers import UserSerializer

class UserExploreSerializer(UserSerializer):
    profile_id = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'name', 'username', 'is_staff', 'campus_name',
                  'profile_id', 'profile_img_path',]
        read_only_fields = fields

    def get_profile_id(self, instance):
        return instance.profile_set.first().id

class HashTagExploreSerializer(serializers.ModelSerializer):
    count_post = serializers.IntegerField()

    class Meta:
        model = HashTag
        fields = ['id', 'name', 'count_post']
        read_only_fields = fields

class HashTagExploreResultSerializer(PostSerializer):
    hashtag_name = serializers.CharField(read_only=True)

    class Meta:
        model = Post
        fields = [
            'username', 'name', 'like_set', 'hashtag_name',
            'uuid', 'id'
        ]