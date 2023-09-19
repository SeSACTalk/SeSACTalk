from django.db import models
from accounts.models import User

class ChatRoom(models.Model):
    user_one = models.ForeignKey(User, on_delete = models.CASCADE, related_name = 'user_one')
    user_two = models.ForeignKey(User, on_delete = models.CASCADE, related_name = 'user_two')
    latest_content = models.TextField(max_length = 1000, null = True)
    latest_date = models.DateTimeField(auto_now = True)

class Chat(models.Model):
    sender = models.ForeignKey(User, on_delete = models.CASCADE, related_name = 'sender')
    content = models.TextField(max_length = 1000)
    read_status = models.BooleanField(default = False)
    date = models.DateTimeField(auto_now_add = True)
    chat_room = models.ForeignKey(ChatRoom, on_delete = models.CASCADE, related_name = 'chat_room')
