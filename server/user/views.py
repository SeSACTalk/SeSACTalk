from django.http import HttpRequest
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

from user.models import FCMToken, User
from sesactalk.mixins import SessionDecoderMixin

class RegistreFCMTokenView(APIView, SessionDecoderMixin):
    def post(self, request:HttpRequest, **kwargs) -> Response:
        username = kwargs['username']
        user_exist = self.extract_user_id_from_session(request.META.get('HTTP_AUTHORIZATION', ''))

        if not username:
            return Response({'message': 'Username is required'}, status = status.HTTP_400_BAD_REQUEST)
        try:
            user = User.objects.get(username = username)
        except User.DoesNotExist:
            return Response({'message': 'User not found'}, status = status.HTTP_404_NOT_FOUND)

        token = request.data.get('token')
        
        if token:
            FCMToken.objects.update_or_create(user = user, defaults = {'token': token})
            return Response({'message': 'FCM token successfully registered'}, status = status.HTTP_201_CREATED)
        else:
            return Response({'message': 'FCM token is required'}, status = status.HTTP_400_BAD_REQUEST)