from django.db import models
from accounts.models import User

class ChatRoom(models.Model):
    sender = models.ForeignKey(User, on_delete = models.CASCADE, related_name = 'sender_id')
    receiver = models.ForeignKey(User, on_delete = models.CASCADE, related_name = 'receiver_id')
    latest_content = models.TextField(max_length = 1000)
    latest_date = models.DateTimeField(auto_now = True)
    message_count = models.IntegerField(null = True)

class Chat(models.Model):
    content = models.TextField(max_length = 1000)
    read_status = models.BooleanField(default = False)
    date = models.DateTimeField(auto_now_add = True)
    chat_room = models.ForeignKey(ChatRoom, on_delete = models.CASCADE, related_name = 'chat_room')
