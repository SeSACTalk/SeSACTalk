from django.db import models
from accounts.models import User

class UserRelationship(models.Model):
    user_follow = models.ForeignKey(User, on_delete = models.CASCADE, related_name = 'user_follow_id')
    user_follower = models.ForeignKey(User, on_delete = models.CASCADE, related_name = 'user_follower_id')

class Notification(models.Model):
    class category(models.TextChoices):
        reply = 'reply', '댓글'
        chat = 'chat', '채팅'
        report = 'report', '신고'
        follow = 'follow', '팔로우'
        like = 'like', '좋아요'

    targeting_user = models.ForeignKey(User, on_delete = models.CASCADE, related_name = 'targeting_user_id')
    targeted_user = models.ForeignKey(User, on_delete = models.CASCADE, related_name = 'targeted_user_id')
    content_id = models.IntegerField()
    type = models.CharField(max_length = 20, choices = category.choices)
    uri = models.TextField(null = True, max_length = 500)
    occur_date = models.DateTimeField(auto_now_add = True)
    read_date = models.DateTimeField(null = True)
    delete_status = models.BooleanField(default = False)

class FCMToken(models.Model):
    user = models.OneToOneField(User, on_delete = models.CASCADE)
    token = models.CharField(max_length = 500)