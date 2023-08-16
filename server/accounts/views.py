from typing import List

from django.conf import settings
from django.contrib.auth import login
from django.contrib.sessions.models import Session
from django.core.exceptions import ValidationError
from django.core.mail import send_mail
from django.core.validators import validate_email
from django.http import HttpRequest
from django.contrib.auth.hashers import make_password, check_password
from django.shortcuts import render
from django.template.loader import render_to_string
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils.crypto import get_random_string

from accounts.serializers import CampusSerializer, CourseSerializer, UserSerializer
from accounts.models import Campus, Course, User


class LoginView(APIView):
    def post(self, request: HttpRequest) -> Response:
        # DB와 비교
        user = User.objects.get(username = request.data['username'])
        if check_password(request.data['hashedPw'], user.password): # 비밀번호 확인
            login(request, user)
            return Response({'session_key': request.session.session_key, 'message': 'Login successful'}, status = status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalud credentials'}, status= status.HTTP_400_BAD_REQUEST)


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
        username = request.query_params.get('username')
        user = User.objects.filter(username = username)

        response = None
        if user :
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

def send_email_to_send_temporary_password(username, receiver):
    # subject = render_to_string("accounts/send_temporary_password_subject.txt", {'username' : username})
    subject = render_to_string("accounts/send_temporary_password_subject.txt", {'username': 'username'})
    content = render_to_string("accounts/email_template.html")
    sender_email = settings.DEFAULT_FROM_EMAIL

    try: # 메일의 유효성을 검사
        validate_email('xpsxm225@naver.com')
    except ValidationError as e:
        print(e.message)

    send_mail(
        subject,
        content,
        sender_email,
        # [receiver],
        ['xpsxm225@naver.com'],
        fail_silently=False,
        html_message = content
    )
class FindPasswordView(APIView): # 비밀번호 찾기
    def post(self, request: HttpRequest) -> Response:
        condition = User.objects.filter(username = request.data['username'], email = request.data['email']).exists()

        if condition:
            # temp_password = get_random_string(length=12)  # 12자리의 랜덤 문자열 생성
            send_email_to_send_temporary_password('', '')
            return Response({'message': '임시비밀번호를 이메일로 발송하였습니다.'}, status = status.HTTP_200_OK)
        else:
            return Response({'message': '비밀번호가 존재하지 않습니다'}, status = status.HTTP_404_NOT_FOUND)

def test_view_email_template(request):
    return render(request, 'accounts/email_template.html')
