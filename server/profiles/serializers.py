import io

from PIL import Image
from django.core.files.uploadedfile import InMemoryUploadedFile
from rest_framework import serializers

from profiles.models import Profile
from accounts.models import Course, Campus

from django.contrib.auth.hashers import make_password

class ImgPathContentTypeValidator:
    """
        img의 확장자를 검사
    """
    def __init__(self, allowed_extensions=None)-> None:
        if allowed_extensions is None:
            allowed_extensions = ['png', 'jpg', 'jpeg']
        self.allowed_extensions = allowed_extensions

    def __call__(self, value)-> None:
        if not value.name.lower().endswith(tuple(self.allowed_extensions)):
            raise serializers.ValidationError('Invalid image format. Allowed formats: %s' % ', '.join(self.allowed_extensions))

class ProfileSerializer(serializers.ModelSerializer):
    img_path = serializers.ImageField(
        use_url=True,
        validators=[
            ImgPathContentTypeValidator()
        ],
        required = False
    )
    class Meta:
        model = Profile
        fields = '__all__'

    def update(self, instance, validated_data):
        """
            호출 시점: 역직렬화 데이터를 DB에 UPDATE 때
            정의 이유:
                    1) 역직렬화되어 있는 데이터 중 img_path가 5mb가 넘는지 검사
                    2) 넘을 시 이미지를 압축하여 5MB 이하 이미지데이터로 변환하여 DB에 INSERT
        """
        img_path = validated_data.get('img_path')
        if img_path:
            max_img_size = 5 * 1024 * 1024
            if img_path.size > max_img_size:
                img_path = self.compress_image(img_path, img_path.content_type.split('/')[1].upper(), max_img_size)
                validated_data['img_path'] = img_path

        return super().update(instance, validated_data)

    def compress_image(self, input_image: InMemoryUploadedFile, output_format: str,
                       max_size: int) -> InMemoryUploadedFile:
        # 정의 이유: max_size를 넘은 image file을 max_size 이하로 압축시켜 반환

        img = Image.open(input_image)

        # 이미지의 exif 메타데이터가 있는지 확인하고 회전 정보를 가져옴
        exif = dict(img.getexif().items())
        orientation = exif.get(0x0112, 1)

        # 이미지를 회전시키는데 필요한 회전 정보
        rotate_mapping = {
            3: Image.ROTATE_180,
            6: Image.ROTATE_270,
            8: Image.ROTATE_90
        }

        # 이미지 회전
        if orientation in rotate_mapping:
            img = img.transpose(rotate_mapping[orientation])

        img_io = io.BytesIO()

        # 이미지 크기 조절 및 압축
        img.save(img_io, format=output_format, optimize=True, quality=85)

        # 파일 크기 체크
        img_size = img_io.tell()

        # 지정한 최대 크기보다 크다면 반복적으로 압축
        while img_size > max_size:
            img_io = io.BytesIO()
            img.save(img_io, format=output_format, optimize=True, quality=85)
            img_size = img_io.tell()

        return InMemoryUploadedFile(img_io, None, input_image.name, input_image.content_type, img_size, None)

class ProfileSetSerializer(serializers.ModelSerializer):
    img_path = serializers.SerializerMethodField(read_only=True)
    user_id = serializers.IntegerField(source='user.id', read_only=True)
    user_name = serializers.CharField(source='user.name', read_only=True)
    user_is_staff = serializers.BooleanField(source='user.is_staff', read_only=True)
    user_campusname = serializers.SerializerMethodField(read_only=True)
    post_count = serializers.IntegerField(read_only=True)
    follower_count = serializers.IntegerField(read_only=True)
    follow_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Profile
        fields = '__all__'

    def get_img_path(self, profile):
        if profile.img_path:
            profile_img_path = profile.img_path
        else:
            profile_img_path = '/media/profile/default_profile.png'

        return profile_img_path

    def get_user_campusname(self, profile):
        user = profile.user
        try:
            campus_name = user.second_course.campus.name
        except Exception:
            campus_name = user.first_course.campus.name
        return campus_name

class CampusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Campus
        fields = '__all__'  

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = '__all__'  

class EditProfileSerializer(serializers.ModelSerializer):
    # user fields
    id = serializers.IntegerField(source='user.id', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    is_staff = serializers.BooleanField(source='user.is_staff', read_only=True)
    name = serializers.CharField(source='user.name', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)

    password = serializers.CharField(source='user.password')
    second_course = serializers.IntegerField(source='user.second_course.id', allow_null=True)
    birthdate = serializers.DateField(source='user.birthdate')
    phone_number = serializers.CharField(source='user.phone_number')

    # profile fields
    img_path = serializers.ImageField()
    response_img_path = serializers.SerializerMethodField(read_only=True)
    content = serializers.CharField()
    link = serializers.URLField()
    course_status = serializers.BooleanField()
    response_course_status = serializers.SerializerMethodField(read_only=True)

    # course, campus fields
    first_course_name = serializers.CharField(source='user.first_course.name', read_only=True)
    first_campus_name = serializers.CharField(source='user.first_course.campus.name', read_only=True)
    second_campus_name = serializers.SerializerMethodField(read_only=True)
    second_course_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Profile
        fields = '__all__'

    def update_user_field(self, user_obj, validated_data, field_name)-> None:
        try:
            field_value = validated_data[field_name]
            if field_name == 'password':
                field_value = make_password(field_value)
            if field_name == 'second_course':
                field_value = Course.objects.get(pk = field_value['id'])
            setattr(user_obj, field_name, field_value)
        except KeyError:
            return

    def set_user_field(self, user_obj, validated_data)-> None:
        user_fields = ['password', 'second_course', 'birthdate', 'phone_number']

        for user_field in user_fields:
            self.update_user_field(user_obj, validated_data, user_field)
        user_obj.save()

    def update(self, profile, validated_data):
        # user update
        try:
            self.set_user_field(profile.user, validated_data.pop('user'))
        except KeyError:
            pass

        # profile update
        return super().update(profile, validated_data)

    def get_response_img_path(self, profile):
        if profile.img_path:
            profile_img_path = profile.img_path
        else:
            profile_img_path = '/media/profile/default_profile.png'

        return profile_img_path

    def get_second_course_name(self, profile):
        second_course_name = ""
        try:
            if profile.course_status:
                second_course_name = profile.user.second_course.name
        except:
            pass
        return second_course_name

    def get_second_campus_name(self, profile):
        second_course_campus_name = ""
        try:
            if profile.course_status:
                second_course_campus_name = profile.user.second_course.campus.name
        except:
            pass
        return second_course_campus_name

    def get_response_course_status(self, profile):
        course_status = profile.course_status

        # 과정 신청하지 않음 0 / 과정 승인 == 10 / 과정 신청 중 == 20 반환
        condition = 20
        if course_status:
            second_course = profile.user.second_course
            if bool(second_course):
                condition = 10
            else:
                condition = 0
        return condition

