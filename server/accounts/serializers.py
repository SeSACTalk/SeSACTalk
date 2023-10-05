from rest_framework import serializers
from django.core.validators import RegexValidator

from accounts.models import Campus, Course, User

class UsernameRegexValidator(RegexValidator):
    regex = r'^(?=.*[a-zA-Z])(?=.*[0-9]).*$'
    message = '영문과 숫자를 포함한 아이디를 입력해주세요.'
    code = 'invalid_username'
class NameRegexValidator(RegexValidator):
    regex = r'^[가-힣]*$'
    message = '한글 이름만 입력 가능합니다.'
    code = 'invalid_name'
class PhonenumberRegexValidator(RegexValidator):
    regex = r'^\d{3}-\d{4}-\d{4}$'
    message = '(-)를 포함하여 입력해주세요.'
    code = 'invalid_phonenumber'

class LengthValidator:
    """
        데이터의 길이 n < content <= m 의 유효성을 검사
    """
    def __init__(self, type_, min_length, max_length)-> None:
        self.type_ = type_
        self.min_length = min_length
        self.max_length = max_length

    def __call__(self, value: str)-> None:
        len_val = len(value)
        if not (len_val >= self.min_length and len_val <= self.max_length):
            raise serializers.ValidationError(f"""{self.type_}의 길이는 {self.min_length} 이상 또는 {self.max_length}이하의 길이어야 합니다.""")

class CampusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Campus
        fields = ('id', 'name', 'address')

class CourseSerializer(serializers.ModelSerializer):
    campus = CampusSerializer(read_only = True)
    class Meta:
        model = Course
        fields = ('id', 'name', 'campus')
        
class UserSerializer(serializers.ModelSerializer):
    username = serializers.CharField(
        validators = [
            UsernameRegexValidator(),
            LengthValidator('아이디', 8, 20)
        ]
    )
    name = serializers.CharField(
        validators = [
            NameRegexValidator(),
            LengthValidator('이름', 2, 5)
        ]
    )
    phone_number = serializers.CharField(
        validators = [
            PhonenumberRegexValidator(),
            LengthValidator('전화번호', 13, 13)
        ]
    )

    class Meta:
        model = User
        fields = '__all__'
class UserWithdrawInfoSerializer(serializers.ModelSerializer):
    profile_img_path = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ['username', 'profile_img_path']

    def get_profile_img_path(self, user):
        profile_obj = user.profile_set.first()
        if profile_obj.img_path:
            profile_img_path = profile_obj.img_path
        else:
            profile_img_path = '/media/profile/default_profile.png'

        return profile_img_path