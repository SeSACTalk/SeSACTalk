from rest_framework import serializers

from chat.models import Chat
  
class ChatDetailSerializer(serializers.Serializer):
    sender__name = serializers.CharField()
    receiver__name = serializers.CharField()
    content = serializers.CharField()
    date = serializers.DateTimeField()

    class Meta:
        fields = ('sender__name', 'receiver__name', 'content', 'date')


class ChatUserSerializer(serializers.Serializer):
    sender = serializers.IntegerField()
    sender__name = serializers.CharField()
    sender__first_course__campus__name = serializers.CharField()
    content = serializers.CharField()
    date = serializers.DateTimeField(format = "%Y년 %m월 %d일")
    img_path = serializers.CharField()

    class Meta:
        fields = ('sender', 'sender__name', 'sender__first_course__campus__name', 'content', 'date', 'img_path')

class ChatSerializers(serializers.ModelSerializer):
    class Meta:
        model = Chat
        fields ='__all__'