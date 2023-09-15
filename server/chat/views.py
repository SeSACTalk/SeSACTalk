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

    # TODO 채팅방 생성하는 view도 만들어야함
    def post(self, request: HttpRequest) -> Response:
        # request로 받아야 하는 정보는 나의 pk랑 상대의 pk -> chatroom을 생성해야함
        # chatroom 만들때 필요한 정보 - user_one, user_two
        # request.data
        serializer = ChatRoomSerilaizer(data = request.data)
        if serializer.is_valid():
            serializer.save()

        return Response(status = status.HTTP_200_OK)

        # post요청을 먼저 해서 채팅방을 생성한 후 get요청을 통해 이동이 되게하는게 맞을듯..
class ChatDetailView(APIView, SessionDecoderMixin):
    def get(self, request: HttpRequest, **kwargs) -> Response:
        my_user_id = self.extract_user_id_from_session(request.META.get('HTTP_AUTHORIZATION', ''))
        #! 사용자의 pk를 이용해 구성을 해야하므로 유지, 웹소켓에 전달할때도 필요함.
        chat_room_id = kwargs['chatroom']
        
        # TODO 하나의 쿼리문을 통해 프로필사진과 사용자 정보를 다 보내는 방식 모색
        # 전체 채팅내용 조회
        messages = Chat.objects.select_related('chat_room').filter(chat_room__id = chat_room_id).order_by('date').all()
        chatSerializer = ChatSerializer(messages, many = True)

        # 대화 상대의 pk 조회하기
        target_id = None
        for message in messages:
            if message.sender.id != my_user_id:
                target_id = message.sender.id
                break
        
        # 대화 상대의 프로필 가져오기
        target_info = User.objects.get(id = target_id)
        profileSerializer = ChatProfileSerializer(target_info)
        
        response_data = {
            'id': my_user_id,
            'chat': chatSerializer.data,
            'profile': profileSerializer.data
        }
        
        return Response(data = response_data, status = status.HTTP_200_OK)
    
