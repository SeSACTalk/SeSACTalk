from django.contrib.auth.hashers import make_password
from django.db.models import Count, Subquery, OuterRef, F
from django.http import HttpRequest
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

from post.constants import ResponseMessages
from post.models import Post, Reply, Like
from post.serializers import PostSetSerializer, ReplysSetSerializer, LikesSetSerializer
from profiles.models import Profile
# from user.models import User
from accounts.models import Campus, Course, User
from profiles.serializers import ProfileSerializer, ProfileSetSerializer, EditProfileSerializer
from accounts.serializers import UserSerializer, CampusSerializer, CourseSerializer
from sesactalk.mixins import SessionDecoderMixin
from user.models import UserRelationship


# Create your views here.

class ProfileView(APIView, SessionDecoderMixin):
    def get(self, request:HttpRequest, username: str) -> Response:
        # session_key로 user_id get
        profile_user_id = user_id = self.extract_user_id_from_session(request.META.get('HTTP_AUTHORIZATION', ''))
        isProfileMine = username == User.objects.get(id=user_id).username

        # user_id와 username 값 비교(True == 내 프로필)
        if not isProfileMine:
            try: # 경로로 넘어온 username의 조회 결과가 None일 때 exception
                profile_user_id = User.objects.get(username=username).id
            except Exception:
                print(Exception)
                return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)

        profile = Profile.objects.filter(user=profile_user_id).select_related('user').annotate(
            post_count=Count('user__post'),
            follow_count=Subquery(
                UserRelationship.objects.filter(user_follower=OuterRef('user')).values('user_follower').annotate(
                    follow_count=Count('user_follower')
                ).values('follow_count')[:1]
            ),
            follower_count=Subquery(
                UserRelationship.objects.filter(user_follow=OuterRef('user')).values('user_follow').annotate(
                    follower_count=Count('user_follow')
                ).values('follower_count')[:1]
            )
        ).first()

        # 해당 프로필 유저를 팔로우하는 지 여부
        follow_status = UserRelationship.objects.filter(user_follow = profile_user_id, user_follower = user_id).exists()
        print(follow_status)
        profileSerializer = ProfileSetSerializer(profile)
        data = profileSerializer.data
        data['isProfileMine'] = isProfileMine
        data['followStatus'] = follow_status

        return Response(data = data, status=status.HTTP_200_OK)


class EditProfileView(APIView, SessionDecoderMixin):
    def get(self, request:HttpRequest, username: str) -> Response:
        # session_key로 user_id get
        profile_user_id = user_id = self.extract_user_id_from_session(request.META.get('HTTP_AUTHORIZATION', ''))
        
        # user_id와 username 값 비교(True == 내 프로필)
        if (username == User.objects.get(id=user_id).username):
            try:
                # User, Profile, Course, and Campus 모델을 조인하여 필요한 필드들을 조회
                profile_queryset = Profile.objects.select_related('user').filter(user__username = username).first()
                profileSerializers = EditProfileSerializer(profile_queryset)

                # 프로필 수정 폼의 캠퍼스 셀렉트 옵션을 보낸다.
                campuses = Campus.objects.all()
                campusSerializer = CampusSerializer(campuses, many = True)

                response_data = {
                    'profile' : profileSerializers.data,
                    'campus': campusSerializer.data,
                }

                # 과정 axios 요청
                campus_id = request.query_params.get('campus_id')
                print('campusid :', campus_id)
                if campus_id:
                    courses_on_campus = Course.objects.filter(campus_id = campus_id)
                    courseSerializer = CourseSerializer(courses_on_campus, many = True)
                    response_data['course'] = courseSerializer.data

                print(response_data)


            except Exception:
                print(Exception)
                return Response({'error': 'EditProfile not found'}, status=status.HTTP_404_NOT_FOUND)

            return Response(data = response_data, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'EditProfile not found'}, status=status.HTTP_404_NOT_FOUND)

    def copyDict(self, key_list:list, dict_to_copy:dict):
        result = {}
        for key, value in dict_to_copy.items():
            if key in key_list:
                result[key] = value

        return result
    def put(self, request:HttpRequest, username: str) -> Response:
        # session_key로 user_id get
        user_id = self.extract_user_id_from_session(request.META.get('HTTP_AUTHORIZATION', ''))

        # 데이터 분류
        user_keys = ['birthdate','phone_number','password','second_course']
        profile_keys = ['img_path','content','link', 'course_status']
        keys = user_keys + ['img_path','content','link']
        dict = {}

        for key in keys :
            value = request.data[key]
            if value and value not in ['null', '/media/profile/default_profile.png']:
                if key in ['second_course', 'password', 'img_path']:
                    if key == 'second_course' :
                        if value :
                            dict['course_status'] = False
                            try:
                                # request.data['second_course']가 int값일 때만 update값으로 사용
                                dict[key] = int(value)
                            except:
                                pass
                    if key == 'password':
                        dict[key] = make_password(value)
                    if key == 'img_path':
                        dict[key] = request.FILES.get(key, None)
                        print(f"confirm : {request.FILES.get(key, None)}")
                else :
                    dict[key] = value

        user_dict = self.copyDict(user_keys, dict)
        profile_dict = self.copyDict(profile_keys, dict)

        print(profile_dict)

        # update
        userSerializer = UserSerializer(User.objects.get(pk=user_id), data = user_dict, partial=True)
        profileSerializer = ProfileSerializer(Profile.objects.get(user_id=user_id),data = profile_dict, partial=True)

        if userSerializer.is_valid() and profileSerializer.is_valid():
            userSerializer.save()
            profileSerializer.save()

            return Response({'message': 'Data updated successfully'}, status=status.HTTP_200_OK)
        else:
            errors = {
                'user' : userSerializer.errors,
                'profile' : profileSerializer.errors
            }
            return Response({'errors': errors}, status.HTTP_400_BAD_REQUEST)


class ProfilePost(APIView, SessionDecoderMixin):
    def get(self, request:HttpRequest, user_pk: int) -> Response:
        posts = Post.objects.filter(user = user_pk)\
                            .select_related('user')\
                            .prefetch_related('tags', 'like_set', 'reply_set')\
                            .order_by('-date')

        postSetSerializer = PostSetSerializer(posts, many = True)

        # QuerySet이 비어있을 경우
        if not bool(posts):
            return Response({'message': ResponseMessages.POST_NO_POSTS_TO_DISPLAY}, status=status.HTTP_200_OK)

        return Response(postSetSerializer.data, status=status.HTTP_200_OK)

class ProfileLike(APIView, SessionDecoderMixin):
    def get(self, request:HttpRequest, user_pk: int) -> Response:
        # Reply 쿼리
        likes = Like.objects.filter(user=user_pk) \
            .select_related('user', 'post')\
            .annotate(post_user_username=F('post__user__username'), post_user_name=F('post__user__name')) \
            .order_by('-date')

        likesSetSerializer = LikesSetSerializer(likes, many=True)

        # QuerySet이 비어있을 경우
        if not bool(likes):
            return Response({'message': ResponseMessages.NO_LIKES_TO_DISPLAY}, status=status.HTTP_200_OK)

        print(likesSetSerializer.data)

        return Response(likesSetSerializer.data, status=status.HTTP_200_OK)

class ProfileReply(APIView, SessionDecoderMixin):
    def get(self, request:HttpRequest, user_pk: int) -> Response:
        # Reply 쿼리
        replys = Reply.objects.filter(user=user_pk) \
            .select_related('user', 'post')\
            .annotate(post_user_username=F('post__user__username'), post_user_name=F('post__user__name')) \
            .order_by('-date')

        replysSetSerializer = ReplysSetSerializer(replys, many=True)

        # QuerySet이 비어있을 경우
        if not bool(replys):
            return Response({'message': ResponseMessages.NO_REPLY_TO_DISPLAY}, status=status.HTTP_200_OK)

        return Response(replysSetSerializer.data, status=status.HTTP_200_OK)