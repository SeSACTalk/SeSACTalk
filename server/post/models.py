from django.db import models
import uuid

from accounts.models import User

class Post(models.Model):
    uuid = models.UUIDField(default = uuid.uuid4, editable = False, unique = True)
    content = models.TextField(max_length = 1000)
    date = models.DateTimeField(auto_now_add = True)
    img_path = models.ImageField(upload_to = 'posts/', null = True)
    report_status = models.BooleanField(default = False)
    user = models.ForeignKey(User, on_delete = models.CASCADE)
    tags = models.ManyToManyField('HashTag', blank = True, related_name = 'post', through = 'HandleTag')

class Like(models.Model):
    date = models.DateTimeField(auto_now_add = True)
    user = models.ForeignKey(User, on_delete = models.CASCADE)
    post = models.ForeignKey(Post, on_delete = models.CASCADE)

class View(models.Model):
    view_count = models.BigIntegerField()
    post = models.OneToOneField(Post, on_delete = models.CASCADE)

class Reply(models.Model):
    content = models.CharField(max_length = 200)
    date = models.DateTimeField(auto_now_add = True)
    report_status = models.BooleanField(default = False)
    user = models.ForeignKey(User, on_delete = models.CASCADE)
    post = models.ForeignKey(Post, on_delete = models.CASCADE)
    
class HashTag(models.Model):
    name = models.CharField(max_length = 255, unique = True)

class HandleTag(models.Model):
    post = models.ForeignKey(Post, on_delete = models.CASCADE)
    tag = models.ForeignKey(HashTag, on_delete = models.CASCADE)

class Report(models.Model):
    class types(models.TextChoices):
        post = 'post', '게시글'
        reply = 'reply', '댓글'
        chat = 'chat', '채팅'

    date = models.DateTimeField(auto_now_add = True)
    content_type =  models.CharField(max_length = 20, choices = types.choices)
    category = models.CharField(max_length = 128)
    content_id = models.IntegerField()
    reporter = models.ForeignKey(User, on_delete = models.CASCADE, related_name = 'reporter_id')
    reported = models.ForeignKey(User, on_delete = models.CASCADE, related_name = 'reported_id')


