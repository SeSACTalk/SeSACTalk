from django.db import models
from accounts.models import User

class UserRealtionship(models.Model):
    user_follow = models.ForeignKey(User, on_delete = models.CASCADE, related_name = 'user_follow_id')
    user_follower = models.ForeignKey(User, on_delete = models.CASCADE, related_name = 'user_follower_id')

class Notification(models.Model):
    class category(models.TextChoices):
        reply = 'reply', '댓글'
        chat = 'chat', '채팅'
        report = 'report', '신고'
        follow = 'follow', '팔로우'
        like = 'like', '좋아요'

    targeting_user = models.ForeignKey(User, on_delete = models.CASCADE, related_name = 'trageting_user_id')
    trageted_user = models.ForeignKey(User, on_delete = models.CASCADE, related_name = 'targeted_user_id')
    type = models.CharField(max_length = 20, choices = category.choices)
    uri = models.TextField(max_length = 500)
    occur_date = models.DateTimeField(auto_now_add = True)
    read_date = models.DateTimeField()

class FCMToken(models.Model):
    user = models.OneToOneField(User, on_delete = models.CASCADE)
    token = models.CharField(max_length = 500)