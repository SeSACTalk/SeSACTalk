from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'name', 'birthdate',\
                    'gender', 'phone_number', 'email'\
                    'signup_date', 'withdraw_date', 'first_course'\
                    'second_course', 'content', 'updated_at'\
                    'is_auth', 'auth_approval_date', 'is_active'\
                    'is_staff', 'is_superuser')