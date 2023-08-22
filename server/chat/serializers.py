from rest_framework import serializers
  
class ChatSerializer(serializers.Serializer):
    sender__name = serializers.CharField()
    receiver__name = serializers.CharField()
    content = serializers.CharField()
    date = serializers.DateTimeField()

    class Meta:
        fields = ('sender__name', 'receiver__name', 'content', 'date')


class ChatUserSerializer(serializers.Serializer):
    sender = serializers.IntegerField()
    sender__name = serializers.CharField()

    class Meta:
        fields = ('sender', 'sender__name')