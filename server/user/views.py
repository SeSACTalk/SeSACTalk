from django.db.models import Q
from django.http import HttpRequest
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

from profiles.models import Profile
from user.models import FCMToken, User, UserRelationship
from sesactalk.mixins import SessionDecoderMixin
from user.serializers import FollowerSerializer, FollowSerializer


class RegistreFCMTokenView(APIView):
    def post(self, request:HttpRequest, **kwargs) -> Response:
        username = kwargs['username']
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

class Follow(APIView, SessionDecoderMixin):
    def get(self, request:HttpRequest, profile_user_pk):
        follow_id_list = UserRelationship.objects.filter(user_follower = profile_user_pk).values_list('user_follow')
        profile = Profile.objects.filter(Q(user__in=follow_id_list)).select_related('user').order_by('-date')
        follow_serializer = FollowSerializer(profile, many=True)

        return Response(follow_serializer.data, status = status.HTTP_200_OK)
    def post(self, request:HttpRequest, profile_user_pk):
        pass
    def delete(self, request:HttpRequest, profile_user_pk):
        pass

class Follower(APIView, SessionDecoderMixin):
    def get(self, request:HttpRequest, profile_user_pk):
        follower_id_list = UserRelationship.objects.filter(user_follow = profile_user_pk).values_list('user_follower')
        profile = Profile.objects.filter(Q(user__in=follower_id_list)).select_related('user').order_by('-date')
        follower_serializer = FollowerSerializer(profile, many=True)
        
        return Response(follower_serializer.data, status = status.HTTP_200_OK)