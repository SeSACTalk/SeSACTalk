from rest_framework import serializers

from accounts.models import User
from accounts.serializers import CourseSerializer

class UserAuthSerializer(serializers.ModelSerializer):
    first_course = CourseSerializer(read_only = True)
    second_course = CourseSerializer(read_only = True)
    # is_auth = serializers.SerializerMethodField()

    # def get_is_auth(self, obj):
    #     auth_status = ''
    #     if obj.is_auth == 0:
    #         auth_status = '가입'
    #     elif obj.is_auth == 1:
    #         auth_status = '승인'
    #     elif obj.is_auth == 2:
    #         auth_status = '보류'
    #     elif obj.is_auth == 3:
    #         auth_status = '거절'
    #     else:
    #         raise ValueError

    #     return auth_status
    
    def validate(self, data):
        is_auth = data.get('is_auth')
        if is_auth is not None and (is_auth < 0 or is_auth > 3):
            raise serializers.ValidationError('is auth 값은 0에서 3 사이어야 합니다')
        return data
    
    class Meta:
        model = User
        fields = ('id', 'username', 'name', 'birthdate', 'gender', 'phone_number', 'email', 'signup_date', 'withdraw_date', 'first_course', 'second_course', 'is_auth', 'is_active', 'is_staff', 'is_superuser')
  