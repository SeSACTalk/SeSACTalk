from django.contrib.auth import authenticate, login
from django.contrib.sessions.models import Session
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import HttpRequest

from accounts.models import User

class LoginView(APIView):
    def post(self, request: HttpRequest) -> Response:
        # FE로부터 받은 아이디,비밀번호
        username = request.data.get('username')
        password = request.data.get('password')

        # DB와 비교
        user = authenticate(username = username, password = password)
        if user is not None: # 계정이 있을경우
            login(request, user)
            return Response({'session_key': request.session.session_key, 'message': 'Login successful'}, status = status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalud credentials'}, status= status.HTTP_400_BAD_REQUEST)

class CheckIdView(APIView): # 아이디 찾기
    def post(self, request: HttpRequest) -> Response:
        condition = User.objects.filter(name = request.data['name'], email = request.data['email']).exists()

        if condition:
            username = User.objects.filter(name = request.data['name'], email = request.data['email']).values('username')

            return Response({'message': '정상적인 요청입니다', 'username': username} , status = status.HTTP_200_OK)
        else:
            return Response({'message': '아이디가 존재하지 않습니다'}, status = status.HTTP_404_NOT_FOUND)