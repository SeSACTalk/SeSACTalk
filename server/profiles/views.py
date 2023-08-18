from django.shortcuts import render
from django.http import HttpRequest
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from django.contrib.sessions.models import Session

from profiles.models import Profile
from user.models import User
from profiles.serializers import ProfileSerializer

# Create your views here.

class ProfileView(APIView):
    def get(self, request:HttpRequest, username: str) -> Response:
        # session_key로 user_id get
        frontend_session_key = request.META.get('HTTP_AUTHORIZATION', '').replace('Session ', '')
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

    # def post(self, request: HttpRequest) -> Response:
    #     #db의 프로필 데이터 수정
    #     img_path = 
    #     content = 
    #     link = 
    #     date = 
    #     course_status = 
    #     user = 