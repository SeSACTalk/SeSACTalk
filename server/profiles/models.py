from django.db import models
from accounts.models import User

class profile(models.Model):
    img_path = models.ImageField(upload_to = 'profile/', null = True)
    content = models.CharField(max_length = 255, null = True)
    link = models.URLField(null = True)
    date = models.DateTimeField(auto_now = True)
    course_status = models.BooleanField(default = True)
    user = models.ForeignKey(User, on_delete = models.CASCADE)