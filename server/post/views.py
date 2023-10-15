from django.db.models import Q, Count
from django.http import HttpRequest
from datetime import date
from environ import Env
import requests

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination

from post.models import Post as PostModel, Like as LikeModel
from accounts.models import User
from user.models import UserRelationship

from post.serializers import PostSerializer, LikeSerializer, ViewSerializer, ReplySerializer, HashTagSerializer, \
    ReportSerializer, ManagerProfileSerializer, RecommendPostSerilaier
from post.mixins import OwnerPermissionMixin
from post.constants import ResponseMessages

from accounts.models import User
from accounts.serializers import UserInfoSerializer
from sesactalk.mixins import SessionDecoderMixin

class Main(APIView, SessionDecoderMixin):
    def get(self, request: HttpRequest) -> Response:       
        # 캠퍼스 매니저의 pk를 가져오기
        manager_users = User.objects.filter(
            Q(is_staff = True) & Q(is_superuser = False)
        ).select_related('first_course').all()
        
        # QuerySet이 비어있을 경우
        if not bool(manager_users):
            return Response({'message': ResponseMessages.MANAGERS_NO_POSTS_TO_DISPLAY}, status = status.HTTP_200_OK)

        # pk리스트
        managerProfileSerializer = ManagerProfileSerializer(manager_users, many = True)

        # 사용자 정보 가져오기
        user_id = self.extract_user_id_from_session(request.META.get('HTTP_AUTHORIZATION'))        

        user = User.objects.filter(id = user_id).get()

        userSerializer = UserInfoSerializer(user)
        
        response_data = {
            'manager': managerProfileSerializer.data,
            'info': userSerializer.data
        }
        
        return Response(response_data, status = status.HTTP_200_OK)

class RecruitView(APIView, SessionDecoderMixin):
    def get(self, request: HttpRequest) -> Response:
        user_exist = self.extract_user_id_from_session(request.META.get('HTTP_AUTHORIZATION'))
        
        if not user_exist:
            return Response(status = status.HTTP_401_UNAUTHORIZED)
    
        return Response(status = status.HTTP_200_OK)

class CustomPagination(PageNumberPagination):
    page_size = 10

class Post(APIView, OwnerPermissionMixin):    
    def get(self, request: HttpRequest, username) -> Response:
        # 권한 확인
        access_user, condition = self.check_post_owner(request.META.get('HTTP_AUTHORIZATION'), username, 'get_owner')
        if not condition:
            return Response({'error': ResponseMessages.FORBIDDEN_ACCESS}, status.HTTP_403_FORBIDDEN)

        # 팔로우 기반 또는 자신의 게시물 포스트를 가져오는 쿼리문 수행, order by의 - 기호는 역순을 의미
        user_s_follows = UserRelationship.objects.filter(user_follower = access_user.id)
        
        posts = PostModel.objects.filter(
            Q(user=access_user.id) | Q(user__in=user_s_follows.values('user_follow'))
        ).prefetch_related('tags').select_related('user').order_by('-date').all()
        

        paginator = CustomPagination()
        result_page = paginator.paginate_queryset(posts, request)

        # QuerySet이 비어있을 경우
        if not bool(posts):
            return Response({'message': ResponseMessages.POST_NO_POSTS_TO_DISPLAY}, status=status.HTTP_200_OK)

        # 반환할 게시물이 있는 경우
        postSerializer = PostSerializer(result_page, many=True, context={'login_user_id': access_user.id})

        return paginator.get_paginated_response(postSerializer.data)

    def post(self, request: HttpRequest, username) -> Response:
        # 권한 확인
        access_user, condition = self.check_post_owner(request.META.get('HTTP_AUTHORIZATION'), username, 'get_owner')
        if not condition:
            return Response({'error': ResponseMessages.FORBIDDEN_ACCESS}, status.HTTP_403_FORBIDDEN)

        postSerializer = PostSerializer(data = request.data)
        postSerializer.user = access_user.id

        # 유효성 검사
        if postSerializer.is_valid():
            postSerializer.save()
        else:
            print(f'<<CHECK INVALID DATA>>\n{postSerializer.errors}')
            return Response({'error': ResponseMessages.INVALID_DATA}, status=status.HTTP_400_BAD_REQUEST)

        return Response({'message': ResponseMessages.POST_CREATE_SUCCESS}, status = status.HTTP_201_CREATED)

class PostDetail(APIView, OwnerPermissionMixin):
    def get(self, request: HttpRequest, **kwargs) -> Response:
        access_user, condition = self.check_post_owner(request.META.get('HTTP_AUTHORIZATION'), kwargs['username'], 'get_owner')
        post = PostModel.objects.get(id = kwargs['pk'])
        postSerializer = PostSerializer(post, context={'login_user_id': access_user.id})

        # 권한 확인(게시물 주인 확인)
        response_data = {
            'post': postSerializer.data,
            'isPostMine': condition
            }
        return Response(response_data, status.HTTP_200_OK)

    def put(self, request, **kwargs) -> Response:
        # 권한 확인
        access_user, condition = self.check_post_owner(request.META.get('HTTP_AUTHORIZATION'), kwargs['username'], 'get_owner')
        if not condition:
            return Response({'error': ResponseMessages.FORBIDDEN_ACCESS}, status = status.HTTP_403_FORBIDDEN)

        # Post 조회
        post = PostModel.objects.get(id = kwargs['pk'], user = access_user.id)
        prev_content = post.content
        new_content = request.data['content']
        
        # update 데이터가 전과 다르지 않아서, update하지 않음
        if prev_content == new_content:
            return Response({'message': ResponseMessages.POST_NOT_UPDATE}, status = status.HTTP_304_NOT_MODIFIED)
        
        post.content = request.data['content']
        post.save()

        return Response({'message': 'UPDATE SUCCESS'}, status = status.HTTP_200_OK)


    def delete(self, request, **kwargs) -> Response:
        # 권한 확인
        access_user, condition  = self.check_post_owner(request.META.get('HTTP_AUTHORIZATION'), kwargs['username'], 'get_owner')
        if not condition:
            return Response({'error': ResponseMessages.FORBIDDEN_ACCESS}, status.HTTP_403_FORBIDDEN)

        # delete
        post = PostModel.objects.get(id = kwargs['pk'], user = access_user.id)
        post.delete()
        return Response({'message' : ResponseMessages.POST_DELETE_SUCCESS}, status.HTTP_204_NO_CONTENT)

class ReportPost(APIView, OwnerPermissionMixin):
    def post(self, request, pk:int) -> Response:
        reportSerializer = ReportSerializer(data = request.data)
        reportSerializer.content_id = pk
        reportSerializer.reported = PostModel.objects.get(id = pk).user_id # 효율적일까?
        reportSerializer.reporter = self.extract_user_id_from_session(request.META.get('HTTP_AUTHORIZATION'))

        if not reportSerializer.is_valid():
            return Response({'error': ResponseMessages.INVALID_DATA}, status=status.HTTP_400_BAD_REQUEST)            

        reportSerializer.save()

        # 한 사람이 같은 게시물을 연속적으로 신고 가능?
        return Response({'message': ResponseMessages.REPORT_CREATE_SUCCESS}, status=status.HTTP_201_CREATED)
    
#TODO : 추천게시물이 좋아요순으로 정렬될 수 있게 수정
class RecommendPost(APIView, SessionDecoderMixin):
    def get(self, request: HttpRequest) -> Response:
        user = self.get_user_by_pk(request.META.get('HTTP_AUTHORIZATION', ''))

        posts = PostModel.objects.filter(date__startswith = date.today()).prefetch_related('like_set').select_related('user').annotate(like_count = Count('like')).order_by('-like_count').all()[:10]
        
        serializer = RecommendPostSerilaier(posts, many = True)

        return Response(serializer.data, status = status.HTTP_200_OK)

class Like(APIView, SessionDecoderMixin):
    def post(self, request, pk):
        user_pk = self.extract_user_id_from_session(request.META.get('HTTP_AUTHORIZATION', ''))
        like, created = LikeModel.objects.get_or_create(post_id=pk, user_id=user_pk)

        if not created:
            return Response({'message': ResponseMessages.LIKE_CONFLICT}, status=status.HTTP_409_CONFLICT)

        return Response({'message': ResponseMessages.LIKE_CREATE_SUCCESS}, status=status.HTTP_201_CREATED)

    def delete(self, request, pk):
        user_pk = self.extract_user_id_from_session(request.META.get('HTTP_AUTHORIZATION', ''))
        like = LikeModel.objects.filter(post_id=pk, user_id=user_pk)
        condition = like.exists()

        if not condition:
            return Response({'error': ResponseMessages.FORBIDDEN_ACCESS}, status.HTTP_403_FORBIDDEN)

        like.delete()
        return Response({'message': ResponseMessages.LIKE_DELETE_SUCCESS}, status = status.HTTP_204_NO_CONTENT)
