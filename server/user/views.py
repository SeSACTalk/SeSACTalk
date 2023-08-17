from django.http import HttpRequest
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from user.models import FCMToken, User

class RegistreFCMTokenView(APIView):
    def post(self, request:HttpRequest, **kwargs) -> Response:
        username = kwargs['username']
        if not username:
            return Response({'message': 'Username is required'}, status = status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({'message': 'User not found'}, status = status.HTTP_404_NOT_FOUND)

        token = request.data.get('token')
        
        if token:
            FCMToken.objects.update_or_create(user = user, defaults = {'token': token})
            return Response({'message': 'FCM token successfully registered'}, status = status.HTTP_201_CREATED)
        else:
            return Response({'message': 'FCM token is required'}, status = status.HTTP_400_BAD_REQUEST)