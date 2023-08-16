from django.contrib.auth import login
from django.contrib.sessions.models import Session
from django.http import HttpRequest
from django.contrib.auth.hashers import make_password, check_password
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import BasePermission
from rest_framework.exceptions import PermissionDenied

from accounts.serializers import CampusSerializer, CourseSerializer, UserSerializer
from accounts.models import Campus, Course, User

class CheckSessionPermission(BasePermission):
    def has_permission(self, request, view):
        frontend_session_key = request.META.get('HTTP_AUTHORIZATION', '').replace('Session ', '')

        if Session.objects.filter(session_key=frontend_session_key).exists():
            return True
        else:
            # 인증되지 않은 사용자에게 403 Forbidden 응답을 반환
            raise PermissionDenied('You are not authenticated.')

class VerifyUserView(APIView):
    permission_classes = [CheckSessionPermission]

    def get(self, request: HttpRequest) -> Response:
        return Response({'message': 'Verified Session key'}, status=status.HTTP_200_OK)

class LoginView(APIView):
    def post(self, request: HttpRequest) -> Response:
        # DB와 비교
        user = User.objects.get(username = request.data['username'])
        if check_password(request.data['hashedPw'], user.password): # 비밀번호 확인
            login(request, user)
            print(request.session.session_key)
            return Response({'session_key': request.session.session_key, 'message': 'Login successful'}, status = status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalud credentials'}, status = status.HTTP_400_BAD_REQUEST)


class SignUpView(APIView):
    def get(self, request: HttpRequest) -> Response:
        campus_id = request.query_params.get('campus_id')

        campuses = Campus.objects.all()
        campusSerializer = CampusSerializer(campuses, many = True)

        response_data = {
            'campus': campusSerializer.data,
        }

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
            userSerializer.save()
            return Response({'message': 'Signup Success'}, status = status.HTTP_201_CREATED)
        else:
            print(f'불일치 데이터: {userSerializer.errors}')

        return Response(userSerializer.errors, status.HTTP_400_BAD_REQUEST)


class IdCheckView(APIView):
    def post(self, request) -> Response:
        condition = User.objects.filter(username = request.data['username']).exists()

        response = None
        if condition :
            response = Response({'result': 'unavailable'})
        else :
            response = Response({'result': 'available'})

        return response

class FindIdView(APIView): # 아이디 찾기
    def post(self, request: HttpRequest) -> Response:
        condition = User.objects.filter(name = request.data['name'], email = request.data['email']).exists()

        if condition:
            username = User.objects.filter(name = request.data['name'], email = request.data['email']).values('username')

            return Response({'message': '정상적인 요청입니다', 'username': username} , status = status.HTTP_200_OK)
        else:
            return Response({'message': '아이디가 존재하지 않습니다'}, status = status.HTTP_404_NOT_FOUND)
