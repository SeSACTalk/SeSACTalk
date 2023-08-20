from django.core.files.uploadedfile import InMemoryUploadedFile
from django.db.models import Q
from django.http import HttpRequest
from django.utils.datastructures import MultiValueDictKeyError

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

from PIL import Image
import io

from post.models import Post as PostModel, Like, View, Reply, HashTag, Report
from post.serializers import PostSerializer, LikeSerializer, ViewSerializer, ReplySerializer, HashTagSerializer, ReportSerializer
from post.mixins import OwnerPermissionMixin
from post.constants import ResponseMessages
from user.models import UserRealtionship

""" >> 전달사항
    Clas Post View
    - 전체 포스트 리스트 조회, 포스트 업로드 views
    
    Class PostDetail View
    - 포스트 디테일 보기(read), 포스트 수정하기(update), 포스트 삭제하기(delete) views
    
    OwnerPermissionMixin: post에 접근하는 주체가 로그인 주체와 같은지, 권한 검사하는 mixin 클래스.
    - check_post_owner(frontend_session_key: str, username: str, option: str = None)-> Union[bool, tuple]
        * frontend_session_key: front에서 보내는 session_key
        * username: 경로변수로 접근한 username값
        * option: 
            ** None: 기본값으로, return은 bool값. True == 로그인주체와 접근 주체 같음 / False == 로그인 주체와 접근 주체 다름
            ** 'get_owner'를 인자로 전달하면 return값이 튜플, user_post_owner(로그인한 User Model), condition(위의 bool값)
            
    반환 메시지를 상수를 정의하는 모듈에 정의
    - post.constants.py의 ResponseMessages클래스(클래스 변수)
            
    select_related()함수는 N+1쿼리문제를 해결하기 위해 사용(cf. prefetch_related())
    - Forien key로 연결된 객체 데이터를 미리 가져오는 역할.
"""
class Post(APIView, OwnerPermissionMixin):
    def get(self, request: HttpRequest, username) -> Response:
        # 권한 확인
        user_who_accessed_post, condition_read_user_is_same_as_login_user = self.check_post_owner\
                                                                            (request.META.get('HTTP_AUTHORIZATION'),\
                                                                             username,\
                                                                             'get_owner')
        if not condition_read_user_is_same_as_login_user:
            return Response({'error': ResponseMessages.FORBIDDEN_ACCESS}, status.HTTP_403_FORBIDDEN)

        # 팔로우 기반 또는 자신의 게시물 포스트를 가져오는 쿼리문 수행, order by의 - 기호는 역순을 의미
        user_s_follows = UserRealtionship.objects.filter(user_follower=user_who_accessed_post.id)
        posts_by_followed_user_or_own = PostModel.objects.filter(
            Q(user=user_who_accessed_post.id) | Q(user__in=user_s_follows.values('user_follow'))
        ).select_related('user').order_by('-date')

        # QuerySet이 비어있을 경우
        if not bool(posts_by_followed_user_or_own):
            return Response({'message': ResponseMessages.NO_POSTS_TO_DISPLAY}, status=status.HTTP_200_OK)
        
        # 반환할 게시물이 있는 경우
        postSerializer = PostSerializer(posts_by_followed_user_or_own, many=True)
        for i, post in enumerate(posts_by_followed_user_or_own): postSerializer.data[i]['username'] = post.user.username

        return Response(postSerializer.data, status=status.HTTP_200_OK)



    # TODO: 보안적 검증 등에 대한 오류 처리 및 로깅하기
    def post(self, request: HttpRequest, username) -> Response:
        # 권한 확인
        user_who_accessed_post, condition_posting_user_is_same_as_login_user = self.check_post_owner(\
                                                                                request.META.get('HTTP_AUTHORIZATION'),\
                                                                                username,\
                                                                                'get_owner')
        if not condition_posting_user_is_same_as_login_user:
            return Response({'error': ResponseMessages.FORBIDDEN_ACCESS}, status.HTTP_403_FORBIDDEN)

        # 이미지 파일이 없을 때, 컨텐츠의 길이가 500자를 넘을 때 예외처리
        try:
            max_img_size = 3 * 1024 * 1024
            content = request.data['content'].strip()
            if not (content and len(content) <= 500):
                raise ValueError("Content length less than 0 or exceeded: 500")
            img_path = request.FILES['img_path']
            if img_path.content_type not in ['image/png', 'image/jpeg']:
                raise TypeError("file유형 맞지 않음")
            if img_path.size > max_img_size:
                img_path = self.compress_image(img_path, img_path.content_type.split('/')[1].upper(), max_img_size)
            post = PostModel.objects.create(content=content, img_path=img_path, user=user_who_accessed_post)
        except ValueError as ve:
            print(ve)
            return Response({'error': ResponseMessages.CONTENT_LENGTH_EXCEEDED}, status.HTTP_400_BAD_REQUEST)
        except TypeError as te:
            return Response({'error': ResponseMessages.IMG_TYPE_DOES_NOT_MATCH}, status=status.HTTP_400_BAD_REQUEST)
        except MultiValueDictKeyError as exception:
            print(exception, '\nNo image attachments')
            post = PostModel.objects.create(content=content, user=user_who_accessed_post)
        post.save()

        return Response({'message': ResponseMessages.CREATE_SUCCESS}, status=status.HTTP_201_CREATED)

    def compress_image(self, input_image, output_format, max_size):
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

class PostDetail(APIView, OwnerPermissionMixin):
    def get(self, request: HttpRequest, **kwargs) -> Response:
        # 권한 확인(게시물 주인 확인)
        condition_read_user_is_same_as_login_user = self.check_post_owner(request.META.get('HTTP_AUTHORIZATION'),\
                                                        kwargs['username'])
        response_data = {'isPostMine': condition_read_user_is_same_as_login_user}
        return Response(response_data, status.HTTP_200_OK)

    def put(self, request, **kwargs) -> Response:
        # 권한 확인
        user_who_accessed_post, condition_edit_user_is_same_as_login_user  = self.check_post_owner\
                                                                            (request.META.get('HTTP_AUTHORIZATION'),\
                                                                             kwargs['username'],\
                                                                             'get_owner')
        if not condition_edit_user_is_same_as_login_user:
            return Response({'error': ResponseMessages.FORBIDDEN_ACCESS}, status.HTTP_403_FORBIDDEN)

        # update 데이터가 전과 다르지 않아서, update하지 않음
        if (request.data['original_content'].strip() == request.data['update_content'].strip()):
            return Response({'message': ResponseMessages.NOT_UPDATE}, status.HTTP_304_NOT_MODIFIED)

        # update
        post = PostModel.objects.get(id = kwargs['pk'], user=user_who_accessed_post.id)
        post.content = request.data['update_content']
        post.save()
        return Response({'message': 'UPDATE SUCCESS'}, status.HTTP_200_OK)


    def delete(self, request, **kwargs) -> Response:
        # TODO: db에서 이미지를 삭제하면 server의 이미지도 삭제할 것인가?
        # 권한 확인
        user_who_accessed_post, condition_delete_user_is_same_as_login_user  = self.check_post_owner\
                                                                            (request.META.get('HTTP_AUTHORIZATION'),\
                                                                             kwargs['username'],\
                                                                             'get_owner')
        if not condition_delete_user_is_same_as_login_user:
            return Response({'error': ResponseMessages.FORBIDDEN_ACCESS}, status.HTTP_403_FORBIDDEN)

        # delete
        post = PostModel.objects.get(id = kwargs['pk'], user = user_who_accessed_post.id)
        post.delete()
        return Response({'message' : ResponseMessages.DELETE_SUCCESS}, status.HTTP_204_NO_CONTENT)