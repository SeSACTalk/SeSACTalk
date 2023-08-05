from django.contrib.auth import authenticate, login
from django.contrib.sessions.models import Session
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

class LoginView(APIView):
    def post(self, request):
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

