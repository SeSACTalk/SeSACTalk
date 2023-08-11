from django.db import models
from accounts.models import User
# Create your models here.
class UserRealtionship(models.Model):
    user_follow_id = models.ForeignKey(User, on_delete = models.CASCADE, related_name = 'user_follow_id')
    user_follower_id = models.ForeignKey(User, on_delete = models.CASCADE, related_name = 'user_follower_id')

class Notification(models.Model):
    class category(models.TextChoices):
        reply = 'reply', '댓글'
        chat = 'chat', '채팅'
        report = 'report', '신고'

    targeting_user_id = models.ForeignKey(User, on_delete = models.CASCADE, related_name = 'trageting_user_id')
    trageted_user_id = models.ForeignKey(User, on_delete = models.CASCADE, related_name = 'targeted_user_id')
    type = models.CharField(max_length = 20, choices = category.choices)
    uri = models.TextField(max_length = 500)
    occur_date = models.DateTimeField(auto_now_add = True)
    read_date = models.DateTimeField()

    