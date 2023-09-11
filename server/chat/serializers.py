from rest_framework import serializers

from chat.models import Chat, ChatRoom
from profiles.models import Profile

class ChatRoomSerializer(serializers.ModelSerializer):
    sender = serializers.IntegerField(source = 'sender.id', read_only=True)
    sender_name = serializers.CharField(source = 'sender.name', read_only=True)
    sender_first_campus_name = serializers.CharField(source = 'sender.first_course.campus.name', read_only=True)
    sender_second_campus_name = serializers.SerializerMethodField()
    profile_img_path = serializers.SerializerMethodField()
    latest_date = serializers.DateTimeField(format = "%Y년 %m월 %d일")

    class Meta:
        model = ChatRoom
        fields = ('id', 'sender', 'sender_name', 'sender_first_campus_name', 'sender_second_campus_name', 'profile_img_path', 'latest_content', 'latest_date',)

    def get_sender_second_campus_name(self, chatroom):
        try:
            sender_second_course_campus_name = chatroom.sender.second_course.campus.name
        except:
            return ""
        
        return sender_second_course_campus_name
    
    def get_profile_img_path(self, chatroom):
        profile_is_exist = Profile.objects.filter(user = chatroom.sender.id).exists()
        if profile_is_exist:
            profile = Profile.objects.get(user = chatroom.sender.id)
            profile_img_path = profile.img_path
        else:
            profile_img_path = '/media/profile/default_profile.png'

        return profile_img_path

  
class ChatDetailSerializer(serializers.Serializer):
    sender = serializers.IntegerField()
    receiver = serializers.IntegerField()
    sender__name = serializers.CharField()
    receiver__name = serializers.CharField()
    content = serializers.CharField()
    date = serializers.DateTimeField(format = "%Y년 %m월 %d일 %H:%M")

    class Meta:
        fields = ('sender__name', 'receiver__name', 'content', 'date')


class ChatProfileSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()
    username = serializers.CharField()
    first_course__campus__name = serializers.CharField()
    img_path = serializers.CharField()

    class Meta:
        model = Chat
        fields ='__all__'

class ChatSerializers(serializers.ModelSerializer):
    class Meta:
        model = Chat
        fields ='__all__'