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
        campusSerializer = CampusSerializer(campuses, many=True)

        response_data = {
            'campus': campusSerializer.data,
        }

        if campus_id:
            courses_on_campus = Course.objects.filter(campus_id=campus_id)
            courseSerializer = CourseSerializer(courses_on_campus, many=True)
            response_data['course'] = courseSerializer.data

        return Response(response_data)

    def post(self, request) -> Response:
        # BE 암호화
        request.data['password'] = hashlib.sha256(request.data['password'].encode('utf-8')).hexdigest()
        
        userSerializer = UserSerializer(data=request.data)

        # 유효성 검사
        if userSerializer.is_valid():
            userSerializer.save()
            return Response({'message': 'Signup Success'}, status=status.HTTP_201_CREATED)
        else:
            print(f'불일치 데이터 : {userSerializer.errors}')

        return Response(userSerializer.errors, status.HTTP_400_BAD_REQUEST)


class IdCheckView(APIView):
    def post(self, request) -> Response:
        username = request.query_params.get('username')
        user = User.objects.filter(username=username)

        response = None
        if user :
            response = Response({'result': 'unavailable'})
        else :
            response = Response({'result': 'available'})

        return response

