from django.db.models import Q
from django.http import HttpRequest
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

from user.models import FCMToken, User, UserRelationship, Notification
from user.mixins import UserRelationshipDataHandlerMixin
from sesactalk.mixins import SessionDecoderMixin
from user.constants import ResponseMessages
from user.serializers import NotificationSerializer

from django.utils import timezone

class RegistreFCMTokenView(APIView, SessionDecoderMixin):
    # TODO: 이것도 나중에 10개씩 끊어 보여주는 것도 좋을 듯!
    def get(self, request: HttpRequest, username):
        # 읽지 않은 알림
        not_read_notification = Notification.objects.filter(
            Q(targeted_user__username=username) & Q(read_date__isnull=True) & Q(delete_status = False)
        ).order_by('-occur_date')

        # 읽은 알림
        read_notification = Notification.objects.filter(
            Q(targeted_user__username=username) & Q(read_date__isnull=False) & Q(delete_status = False)
        ).order_by('-occur_date')

        response_data = {
            'notRead' : NotificationSerializer(not_read_notification, many=True).data,
            'read' : NotificationSerializer(read_notification, many=True).data,
        }
        print(response_data)
        return Response(response_data, status = status.HTTP_200_OK)

    def post(self, request:HttpRequest, **kwargs) -> Response:
        username = kwargs['username']
        user_exist = self.extract_user_id_from_session(request.META.get('HTTP_AUTHORIZATION', ''))

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

    def put(self, request:HttpRequest, username) -> Response:
        not_read_notification = Notification.objects.filter(
            Q(targeted_user__username=username) & Q(read_date__isnull = True)
        )
        not_read_notification.update(read_date = timezone.now())

        return Response({'message' : ResponseMessages.READ_NOTIFICATION}, status=status.HTTP_304_NOT_MODIFIED)

#TODO: 나중에 팔로워, 팔로우 리스트를 limit 10등으로 끊어서 보여주기
class Follow(APIView, UserRelationshipDataHandlerMixin):
    def get(self, request:HttpRequest, profile_user_id):
        response_data = self.get_response_data(
                                                request.META.get('HTTP_AUTHORIZATION', ''),
                                                'follow',
                                                profile_user_id
                                            )
        return Response(response_data, status = status.HTTP_200_OK)

    def post(self, request:HttpRequest, profile_user_id):
        user = self.get_user_by_pk(request.META.get('HTTP_AUTHORIZATION', ''))
        target_user = User.objects.get(pk = profile_user_id)

        # 팔로우
        if not UserRelationship.objects.filter(Q(user_follow = target_user) & Q(user_follower = user)).exists():
            UserRelationship.objects.create(user_follow = target_user, user_follower = user)

        return Response({'message' : ResponseMessages.FOLLOW_CREATE_SUCCESS}, status = status.HTTP_200_OK)

    def delete(self, request:HttpRequest, profile_user_id):
        user_id = self.extract_user_id_from_session(request.META.get('HTTP_AUTHORIZATION', ''))
        UserRelationship.objects.filter(user_follow = profile_user_id, user_follower = user_id).delete()

        return Response({'message' : ResponseMessages.FOLLOW_DELETE_SUCCESS}, status = status.HTTP_200_OK)


class Follower(APIView, UserRelationshipDataHandlerMixin):
    def get(self, request: HttpRequest, profile_user_id):
        response_data = self.get_response_data(
                                                request.META.get('HTTP_AUTHORIZATION', ''),
                                                'follower',
                                                profile_user_id
                                            )
        return Response(response_data, status = status.HTTP_200_OK)

    def delete(self, request:HttpRequest, profile_user_id):
        user_id = self.extract_user_id_from_session(request.META.get('HTTP_AUTHORIZATION', ''))
        # 팔로우 : 사실 profile_user_pk가 아닌 삭제 타겟팅 아이디...
        UserRelationship.objects.filter(user_follow = user_id, user_follower = profile_user_id).delete()

        return Response({'message' : ResponseMessages.FOLLOWER_DELETE_SUCCESS}, status = status.HTTP_200_OK)
