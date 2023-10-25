from django.core.files.uploadedfile import InMemoryUploadedFile

from PIL import Image
import io

class ImgConverter:
    def __init__(self, img_file: InMemoryUploadedFile):
        self.img_file = img_file

    def calculate_max_size(self, max_size):
        return max_size * 1024 * 1024

    def is_size_exeeds_limit(self, calculated_max_size):
        return self.img_file.size > calculated_max_size

    def resize_if_exceeds_size(self, max_size):
        calculated_max_size = self.calculate_max_size(max_size)
        if self.is_size_exeeds_limit(calculated_max_size):
            return self.compress_image(self.img_file, self.img_file.content_type.split('/')[1].upper(), calculated_max_size)
        else:
            return self.img_file


    # 정의 이유: max_size를 넘은 image file을 max_size 이하로 압축시켜 반환
    def compress_image(self, input_image: InMemoryUploadedFile, output_format: str,
                       max_size: int) -> InMemoryUploadedFile:
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