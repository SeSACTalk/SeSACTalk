from django.http import QueryDict
from rest_framework import serializers
from django.core.files.uploadedfile import InMemoryUploadedFile

from PIL import Image
import io

from post.models import Post, Like, View, Reply, HashTag, Report

class PostContentLengthValidator:
    """
        content의 길이 0 < content <= 500 의 유효성을 검사
    """
    def __call__(self, value: str)-> None:
        if not (value and len(value) <= 500):
            raise serializers.ValidationError("Content length less than 0 or exceeded: 500")

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

class PostSerializer(serializers.ModelSerializer):
    user = None

    content = serializers.CharField(
        validators=[
            PostContentLengthValidator()
        ]
    )

    img_path = serializers.ImageField(
        validators=[
            ImgPathContentTypeValidator()
        ],
        required = False,
    )
    def __init__(self, *args, **kwargs)-> None:
        self.user = None
        super().__init__(*args, **kwargs)

    class Meta:
        model = Post
        fields = '__all__'
    
    def to_internal_value(self, data):
        """
            호출 시점: 역직렬화 정의
            정의 이유: 
                    1) QueryDict 수정(img_path가 없는 경우, img_path 속성 삭제)
                    후 수정 QueryDict를 역직렬화한 Serializers를 반환하기 위해서
                    2) User Id를 id_valid 호출 전 수정 QueryDict 생성에 삽입하기 위해
        """
        copy_querydict = QueryDict(mutable=True)

        for key, value in data.items():
            if key != 'img_path':
                copy_querydict[key] = value
            else:
                if value != 'null':
                    copy_querydict[key] = value

        copy_querydict['user'] = self.user

        return super().to_internal_value(copy_querydict)
    
    def create(self, validated_data):
        """
            호출 시점: 역직렬화 데이터를 DB에 INSERT할 때
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

        return super().create(validated_data)

    def compress_image(self, input_image: InMemoryUploadedFile, output_format: str, max_size: int)-> InMemoryUploadedFile:
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

class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = '__all__'

class ViewSerializer(serializers.ModelSerializer):
    class Meta:
        model = View
        fields = '__all__'

class ReplySerializer(serializers.ModelSerializer):
    class Meta:
        model = Reply
        fields = '__all__'

class HashTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = HashTag
        fields = '__all__'

class ReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        fields = '__all__'