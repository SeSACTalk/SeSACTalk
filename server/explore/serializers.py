from rest_framework import serializers

from accounts.models import User
from post.models import HashTag, Post
from post.serializers import LikeSerializer
from accounts.serializers import UserSerializer

class UserExploreSerializer(UserSerializer):
    profile_id = serializers.SerializerMethodField()

    class Meta(UserSerializer.Meta):
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