from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

# UserAdmin을 상속하여 User 모델을 관리하는 Admin 클래스 정의
class CustomUserAdmin(UserAdmin):
    model = User
    list_display = ['username', 'email', 'name', 'is_active', 'is_staff', 'is_superuser']

# UserAdmin 클래스를 등록하여 User 모델을 Admin 패널에 표시
admin.site.register(User, CustomUserAdmin)
