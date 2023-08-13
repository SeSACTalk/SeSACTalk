from rest_framework import serializers
from .models import Campus, Course, User

class CampusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Campus
        fields = ('id', 'name', 'address')
        

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ('id', 'name', 'campus')
        
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'name', 'birthdate',\
                    'gender', 'phone_number', 'email'\
                    'signup_date', 'withdraw_date', 'first_course'\
                    'second_course', 'content', 'updated_at'\
                    'is_auth', 'auth_approval_date', 'is_active'\
                    'is_staff', 'is_superuser')
        