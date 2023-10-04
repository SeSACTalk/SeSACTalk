from django.http import HttpRequest
from django.db.models import Q
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response

from chat.models import Chat, ChatRoom
from accounts.models import User
from chat.serializers import ChatRoomSerilaizer, ChatRoomOneSerializer, ChatRoomTwoSerializer, ChatProfileSerializer, ChatSerializer
from sesactalk.mixins import SessionDecoderMixin

class ChatListView(APIView, SessionDecoderMixin):
    def get(self, request: HttpRequest) -> Response:
        user_id = self.extract_user_id_from_session(request.META.get('HTTP_AUTHORIZATION', ''))

        # 만약 접속중인 사용자가 user_one이면 user_two를 조회, user_two면 user_one
        condition = ChatRoom.objects.filter(user_one = user_id).exists()

        serializer = None
        if condition:
            chat_rooms = ChatRoom.objects.select_related('user_two').filter(user_one = user_id ).all()
            serializer = ChatRoomTwoSerializer(chat_rooms, many = True)
        else:
            chat_rooms = ChatRoom.objects.select_related('user_one').filter(user_two = user_id).all()
            serializer = ChatRoomOneSerializer(chat_rooms, many = True)

        return Response(serializer.data, status = status.HTTP_200_OK)

    def post(self, request: HttpRequest) -> Response:
        my_user_id = self.extract_user_id_from_session(request.META.get('HTTP_AUTHORIZATION', ''))
        target_id = request.data['user']
        
        data = {
            'user_one': my_user_id,
            'user_two': target_id
        }
        
        # 방이 없을때만 생성되게 해야함, 있으면 그방으로 이동하게
        chat_room_exist = ChatRoom.objects.filter(
            (Q(user_one = my_user_id) & Q(user_two = target_id)) |
            (Q(user_one = target_id) & Q(user_one = my_user_id))
        ).exists()
        
        # 응답들에 만들어진 혹은 존재하는 채팅방의 id를 보내줘야함
        serializer = None
        if chat_room_exist:
            chat_room = ChatRoom.objects.filter(
                (Q(user_one = my_user_id) & Q(user_two = target_id)) |
                (Q(user_one = target_id) & Q(user_one = my_user_id))
            ).get()
            serializer = ChatRoomSerilaizer(chat_room)
        else:
            serializer = ChatRoomSerilaizer(data = data)
            if serializer.is_valid():
                serializer.save()
        
        return Response(serializer.data, status = status.HTTP_200_OK)

        # post요청을 먼저 해서 채팅방을 생성한 후 get요청을 통해 이동이 되게하는게 맞을듯..
class ChatDetailView(APIView, SessionDecoderMixin):
    def get(self, request: HttpRequest, **kwargs) -> Response:
        my_user_id = self.extract_user_id_from_session(request.META.get('HTTP_AUTHORIZATION', ''))
        chat_room_id = kwargs['chatroom']
        
        # 전체 채팅내용 조회
        messages = Chat.objects.select_related('chat_room').filter(chat_room__id = chat_room_id).order_by('date').all()
        chatSerializer = ChatSerializer(messages, many = True)

        # 대화 상대의 pk 조회하기
        chat_room = ChatRoom.objects.get(id = chat_room_id)

        target_id = None
        if chat_room.user_one.id == my_user_id:
            target_id = chat_room.user_two.id
        elif chat_room.user_two.id == my_user_id:
            target_id = chat_room.user_one.id
        
        # 대화 상대의 프로필 가져오기
        target_info = User.objects.get(id = target_id)
        profileSerializer = ChatProfileSerializer(target_info)
        
        response_data = {
            'id': my_user_id,
            'chat': chatSerializer.data,
            'profile': profileSerializer.data
        }
        
        return Response(data = response_data, status = status.HTTP_200_OK)
    
