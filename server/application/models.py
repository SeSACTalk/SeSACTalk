from django.db import models

class Review(models.Model): # 모델 생성(DB)
    title = models.CharField(max_length=50)
    content = models.TextField()
    updated_at = models.DateTimeField(auto_now=True)

# ? python manage.py migrations
# ? python manage.py migrate 
# ? == > DB에 테이블 생성
