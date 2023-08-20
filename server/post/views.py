from django.contrib.sessions.models import Session
from django.http import HttpRequest
from django.utils.datastructures import MultiValueDictKeyError
from rest_framework import status
from rest_framework.generics import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response

from accounts.models import User
from post.models import Post as PostModel, Like, View, Reply, HashTag, Report
from post.serializers import PostSerializer, LikeSerializer, ViewSerializer, ReplySerializer, HashTagSerializer, ReportSerializer

class Post(APIView):
    def get(self, request: HttpRequest, username) -> Response:
        # TODO: follow기반으로 수정(+내 글도 보여야 함), 경로 조작 시 403 에러내도록 검증 로직 필요(upgrade로직==Mixin class 만들기), 수정하면서 try except문 작성하기(QuerySet결과가 None일 때)
        # select_related()함수로, for post in posts 루프 안에서 post.user 문장으로 인한 N+1 쿼리문제를 해결할 수 있음
        # select_related는 Forien key로 연결된 객체 데이터를 미리 가져오는 역할.
        posts = PostModel.objects.select_related('user').all()

        postSerializer = PostSerializer(posts, many=True)

        for i, post in enumerate(posts):
            user = post.user
            postSerializer.data[i]['username'] = user.username

        return Response(postSerializer.data, status=status.HTTP_200_OK)

    def post(self, request: HttpRequest, username) -> Response:
        # TODO: 파일 유형 검증, 파일 크기 제한, 보안적 검증 등에 대한 오류 처리 및 로깅하기
        # session_key로 user_id get
        frontend_session_key = request.META.get('HTTP_AUTHORIZATION')
        session = Session.objects.get(session_key=frontend_session_key)
        user_id = session.get_decoded().get('_auth_user_id')

        # TODO: user가 찾아지지 않을 때 예외 처리하기
        user = User.objects.get(id=user_id)

        # user_id와 username 값 비교하여 작성 주체 파악
        if (username == user.username):
            content = request.data['content']
            try:  # 이미지 파일이 없을 경우 예외 처리
                img_path = request.FILES['img_path']
                post = PostModel.objects.create(content=content, img_path=img_path, user=user)
            except MultiValueDictKeyError as exception:
                print(exception)
                post = PostModel.objects.create(content=content, user=user)

            if content and len(content) <= 500: # content의 길이 제한(500자 이하)
                post.save()
                return Response({'message': 'Post Upload Success'}, status=status.HTTP_201_CREATED)
            else:
                print('content의 길이가 500자를 초과')
                return Response({'error' : 'content의 길이가 500자를 초과하였습니다.'}, status.HTTP_400_BAD_REQUEST)

        # 요청이 서버에 도달했지만, 사용자의 경로 조작으로 서버가 해당 요청을 거부
        return Response({'error' : '잘못된 접근입니다.'}, status.HTTP_403_FORBIDDEN)


class PostDetail(APIView):
    def get(self, request: HttpRequest, **kwargs) -> Response:
        frontend_session_key = request.META.get('HTTP_AUTHORIZATION')
        session = Session.objects.get(session_key=frontend_session_key)
        user_id = session.get_decoded().get('_auth_user_id')

        # TODO: user가 찾아지지 않을 때 예외 처리하기
        user = User.objects.get(id=user_id)

        # 내가 작성한 글인지
        response_data = { 
            'isPostMine' : False
        }
        if (kwargs['username'] == user.username):
            response_data['isPostMine'] = True

        return Response(response_data, status.HTTP_200_OK)

    def post(self, request: HttpRequest, **kwargs) -> Response:
        pass

    def put(self, request, **kwargs) -> Response:
        pass

    def delete(self, request, **kwargs) -> Response:
        frontend_session_key = request.META.get('HTTP_AUTHORIZATION')
        session = Session.objects.get(session_key=frontend_session_key)
        user_id = session.get_decoded().get('_auth_user_id')

        user = User.objects.get(id=user_id)

        if (kwargs['username'] == user.username):
            post = PostModel.objects.get(id = request.data['id'], user=user_id)
            post.delete()
            return Response({'message' : 'DELETE SUCCESS'}, status.HTTP_204_NO_CONTENT)

        return Response({'error' : '잘못된 접근입니다.'}, status.HTTP_403_FORBIDDEN)