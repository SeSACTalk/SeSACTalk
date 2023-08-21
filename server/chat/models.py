from django.db import models
from accounts.models import User

class Chat(models.Model):
    sender = models.ForeignKey(User, on_delete = models.CASCADE, related_name = 'sender_id')
    receiver = models.ForeignKey(User, on_delete = models.CASCADE, related_name = 'receiver_id')
    content = models.TextField(max_length = 1000)
    read_status = models.BooleanField(default = False)
    date = models.DateTimeField(auto_now_add = True)