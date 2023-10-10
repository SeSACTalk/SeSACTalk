import http

from django.contrib.auth import login, authenticate
from django.contrib.sessions.models import Session
from django.http import HttpRequest
from django.contrib.auth.hashers import make_password, check_password
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import BasePermission
from rest_framework.exceptions import PermissionDenied
from django.utils.crypto import get_random_string

import hashlib

from accounts.serializers import CampusSerializer, CourseSerializer, UserSerializer, UserWithdrawInfoSerializer
from accounts.models import Campus, Course, User
from profiles.models import Profile
from accounts.utils import send_email_to_send_temporary_password
from accounts.constants import ResponseMessages
from sesactalk.mixins import SessionDecoderMixin

class CheckSessionPermission(BasePermission, SessionDecoderMixin):
    def has_permission(self, request, view):
        user = self.get_user_by_pk(request.META.get('HTTP_AUTHORIZATION'))
        is_auth = user.is_auth

        # 0=가입, [10=승인, 11=임시비밀번호발급], [20=보류, 21=임시비밀번호사용], 30=거절
        if user and (is_auth == 10 or is_auth == 11):
            return True
        else:
            # 인증되지 않은 사용자에게 403 Forbidden 응답을 반환
            raise PermissionDenied(ResponseMessages.FORBIDDEN_ACCESS)

class UserInfoView(APIView, SessionDecoderMixin):
    permission_classes = [CheckSessionPermission]

    def get(self, request: HttpRequest) -> Response:
        user = self.get_user_by_pk(request.META.get('HTTP_AUTHORIZATION'))
        
        if user.is_staff:
            return Response({'role' : 'STAFF'}, status = status.HTTP_200_OK)
        
        return Response({'role' : 'USER'}, status = status.HTTP_200_OK)

class LoginView(APIView):
    def post(self, request: HttpRequest) -> Response:
        # DB와 비교
        user = authenticate(request, username = request.data['username'], password = request.data['hashedPw'])
        if user:
            login(request, user)
            data = {
                'session_key': request.session.session_key,
                'username': request.data['username'],
            }
            return Response(data, status = status.HTTP_200_OK)
        else:
            return Response({'error': ResponseMessages.INVALID_CREDENTIALS}, status = status.HTTP_400_BAD_REQUEST)

class LogoutView(APIView, SessionDecoderMixin):
    def delete(self, request: HttpRequest) -> Response:
        frontend_session_key = request.META.get('HTTP_AUTHORIZATION')
        
        user = self.get_user_by_pk(frontend_session_key)
            # 임시비밀번호 사용 중인 사용자의 is_auth를 보류로 변경
        if user.is_auth == 11:
            user.is_auth = 21
            user.save()
        Session.objects.filter(session_key = frontend_session_key).delete()
        return Response(status = status.HTTP_200_OK)

class SignUpView(APIView):
    def get(self, request: HttpRequest) -> Response:
        # 회원가입 폼의 캠퍼스의 셀렉트 옵션을 보낸다
        campuses = Campus.objects.all()
        campusSerializer = CampusSerializer(campuses, many = True)
        response_data = {
            'campus': campusSerializer.data,
        }
        # axios 요청
        campus_id = request.query_params.get('campus_id')
        if campus_id:
            courses_on_campus = Course.objects.filter(campus_id = campus_id)
            courseSerializer = CourseSerializer(courses_on_campus, many = True)
            response_data['course'] = courseSerializer.data

        return Response(response_data)

    def post(self, request) -> Response:
        # BE 암호화
        request.data['password'] = make_password(request.data['password'])
        userSerializer = UserSerializer(data = request.data)

        # 유효성 검사
        if userSerializer.is_valid():
            # user 생성
            user = userSerializer.save()
            # profile 생성
            profile = Profile.objects.create(user = user)
            profile.save()
            return Response({'message': ResponseMessages.CREATE_SUCCESS}, status = status.HTTP_201_CREATED)

        return Response({'error': userSerializer.errors}, status.HTTP_400_BAD_REQUEST)

class IdCheckView(APIView):
    def post(self, request) -> Response:
        condition = User.objects.filter(username = request.data['username']).exists()

        if condition :
            return Response({'error': ResponseMessages.DUPLICATE_ID})

        return Response({'message': ResponseMessages.AVAILABLE_ID})

class FindIdView(APIView): # 아이디 찾기
    def post(self, request: HttpRequest) -> Response:
        condition = User.objects.filter(name = request.data['name'], email = request.data['email']).exists()

        if not condition:
            return Response({'error': ResponseMessages.ID_NOT_FIND}, status = status.HTTP_404_NOT_FOUND)

        username = User.objects.filter(name = request.data['name'], email = request.data['email']).values('username')
        return Response({'username': username} , status = status.HTTP_200_OK)

class FindPasswordView(APIView): # 비밀번호 찾기
    def post(self, request: HttpRequest)-> Response:
        username = request.data['username']
        email = request.data['email']
        user = User.objects.filter(username=username, email=email).first()

        if not user:
            return Response({'error': ResponseMessages.USER_NOT_FIND}, status = status.HTTP_404_NOT_FOUND)

        temp_password = get_random_string(length=12)
        user.password = make_password(hashlib.sha256(temp_password.encode()).hexdigest())
        # 0=가입, [10=승인, 11=임시비밀번호발급], [20=보류, 21=임시비밀번호사용], 30=거절
        user.is_auth = 11
        user.save()

        send_email_to_send_temporary_password(username, email, temp_password)

        return Response({'message': ResponseMessages.SEND_EMAIL_SUCCESS}, status=status.HTTP_200_OK)

class VerifyPassword(APIView, SessionDecoderMixin):
    def post(self, request: HttpRequest)-> Response:
        user = self.get_user_by_pk(request.META.get('HTTP_AUTHORIZATION'))

        # 비밀번호 확인
        password_matched = check_password(request.data['password'], user.password)

        if not password_matched:
            return Response({'message' : ResponseMessages.PASSWORD_NOT_MATCH}, status = status.HTTP_400_BAD_REQUEST)

        return Response({'message' : ResponseMessages.PASSWORD_MATCH}, status = status.HTTP_200_OK)

class UserWithdraw(APIView, SessionDecoderMixin):
    def get(self, request: HttpRequest, username):
        user = self.get_user_by_pk(request.META.get('HTTP_AUTHORIZATION', ''))
        userWithdrawInfoSerializer = UserWithdrawInfoSerializer(user)

        return Response(userWithdrawInfoSerializer.data, status=status.HTTP_200_OK)


    def delete(self, request: HttpRequest, username):
        user = self.get_user_by_pk(request.META.get('HTTP_AUTHORIZATION', ''))
        user.is_auth = 0
        user.save()
        return Response({'message' : 'accounts successfully delete!'}, status=status.HTTP_204_NO_CONTENT)