from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

# 캠퍼스, 과정, 사용자
class Campus(models.Model):
    name = models.CharField(max_length = 10)
    address = models.CharField(max_length = 255)

class Course(models.Model):
    name = models.CharField(max_length = 100)
    campus_id = models.ForeignKey(Campus, on_delete = models.CASCADE)

class UserManager(BaseUserManager):
    use_in_migrations = True    

    def _create_user(self, username, email, password, **extra_fields):
        if not username:
            raise ValueError('Username을 입력해주세요.')
        if not email:
            raise ValueError('Email을 입력해주세요.')
        email = self.normalize_email(email)
        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(self, username, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('is_staff=True일 필요가 있습니다.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('is_superuser=True일 필요가 있습니다.')
        
        return self._create_user(username, email, password, **extra_fields)
    
class User(AbstractBaseUser, PermissionsMixin):
    id = models.BigAutoField(primary_key = True)
    username = models.CharField(max_length = 20, unique = True)
    name = models.CharField(max_length = 20)
    birthdate = models.DateField()
    gender = models.CharField(max_length = 10)
    phone_number = models.CharField(max_length = 15)
    email = models.EmailField(unique = True)
    signup_date = models.DateTimeField(auto_now_add = True)
    withdraw_date = models.DateTimeField(null = True)
    first_course_id = models.ForeignKey(Course, on_delete = models.CASCADE, related_name = 'first_course')
    second_course_id = models.ForeignKey(Course, on_delete = models.CASCADE, null = True, related_name = 'second_course')

    objects = UserManager()

    is_auth = models.IntegerField(default = 0)
    #! 0: 가입, 1: 승인, 2: 보류, 3: 거절
    auth_approval_date = models.DateTimeField(null = True)
    is_active = models.BooleanField(default = True)
    is_staff = models.BooleanField(default = False)
    is_superuser = models.BooleanField(default = False)

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']

    def __str__(self):
        return self.username