from django.http import HttpRequest
from django.db.models import Q
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response

from chat.models import Chat, ChatRoom
from accounts.models import User
from chat.serializers import ChatRoomSerializer, ChatDetailSerializer
from sesactalk.mixins import SessionDecoderMixin

class ChatListView(APIView, SessionDecoderMixin):
    def get(self, request: HttpRequest) -> Response:
        user_id = self.extract_user_id_from_session(request.META.get('HTTP_AUTHORIZATION', ''))

        chat_rooms = ChatRoom.objects.select_related('sender').filter(receiver = user_id).all()

        serializer = ChatRoomSerializer(chat_rooms, many = True)
        data = {
            'id': user_id,
            'users': serializer.data
        }

        print(serializer.data)
        return Response(data, status = status.HTTP_200_OK)
    
class ChatDetailView(APIView, SessionDecoderMixin):
    def get(self, request: HttpRequest, **kwargs) -> Response:
        my_user_id = self.extract_user_id_from_session(request.META.get('HTTP_AUTHORIZATION', ''))
        specific_user_id = kwargs['sender']

        # messages = Chat.objects.filter(
        #     (Q(receiver = my_user_id) & Q(sender = specific_user_id)) |
        #     (Q(sender = my_user_id) & Q(receiver = specific_user_id))
        # ).values(
        #     'sender',
        #     'receiver',
        #     'sender__name',
        #     'receiver__name',
        #     'content',
        #     'date',
        #     ).order_by('date').all()
            
        # chatSerializer = ChatDetailSerializer(messages, many = True)

        messages = Chat.objects.select_related('chat_room').filter(
            (Q(chat_room__receiver = my_user_id) & Q(chat_room__sender = specific_user_id)) |
            (Q(chat_room__sender = my_user_id) & Q(chat_room__receiver = specific_user_id))
        ).order_by('date').all()
        
        # print(messages)

        response_data = {
            # 'chat': chatSerializer.data
        }
        return Response(response_data, status = status.HTTP_200_OK)