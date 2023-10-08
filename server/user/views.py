from django.db.models import Q
from django.http import HttpRequest
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

from user.models import FCMToken, User, UserRelationship
from user.mixins import FollowInformationHandlerMixin
from user.serializers import FollowerSerializer, FollowSerializer
from user.constants import ResponseMessages


class RegistreFCMTokenView(APIView):
    def post(self, request:HttpRequest, **kwargs) -> Response:
        username = kwargs['username']
        if not username:
            return Response({'message': ResponseMessages.REQUIRES_USERNAME}, status = status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(username = username)
        except User.DoesNotExist:
            return Response({'message': ResponseMessages.USER_NOT_FOUND}, status = status.HTTP_404_NOT_FOUND)

        token = request.data.get('token')
        
        if token:
            FCMToken.objects.update_or_create(user = user, defaults = {'token': token})
            return Response({'message': ResponseMessages.FCM_TOKEN_REGISTER}, status = status.HTTP_201_CREATED)
        else:
            return Response({'message': ResponseMessages.REQUIRES_FCM_TOKEN}, status = status.HTTP_400_BAD_REQUEST)

class Follow(APIView, FollowInformationHandlerMixin):
    def get(self, request:HttpRequest, profile_user_pk):
        is_profile_mine = bool(request.GET['is_profile_mine'].lower() == "true")
        follow_id_list = UserRelationship.objects.filter(user_follower = profile_user_pk).values_list('user_follow')
        response_data = []

        if is_profile_mine :
            user = User.objects.filter(Q(id__in=follow_id_list)).order_by('-signup_date')
            response_data = FollowSerializer(user, many=True).data
        else:
            response_data = self.get_follow_status_info(
                request.META.get('HTTP_AUTHORIZATION', ''), follow_id_list, FollowSerializer()
            )

        return Response(response_data, status = status.HTTP_200_OK)
    def post(self, request:HttpRequest, profile_user_pk):
        user = self.get_user_by_pk(request.META.get('HTTP_AUTHORIZATION', ''))
        target_user = User.objects.get(pk = profile_user_pk)
        # 팔로우
        UserRelationship.objects.create(user_follow = target_user, user_follower = user)

        return Response({'message' : ResponseMessages.FOLLOW_CREATE_SUCCESS}, status = status.HTTP_200_OK)

    def delete(self, request:HttpRequest, profile_user_pk):
        user_id = self.extract_user_id_from_session(request.META.get('HTTP_AUTHORIZATION', ''))
        UserRelationship.objects.filter(user_follow = profile_user_pk, user_follower = user_id).delete()

        return Response({'message' : ResponseMessages.FOLLOW_DELETE_SUCCESS}, status = status.HTTP_200_OK)


class Follower(APIView, FollowInformationHandlerMixin):
    def get(self, request: HttpRequest, profile_user_pk):
        is_profile_mine = bool(request.GET['is_profile_mine'].lower() == "true")
        follower_id_list = UserRelationship.objects.filter(user_follow=profile_user_pk).values_list('user_follower')
        response_data = []

        if is_profile_mine :
            user = User.objects.filter(Q(id__in=follower_id_list)).order_by('-signup_date')
            response_data = FollowerSerializer(user, many=True).data
        else:
            response_data = self.get_follow_status_info(
                request.META.get('HTTP_AUTHORIZATION', ''), follower_id_list, FollowerSerializer()
            )

        return Response(response_data, status = status.HTTP_200_OK)

    def delete(self, request:HttpRequest, profile_user_pk):
        user_id = self.extract_user_id_from_session(request.META.get('HTTP_AUTHORIZATION', ''))
        # 팔로우 : 사실 profile_user_pk가 아닌 삭제 타겟팅 아이디...
        UserRelationship.objects.filter(user_follow = user_id, user_follower = profile_user_pk).delete()

        return Response({'message' : ResponseMessages.FOLLOWER_DELETE_SUCCESS}, status = status.HTTP_200_OK)