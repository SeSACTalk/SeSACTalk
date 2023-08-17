from django.conf import settings
from django.contrib.auth import login, authenticate
from django.contrib.sessions.models import Session
from django.core.exceptions import ValidationError
from django.core.mail import send_mail
from django.core.validators import validate_email
from django.http import HttpRequest
from django.contrib.auth.hashers import make_password
from django.template.loader import render_to_string
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import BasePermission
from rest_framework.exceptions import PermissionDenied
from django.utils.crypto import get_random_string

from datetime import datetime
import hashlib

from accounts.serializers import CampusSerializer, CourseSerializer, UserSerializer
from accounts.models import Campus, Course, User

class CheckSessionPermission(BasePermission):
    def has_permission(self, request, view):
        frontend_session_key = request.META.get('HTTP_AUTHORIZATION', '').replace('Session ', '')

        if Session.objects.filter(session_key = frontend_session_key).exists():
            return True
        else:
            # 인증되지 않은 사용자에게 403 Forbidden 응답을 반환
            raise PermissionDenied('You are not authenticated.')

class VerifyUserView(APIView):
    permission_classes = [CheckSessionPermission]

    def get(self, request: HttpRequest) -> Response:
        return Response({'message': 'Verified Session key'}, status = status.HTTP_200_OK)

class UserInfoView(APIView):
    def post(self, request: HttpRequest) -> Response:
        session = Session.objects.get(session_key = request.data['session_key'])
        user_id = session.get_decoded().get('_auth_user_id')
        
        user = User.objects.get(id = user_id)
        if user.is_staff:
            return Response(status = status.HTTP_200_OK)
        return Response(status = status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    def post(self, request: HttpRequest) -> Response:
        # DB와 비교
        user = authenticate(request, username = request.data['username'], password = request.data['hashedPw'])
        if user:
            login(request, user)
            data = {
                'session_key': request.session.session_key, 'id': user.id,
                'username': user.username
            }
            return Response(data, status = status.HTTP_200_OK)
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

def send_email_to_send_temporary_password(username : str, receiver : str, temp_password : str) -> None :
    current_time = datetime.now().strftime("%Y년 %m월 %d일 %H:%M:%S")
    subject = render_to_string("accounts/send_temporary_password_subject.txt", {'username' : username})
    content = render_to_string("accounts/email_template.html", {'current_time' : current_time, 'temp_password' : temp_password})
    sender_email = settings.DEFAULT_FROM_EMAIL

    try: # 메일의 유효성을 검사
        validate_email(receiver)
    except ValidationError as e:
        print(e.message)

    send_mail(
        subject,
        content,
        sender_email,
        [receiver],
        fail_silently=False,
        html_message = content
    )

class FindPasswordView(APIView): # 비밀번호 찾기
    def post(self, request: HttpRequest) -> Response:
        username = request.data['username']
        email = request.data['email']
        user = User.objects.filter(username=username, email=email).first()

        if user:
            temp_password = get_random_string(length=12)
            user.password = make_password(hashlib.sha256(temp_password.encode()).hexdigest())
            user.save()

            send_email_to_send_temporary_password(username, email, temp_password)
            return Response({'message': '임시비밀번호를 이메일로 발송하였습니다.'}, status = status.HTTP_200_OK)
        else:
            return Response({'message': '회원 정보가 존재하지 않습니다'}, status = status.HTTP_404_NOT_FOUND)
