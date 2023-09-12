from django.http import HttpRequest
from django.db.models import Q
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response

from chat.models import Chat, ChatRoom
from accounts.models import User
from chat.serializers import ChatRoomSerilaizer, ChatRoomOneSerializer, ChatRoomTwoSerializer, ChatDetailSerializer
from sesactalk.mixins import SessionDecoderMixin

class ChatListView(APIView, SessionDecoderMixin):
    def get(self, request: HttpRequest) -> Response:
        user_id = self.extract_user_id_from_session(request.META.get('HTTP_AUTHORIZATION', ''))

        # select_related가 바뀌어야할듯. 만약 접속중인 사용자가 user_one이면 user_two를 조회, user_two면 user_one
        condition = ChatRoom.objects.filter(user_one = user_id).exists()

        serializer = None
        if condition:
            chat_rooms = ChatRoom.objects.select_related('user_two').filter(user_one = user_id ).all()
            serializer = ChatRoomTwoSerializer(chat_rooms, many = True)
        else:
            chat_rooms = ChatRoom.objects.select_related('user_one').filter(user_two = user_id).all()
            serializer = ChatRoomOneSerializer(chat_rooms, many = True)

        return Response(serializer.data, status = status.HTTP_200_OK)

    # TODO 채팅방 생성하는 view도 만들어야함
    def post(self, request: HttpRequest) -> Response:
        # request로 받아야 하는 정보는 나의 pk랑 상대의 pk -> chatroom을 생성해야함
        # chatroom 만들때 필요한 정보 - sender, receiver
        # request.data
        serializer = ChatRoomSerilaizer(data = request.data)
        if serializer.is_valid():
            serializer.save()

        return Response(status = status.HTTP_200_OK)

class ChatDetailView(APIView, SessionDecoderMixin):
    def get(self, request: HttpRequest, **kwargs) -> Response:
        my_user_id = self.extract_user_id_from_session(request.META.get('HTTP_AUTHORIZATION', ''))
        #! 사용자의 pk를 이용해 구성을 해야하므로 유지
        chat_room_id = kwargs['chatroom']
        print(my_user_id, chat_room_id)
        
        # TODO 하나의 쿼리문을 통해 프로필사진과 사용자 정보를 다 보내는게 낫지 않을까?
        #? 보내질 데이터 
        #! 문제점) 상대를 어떻게 구분해서 상대의 프로필이미지와 
        #! 문제점) ..채팅 누가 보냈는지 어케암?
        messages = Chat.objects.select_related('chat_room').filter(chat_room__id = chat_room_id).order_by('date').all()
        # messages = Chat.objects.select_related('chat_room').filter(
        #     (Q(chat_room__receiver = my_user_id) & Q(chat_room__sender = specific_user_id)) |
        #     (Q(chat_room__sender = my_user_id) & Q(chat_room__receiver = specific_user_id))
        # ).order_by('date').all()
        
        # chatSerializer = ChatDetailSerializer(messages, many = True)

        for message in messages:
            print(message.chat_room.sender)
            print(message.chat_room.sender)
        # print(chatSerializer.data)

        response_data = {
            'id': my_user_id
            # 'chat': chatSerializer.data
        }
        return Response(response_data, status = status.HTTP_200_OK)
    
