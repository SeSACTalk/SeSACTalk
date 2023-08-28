from django.shortcuts import render
from django.http import HttpRequest
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from django.contrib.sessions.models import Session

from profiles.models import Profile
from user.models import User
from profiles.serializers import ProfileSerializer, EditProfileSerializer
from accounts.serializers import UserSerializer

# Create your views here.

class ProfileView(APIView):
    def get(self, request:HttpRequest, username: str) -> Response:
        # session_key로 user_id get
        frontend_session_key = request.META.get('HTTP_AUTHORIZATION', '')
        session = Session.objects.get(session_key = frontend_session_key)
        user_id = session.get_decoded().get('_auth_user_id')
        
        data = None

        # user_id와 username 값 비교(True == 내 프로필)
        if (username == User.objects.get(id=user_id).username):
            profile = Profile.objects.get(user=user_id)

            profileSerializer=ProfileSerializer(profile)
            data=profileSerializer.data
            data['isProfileMine'] = 'True'
        else: 
            try: # 경로로 넘어온 username의 조회 결과가 None일 때 exception
                user_id = User.objects.get(username=username).id
                profile=Profile.objects.get(user=user_id)

                profileSerializer=ProfileSerializer(profile)
                data=profileSerializer.data
                data['isProfileMine'] = 'False'
            except Exception:
                print(Exception)
                return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)
            
        return Response(data = data, status=status.HTTP_200_OK)


class EditProfileView(APIView):
    def get(self, request:HttpRequest, username: str) -> Response:
        # session_key로 user_id get
        frontend_session_key = request.META.get('HTTP_AUTHORIZATION', '')
        session = Session.objects.get(session_key = frontend_session_key)
        user_id = session.get_decoded().get('_auth_user_id')

        data = None

        # user_id와 username 값 비교(True == 내 프로필)
        if (username == User.objects.get(id=user_id).username):
            try:
                # User, Profile, Course, and Campus 모델을 조인하여 필요한 필드들을 조회
                profile_queryset = Profile.objects.select_related('user').filter(user__username = username).first()
                profileSerializers = EditProfileSerializer(profile_queryset)

                # profile_queryset.user.first_course.campus.name
                # queryset = User.objects.select_related('profile', 'first_course__campus', 'second_course__campus').filter(profile__isnull=False, id=user_id)

                # result = queryset.values(
                #     'id', 'username', 'name', 'birthdate', 'phone_number', 'email',
                #     'profile__img_path', 'profile__content', 'profile__link', 'profile__course_status',
                #     'first_course__name', 'first_course__campus__name', 'second_course__name', 'second_course__campus__name'
                # ).first()

                # # 직렬화
                # if result:
                #     data={
                #         'id': result['id'],
                #         'username': result['username'],
                #         'name': result['name'],
                #         'birthdate': result['birthdate'],
                #         'phone_number': result['phone_number'],
                #         'email': result['email'],
                #         'img_path': result['profile__img_path'],
                #         'content': result['profile__content'],
                #         'link': result['profile__link'],
                #         'course_status': result['profile__course_status'],
                #         'first_course': result['first_course__name'],
                #         'first_course_campus_name': result['first_course__campus__name'],
                #         'second_course': result['second_course__name'],
                #         'second_course_campus_name': result['second_course__campus__name'],
                #     }

            except Exception:
                print(Exception)
                return Response({'error': 'EditProfile not found'}, status=status.HTTP_404_NOT_FOUND)
        
            return Response(data = profileSerializers.data, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'EditProfile not found'}, status=status.HTTP_404_NOT_FOUND)
        
    def put(self, request:HttpRequest, username: str) -> Response:
        # session_key로 user_id get
        frontend_session_key = request.META.get('HTTP_AUTHORIZATION', '')
        session = Session.objects.get(session_key = frontend_session_key)
        user_id = session.get_decoded().get('_auth_user_id')

        # try:
        #     editProfileUserData=request.data.get('editProfileUserData')
        #     editProfileUserDataSerializer=EditProfileSerializer(data=editProfileUserData)
        #     if editProfileUserDataSerializer.is_valid():

        #         data=editProfileUserDataSerializer.data
        #         print(data)
        #         return Response({'message': 'Data updated successfully'}, status=status.HTTP_200_OK)
        #     else:
        #         print('유효성 에러')
        #         return Response(editProfileUserDataSerializer.errors, status=status.HTTP_400_BAD_REQUEST)
        # except Exception as e:
        #     return Response({'역직렬화 에러': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # 역직렬화
        editProfileUserData=request.data.get('editProfileUserData')
        userObj = User.objects.get(id=user_id)
        profileObj = Profile.objects.get(user=user_id)

        userObj.id = editProfileUserData.get('id')
        userObj.username = editProfileUserData.get('username')
        userObj.name = editProfileUserData.get('name')
        userObj.birthdate = editProfileUserData.get('birthdate')
        userObj.phone_number = editProfileUserData.get('phone_number')
        userObj.email = editProfileUserData.get('email')
        password = editProfileUserData.get('password')
        
        profileObj.img_path = editProfileUserData.get('img_path')
        profileObj.content = editProfileUserData.get('content')
        profileObj.link = editProfileUserData.get('link')
        profileObj.course_status = editProfileUserData.get('course_status')
        
        first_course = editProfileUserData.get('first_course')
        first_course_campus_name = editProfileUserData.get('first_course_campus_name')
        second_course = editProfileUserData.get('second_course')
        second_course_campus_name = editProfileUserData.get('second_course_campus_name')
        
        userObj.save()
        profileObj.save()

        print(userObj.birthdate)
        print(profileObj)

        return Response({'message': 'Data updated successfully'}, status=status.HTTP_200_OK)