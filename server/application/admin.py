from django.contrib import admin
from .models import Review

admin.site.register(Review) # 관리자 등록

# Register your models here.
# ? python manage.py createsuperuser -> 어드민 계정 생성
