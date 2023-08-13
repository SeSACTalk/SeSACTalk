from rest_framework import serializers
from django.core.validators import MinLengthValidator, MaxLengthValidator, RegexValidator

from .models import Campus, Course, User

# 유효성
class CustomUsernameRegexValidator(RegexValidator):
    regex = r'^(?=.*[a-zA-Z])(?=.*[0-9]).*$'
    message = '영문과 숫자를 포함한 아이디를 입력해주세요.'
    code = 'invalid_username'
class CustomNameRegexValidator(RegexValidator):
    regex = r'^[가-힣]*$'
    message = '한글 이름만 입력 가능합니다.'
    code = 'invalid_name'
class CustomPhonenumberRegexValidator(RegexValidator):
    regex = r'^\d{3}-\d{4}-\d{4}$'
    message = '(-)를 포함하여 입력해주세요.'
    code = 'invalid_phonenumber'
class CustomMinLengthValidator(MinLengthValidator):
    def __init__(self, type_, min_length, message=None, code='min_length'):
        if message is None:
            message = f'{type_}의 길이가 최소 {min_length} 이상이어야 합니다.'
        super().__init__(min_length, message)
class CustomMaxLengthValidator(MaxLengthValidator):
    def __init__(self, type_, max_length, message=None, code='max_length'):
        if message is None:
            message = f'{type_}의 길이는 최대 {max_length} 입니다.'
        super().__init__(max_length, message)


# ModelSerializer
class CampusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Campus
        fields = ('id', 'name', 'address')
        

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ('id', 'name', 'campus')
        
class UserSerializer(serializers.ModelSerializer):
    username = serializers.CharField(
        validators=[
            CustomUsernameRegexValidator(),
            CustomMinLengthValidator('아이디', min_length=8),
            CustomMaxLengthValidator('아이디', max_length=20)
        ]
    )
    name = serializers.CharField(
        validators=[
            CustomNameRegexValidator(),
            CustomMinLengthValidator('이름', min_length=2),
            CustomMaxLengthValidator('이름', max_length=5)
        ]
    )
    phone_number = serializers.CharField(
        validators=[
            CustomPhonenumberRegexValidator(),
            CustomMinLengthValidator('전화번호', min_length=13),
            CustomMaxLengthValidator('전화번호', max_length=13)
        ]
    )

    class Meta:
        model = User
        fields = '__all__'