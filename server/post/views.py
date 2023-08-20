from django.http import HttpRequest
from django.utils.datastructures import MultiValueDictKeyError
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

from post.models import Post as PostModel, Like, View, Reply, HashTag, Report
from post.serializers import PostSerializer, LikeSerializer, ViewSerializer, ReplySerializer, HashTagSerializer, ReportSerializer
from post.mixins import PostOwnerPermissionMixin

class Post(APIView, PostOwnerPermissionMixin):
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

        # get [login user, condition(접근==login user)]
        user_who_accessed_post, condition_posting_user_is_same_as_login_user = self.check_post_owner\
            (request.META.get('HTTP_AUTHORIZATION'),\
             username,\
             'get_owner')

        # user_id와 username 값 비교하여 작성 주체 파악
        if condition_posting_user_is_same_as_login_user:
            content = request.data['content']

            try:  # 이미지 파일이 없을 경우 예외 처리
                img_path = request.FILES['img_path']
                post = PostModel.objects.create(content=content, img_path=img_path, user=user_who_accessed_post)
            except MultiValueDictKeyError as exception:
                print(exception)
                post = PostModel.objects.create(content=content, user=user_who_accessed_post)

            if content and len(content) <= 500: # content의 길이 제한(500자 이하)
                post.save()
                return Response({'message': 'Post Upload Success'}, status=status.HTTP_201_CREATED)
            else:
                print('content의 길이가 500자를 초과')
                return Response({'error' : 'content의 길이가 500자를 초과하였습니다.'}, status.HTTP_400_BAD_REQUEST)

        # 요청이 서버에 도달했지만, 사용자의 경로 조작으로 서버가 해당 요청을 거부
        return Response({'error' : '잘못된 접근입니다.'}, status.HTTP_403_FORBIDDEN)


class PostDetail(APIView, PostOwnerPermissionMixin):
    def get(self, request: HttpRequest, **kwargs) -> Response:
        # get condition(접근==login user)
        condition_read_user_is_same_as_login_user = self.check_post_owner(request.META.get('HTTP_AUTHORIZATION'),\
                                                        kwargs['username'])

        # 내가 작성한 글인지
        response_data = {
            'isPostMine' : False
        }
        if condition_read_user_is_same_as_login_user:
            response_data['isPostMine'] = True

        return Response(response_data, status.HTTP_200_OK)

    def put(self, request, **kwargs) -> Response:
        # condition 정의
        condition_same_from_previous_data = request.data['original_content'] == request.data['update_content']
        user_who_accessed_post, condition_edit_user_is_same_as_login_user  = self.check_post_owner\
                                                                            (request.META.get('HTTP_AUTHORIZATION'),\
                                                                             kwargs['username'],\
                                                                             'get_owner')
        if condition_edit_user_is_same_as_login_user:
            if condition_same_from_previous_data:
                # update 데이터가 전과 다르지 않아서, update하지 않았음을 응답
                return Response({'message': ''}, status.HTTP_304_NOT_MODIFIED)

            # update
            post = PostModel.objects.get(id = kwargs['pk'], user=user_who_accessed_post.id)
            post.content = request.data['update_content']
            post.save()
            return Response({'message': 'UPDATE SUCCESS'}, status.HTTP_200_OK)

        return Response({'error': '잘못된 접근입니다.'}, status.HTTP_403_FORBIDDEN)

    def delete(self, request, **kwargs) -> Response:
        user_who_accessed_post, condition_delete_user_is_same_as_login_user  = self.check_post_owner\
                                                                            (request.META.get('HTTP_AUTHORIZATION'),\
                                                                             kwargs['username'],\
                                                                             'get_owner')

        if (condition_delete_user_is_same_as_login_user):
            post = PostModel.objects.get(id = kwargs['pk'], user = user_who_accessed_post.id)
            post.delete()
            return Response({'message' : 'DELETE SUCCESS'}, status.HTTP_204_NO_CONTENT)

        return Response({'error' : '잘못된 접근입니다.'}, status.HTTP_403_FORBIDDEN)