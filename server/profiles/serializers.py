from rest_framework import serializers

from profiles.models import Profile
from accounts.models import User, Course, Campus

class ProfileSerializer(serializers.ModelSerializer):
    img_path = serializers.SerializerMethodField()
    user_id = serializers.IntegerField(source='user.id')
    user_name = serializers.CharField(source='user.name')
    user_campusname = serializers.SerializerMethodField()
    post_count = serializers.IntegerField()
    follower_count = serializers.IntegerField()
    follow_count = serializers.IntegerField()

    class Meta:
        model = Profile
        fields = ['img_path', 'content', 'link', 'date', 'course_status',
                  'user_name', 'user_campusname','user_id', 'post_count', 'follower_count', 'follow_count']

    def get_img_path(self, profile):
        if profile.img_path:
            profile_img_path = profile.img_path
        else:
            profile_img_path = '/media/profile/default_profile.png'

        return profile_img_path

    def get_user_campusname(self, profile):
        user = User.objects.get(pk = profile.user.id)
        try:
            campus_name = Campus.objects.get(pk = user.second_course.campus.id).name
        except Exception as e:
            print(e)
            campus_name = Campus.objects.get(pk = user.first_course.campus.id).name

        return campus_name

class CampusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Campus
        fields = '__all__'  

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = '__all__'  
        
# class EditProfileSerializer(serializers.ModelSerializer):
#     # id = serializers.IntegerField()
#     # username = serializers.CharField()
#     # name = serializers.CharField()
#     # birthdate = serializers.DateField()
#     # phone_number = serializers.CharField()
#     # email = serializers.EmailField()
#     # profile__img_path = serializers.ImageField()
#     # profile__content = serializers.CharField()
#     # profile__link = serializers.URLField()
#     # profile__course_status = serializers.BooleanField()
#     # first_course__name = serializers.CharField()
#     # first_course__campus__name = serializers.CharField()
#     # second_course__name = serializers.CharField()
#     # second_course__campus__name = serializers.CharField()
#     class Meta:
#         model = User  # 시리얼라이저가 사용할 모델을 지정합니다.
#         fields = [
#                 'id', 'username', 'name', 'birthdate', 'phone_number', 'email',
#                 'profile__img_path', 'profile__content', 'profile__link', 'profile__course_status',
#                 'first_course__name', 'first_course__campus__name',
#                 'secon
        
class EditProfileSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source = 'user.id')
    username = serializers.CharField(source = 'user.username')
    name = serializers.CharField(source = 'user.name')
    birthdate = serializers.DateField(source = 'user.birthdate')
    phone_number = serializers.CharField(source = 'user.phone_number')
    email = serializers.EmailField(source = 'user.email')
    
    profile_img_path = serializers.ImageField(source = 'img_path')
    profile_content = serializers.CharField(source = 'content')
    profile_link = serializers.URLField(source = 'link')
    profile_course_status = serializers.BooleanField(source = 'course_status')
    
    first_course__name = serializers.CharField(source = 'user.first_course.name')
    first_course__campus__name = serializers.CharField(source = 'user.first_course.campus.name')
    second_course__name = serializers.SerializerMethodField()
    second_course__campus__name = serializers.SerializerMethodField()

    def get_second_course__name(self, profile):
        try:
            second_course_name = profile.user.second_course.name
        except:
            return ""
        return second_course_name

    def get_second_course__campus__name(self, profile):
        try:
            second_course_campus_name = profile.user.second_course.campus.name
        except:
            return ""
        return second_course_campus_name

    class Meta:
        model = Profile  # 시리얼라이저가 사용할 모델을 지정합니다.
        fields = [
                'id', 'username', 'name', 'birthdate', 'phone_number', 'email',
                'profile_img_path', 'profile_content', 'profile_link', 'profile_course_status',
                'first_course__name', 'first_course__campus__name',
                'second_course__name', 'second_course__campus__name',
            ]
