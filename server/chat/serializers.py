from rest_framework import serializers

from chat.models import Chat, ChatRoom
from profiles.models import Profile

class ChatRoomSerilaizer(serializers.ModelSerializer):
    class Meta:
        model = ChatRoom
        fields = '__all__'
        
# TODO : Sender, Receiver 직렬화 객체 상속 혹은 합치는 방안 모색하기
class ChatRoomOneSerializer(serializers.ModelSerializer):
    target = serializers.IntegerField(source = 'user_one.id', read_only=True)
    target_name = serializers.CharField(source = 'user_one.name', read_only=True)
    target_first_campus_name = serializers.CharField(source = 'user_one.first_course.campus.name', read_only=True)
    target_second_campus_name = serializers.SerializerMethodField()
    profile_img_path = serializers.SerializerMethodField()
    latest_date = serializers.DateTimeField(format = "%Y년 %m월 %d일")

    class Meta:
        model = ChatRoom
        fields = ('id', 'target', 'target_name', 'target_first_campus_name', 'target_second_campus_name', 'profile_img_path', 'latest_content', 'latest_date')

    def get_target_second_campus_name(self, chatroom):
        try:
            sender_second_course_campus_name = chatroom.user_one.second_course.campus.name
        except:
            return ""
        
        return sender_second_course_campus_name
    
    def get_profile_img_path(self, chatroom):
        profile = Profile.objects.get(user = chatroom.user_one.id)
        if profile.img_path:
            profile_img_path = profile.img_path
        else:
            profile_img_path = '/media/profile/default_profile.png'

        return profile_img_path

class ChatRoomTwoSerializer(serializers.ModelSerializer):
    target = serializers.IntegerField(source = 'user_two.id', read_only=True)
    target_name = serializers.CharField(source = 'user_two.name', read_only=True)
    target_first_campus_name = serializers.CharField(source = 'user_two.first_course.campus.name', read_only=True)
    target_second_campus_name = serializers.SerializerMethodField()
    profile_img_path = serializers.SerializerMethodField()
    latest_date = serializers.DateTimeField(format = "%Y년 %m월 %d일")

    class Meta:
        model = ChatRoom
        fields = ('id', 'target', 'target_name', 'target_first_campus_name', 'target_second_campus_name', 'profile_img_path', 'latest_content', 'latest_date')

    def get_target_second_campus_name(self, chatroom):
        try:
            sender_second_course_campus_name = chatroom.user_two.second_course.campus.name
        except:
            return ""
        
        return sender_second_course_campus_name
    
    def get_profile_img_path(self, chatroom):
        profile = Profile.objects.get(user = chatroom.user_two.id)
        if profile.img_path:
            profile_img_path = profile.img_path
        else:
            profile_img_path = '/media/profile/default_profile.png'

        return profile_img_path

class ChatDetailSerializer(serializers.ModelSerializer):
    sender = serializers.IntegerField(source = 'chatroom.sender.id', read_only=True)
    sender_name = serializers.CharField(source = 'chatroom.sender.name', read_only=True)
    sender_first_campus_name = serializers.CharField(source = 'chatroom.sender.first_course.campus.name', read_only=True)
    sender_second_campus_name = serializers.SerializerMethodField()
    profile_img_path = serializers.SerializerMethodField()
    date = serializers.DateTimeField(format = "%Y년 %m월 %d일 %H:%M")

    class Meta:
        model = Chat
        fields = ('id', 'sender', 'sender_name', 'sender_first_campus_name', 'sender_second_campus_name', 'profile_img_path', 'content', 'date')
    
    def get_sender_second_campus_name(self, chat):
        try:
            sender_second_course_campus_name = chat.sender.second_course.campus.name
        except:
            return ""
        
        return sender_second_course_campus_name
    
    def get_profile_img_path(self, chat):
        profile = Profile.objects.get(user = chat.sender.id)
        if profile.img_path:
            profile_img_path = profile.img_path
        else:
            profile_img_path = '/media/profile/default_profile.png'

        return profile_img_path


class ChatSerializers(serializers.ModelSerializer):
    class Meta:
        model = Chat
        fields ='__all__'