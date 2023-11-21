from django.db.models import Q, Count
from django.http import HttpRequest
from datetime import date
from environ import Env
import requests

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

from post.models import Post as PostModel, Like, View, Reply, HashTag, Report
from accounts.models import User
from user.models import UserRelationship

from post.serializers import PostSerializer, LikeSerializer, ViewSerializer, ReplySerializer, HashTagSerializer, \
    ReportSerializer, ManagerProfileSerializer, RecommendPostSerilaier
from post.mixins import OwnerPermissionMixin
from post.constants import ResponseMessages

from profiles.models import Profile
from accounts.models import Campus, Course, User
from profiles.serializers import EditProfileSerializer
from accounts.serializers import UserSerializer, CampusSerializer, CourseSerializer
from sesactalk.mixins import SessionDecoderMixin

class Main(APIView):
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
        return Response(managerProfileSerializer.data, status = status.HTTP_200_OK)

class RecruitView(APIView, SessionDecoderMixin):
    def get(self, request: HttpRequest) -> Response:
        # user_exist = self.extract_user_id_from_session(request.META.get('HTTP_AUTHORIZATION'))
        
        # if not user_exist:
        #     return Response(status = status.HTTP_401_UNAUTHORIZED)
        
        # sramin api
        env=Env()
        try:
            primary_key=env('SARAMIN_ACCKESS_KEY')
            SW='개발'
            DT='기획'

            api_url = f"https://oapi.saramin.co.kr/job-search?access-key={primary_key}&keyword={SW}"
            response = requests.get(api_url, headers={"Accept": "application/json"})

            if response.status_code == 200:  # 정상 호출
                data = response.json()  # JSON 응답을 파싱
                print(data)
                return Response(data=data, status = status.HTTP_200_OK)
            elif response.status_code == 307:
                print('307')
                return Response(status = status.HTTP_307_TEMPORARY_REDIRECT)
            else:  # 에러 발생
                print(f"에러 발생 - 상태 코드: {response.status_code}")
                return Response(status = status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(e)
        return Response(status = status.HTTP_500_INTERNAL_SERVER_ERROR)


class Post(APIView, OwnerPermissionMixin):
    def get(self, request: HttpRequest, username) -> Response:
        # 권한 확인
        access_user, condition = self.check_post_owner(request.META.get('HTTP_AUTHORIZATION'), username, 'get_owner')
        if not condition:
            return Response({'error': ResponseMessages.FORBIDDEN_ACCESS}, status.HTTP_403_FORBIDDEN)

        # 팔로우 기반 또는 자신의 게시물 포스트를 가져오는 쿼리문 수행, order by의 - 기호는 역순을 의미
        user_s_follows = UserRelationship.objects.filter(user_follower=access_user.id)
        posts = PostModel.objects.filter(
            Q(user=access_user.id) | Q(user__in=user_s_follows.values('user_follow'))
        ).prefetch_related('tags').select_related('user').order_by('-date')

        # QuerySet이 비어있을 경우
        if not bool(posts):
            return Response({'message': ResponseMessages.POST_NO_POSTS_TO_DISPLAY}, status=status.HTTP_200_OK)

        # 반환할 게시물이 있는 경우
        postSerializer = PostSerializer(posts, many=True)
        for i, post in enumerate(posts): postSerializer.data[i]['username'] = post.user.username
        
        return Response(postSerializer.data, status=status.HTTP_200_OK)

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
        post = PostModel.objects.get(id = kwargs['pk'])
        postSerializer = PostSerializer(post)

        # 권한 확인(게시물 주인 확인)
        access_user_condition = self.check_post_owner(request.META.get('HTTP_AUTHORIZATION'), kwargs['username'])
        response_data = {
            'post': postSerializer.data,
            'isPostMine': access_user_condition
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

class ReportPost(OwnerPermissionMixin, APIView):
    def post(self, request, pk:int) -> Response:
        reportSerializer = ReportSerializer(data = request.data)
        reportSerializer.content_id = pk
        reportSerializer.reported = PostModel.objects.get(id = pk).user_id # 효율적일까?
        reportSerializer.reporter = self.extract_user_id_from_session(request.META.get('HTTP_AUTHORIZATION'))

        if not reportSerializer.is_valid():
            print(f'<<CHECK INVALID DATA>>\n{reportSerializer.errors}')
            return Response({'error': ResponseMessages.INVALID_DATA}, status=status.HTTP_400_BAD_REQUEST)            

        reportSerializer.save()

        # 한 사람이 같은 게시물을 연속적으로 신고 가능?
        return Response({'message': ResponseMessages.REPORT_CREATE_SUCCESS}, status=status.HTTP_201_CREATED)
    
class Replys(APIView, SessionDecoderMixin):
    def get(self, request: HttpRequest, p_sq: int)-> Response:
        user_id = self.extract_user_id_from_session(request.META.get('HTTP_AUTHORIZATION', ''))

        response_data=[]
        reply_querysets = Reply.objects.filter(post = p_sq)
        for reply in reply_querysets:
            data={}
            replySerializer = ReplySerializer(reply)
            # print(reply.user.id, reply.user.name)
            data['reply']=replySerializer.data
            profile_queryset = Profile.objects.select_related('user').filter(user__id = reply.user.id).first()
            if profile_queryset:
                profileSerializer = EditProfileSerializer(profile_queryset)
                data['profile']=profileSerializer.data

            # user_id와 reply_userid 값 비교(True == 내 댓글)
            data['isReplyMine'] = user_id == reply.user.id

            response_data.append(data)

        return Response(data=response_data, status=status.HTTP_200_OK)
    def post(self, request: HttpRequest, p_sq: int)-> Response:
        # 클라이언트에서 전송된 데이터 가져오기
        reply_text = request.data.get('replyText')

        user_id = self.extract_user_id_from_session(request.META.get('HTTP_AUTHORIZATION', ''))

        # Reply 모델에 데이터 삽입
        try:
            data={'content':reply_text, 'user':user_id, 'post':p_sq}
            replySerializer = ReplySerializer(data=data)
            
            if replySerializer.is_valid():
                replySerializer.save()
            else:
                print(f"댓글 유효성 검사 실패")
                print(f'<<CHECK INVALID DATA>>\n{replySerializer.errors}')

            print("댓글이 성공적으로 삽입되었습니다.")
            return Response(status=status.HTTP_200_OK)
        
        except Exception as e:
            print(f"댓글 삽입 중 오류 발생: {str(e)}")
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ReplyDetail(APIView, SessionDecoderMixin):
    def delete(self, request: HttpRequest, p_sq: int, r_sq: int)-> Response:
        # session_key로 user_id get
        user_id = self.extract_user_id_from_session(request.META.get('HTTP_AUTHORIZATION', ''))

        reply_queryset = Reply.objects.filter(id = r_sq).first()
        if reply_queryset.user.id == user_id:
            reply_queryset.delete()
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        return Response(status=status.HTTP_200_OK)
    
    def put(self, request: HttpRequest, p_sq: int, r_sq: int)-> Response:
        # session_key로 user_id get
        user_id = self.extract_user_id_from_session(request.META.get('HTTP_AUTHORIZATION', ''))

        reply_queryset = Reply.objects.get(id = r_sq)
        if reply_queryset.user.id == user_id:
            reply_queryset.content=request.data
            reply_queryset.save()
        else:
            return Response(status = status.HTTP_400_BAD_REQUEST)

        return Response(status = status.HTTP_200_OK)
    
class RecommendPost(APIView):
    def get(self, request: HttpRequest) -> Response:
        posts = PostModel.objects.filter(date__startswith = date.today()).prefetch_related('like_set').select_related('user').annotate(like_count = Count('like')).order_by('like_count').all()[:10]
        
        serializer = RecommendPostSerilaier(posts, many = True)
        
        return Response(serializer.data, status = status.HTTP_200_OK)