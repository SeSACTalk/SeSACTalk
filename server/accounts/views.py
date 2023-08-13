from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from django.contrib.sessions.models import Session
from django.http import HttpRequest
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import CampusSerializer, CourseSerializer, UserSerializer
from .models import Campus, Course, User
import hashlib

class LoginView(APIView):
    def post(self, request: HttpRequest) -> Response:
        # FE로부터 받은 아이디,비밀번호
        username = request.data.get('username')
        password = request.data.get('password')

        # DB와 비교
        user = authenticate(username=username, password=password)
        if user is not None: # 계정이 있을경우
            login(request, user)
            return Response({'session_key': request.session.session_key, 'message': 'Login successful'})
        else:
            return Response({'error': 'Invalud credentials'}, status=400)

class SignUpView(APIView):
    def get(self, request: HttpRequest) -> Response:
        campus_id = request.query_params.get('campus_id')

        campuses = Campus.objects.all()
        courses_on_campus = Course.objects.filter(campus_id=campus_id)

        campusSerializer = CampusSerializer(campuses, many = True)
        courseSerializer = CourseSerializer(courses_on_campus, many = True)

        response_data = {
            'campus': campusSerializer.data,
        }

        if campus_id:
            response_data['course'] = courseSerializer.data

        return Response(response_data)
    
    def post(self, request) -> Response:
        user_info = request.data
        hashedPw = hashlib.sha256(request.data['hashedPw'].encode('utf-8')).hexdigest()
        print(user_info, hashedPw)
        User.objects.create_user(user_info['username'], hashedPw)
        return Response({'message': 'SignUp Success'})

