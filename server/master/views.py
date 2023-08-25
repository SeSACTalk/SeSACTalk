from django.http import HttpRequest
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

from accounts.models import User
from master.serializers import UserSerializer, UserAuthSerializer

class UserListView(APIView):
    def get(self, request: HttpRequest) -> Response:
        auth_users = User.objects.exclude(is_auth = 0).all()
        serializer = UserSerializer(auth_users, many = True)

        return Response(serializer.data, status = status.HTTP_200_OK)

class UserDetailVeiw(APIView):
    def get(self, request: HttpRequest, **kwargs) -> Response:
        user_id = kwargs['id']
        user = User.objects.get(id = user_id)
        serializer = UserSerializer(user)

        return Response(serializer.data, status = status.HTTP_200_OK)
    
    def put(self, request: HttpRequest, **kwargs) -> Response:
        user_id = kwargs['id']
        user = User.objects.get(id = user_id)
        serializer = UserSerializer(user, data = request.data, partial = True )
        if serializer.is_valid():
            serializer.save()
            return Response({'message':'수정되었습니다'}, status = status.HTTP_201_CREATED)
        return Response({'message':'다시 시도해주세요'}, status = status.HTTP_400_BAD_REQUEST)

class UserAuthRequestView(APIView):
    def get(self, request: HttpRequest) -> Response:
        users = User.objects.exclude(is_auth = 1).all()
        serializer = UserAuthSerializer(users, many = True)

        return Response(serializer.data, status = status.HTTP_200_OK)
    
    def put(self, request: HttpRequest) -> Response:
        user = User.objects.get(id = request.data['id'])
        serializer = UserAuthSerializer(user, data = request.data, partial = True)
        if serializer.is_valid():
            serializer.save()
            return Response({'message':'수정되었습니다'}, status = status.HTTP_201_CREATED)
        return Response({'message':'다시 시도해주세요'}, status = status.HTTP_400_BAD_REQUEST)