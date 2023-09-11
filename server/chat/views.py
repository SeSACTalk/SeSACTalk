from django.http import HttpRequest
from django.contrib.sessions.models import Session
from django.db.models import Q, Value, ImageField, Max, Subquery, OuterRef
from django.db.models.functions import Coalesce
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response

from chat.models import Chat, ChatRoom
from accounts.models import User
from chat.serializers import ChatRoomSerializer, ChatDetailSerializer, ChatProfileSerializer
from sesactalk.mixins import SessionDecoderMixin

class ChatListView(APIView, SessionDecoderMixin):
    def get(self, request: HttpRequest) -> Response:
        user_id = self.extract_user_id_from_session(request.META.get('HTTP_AUTHORIZATION', ''))

        chat_rooms = ChatRoom.objects.select_related('sender').filter(Q(sender = user_id)).all()

        serializer = ChatRoomSerializer(chat_rooms, many = True)
        print(chat_rooms)
        print('직렬화', serializer.data)
        data = {
            'id': user_id,
            'users': serializer.data
        }
        return Response(data, status = status.HTTP_200_OK)
    
class ChatDetailView(APIView):
    def get(self, request: HttpRequest, **kwargs) -> Response:
        frontend_session_key = request.META.get('HTTP_AUTHORIZATION', '')
        session = Session.objects.get(session_key = frontend_session_key)

        my_user_id = session.get_decoded().get('_auth_user_id')
        specific_user_id = kwargs['sender']

        # 날짜를 백엔드에서 쪼개서 보내줘야할 것 같은데.. 프론트에서 쪼개야하나?
        # 같은 날짜끼리 묶여야함..
        # 보내줘야할 정보: 대화상대 이름, 아이디, 캠퍼스, 프로필사진, 대화내용들
        messages = Chat.objects.filter(
            (Q(receiver = my_user_id) & Q(sender = specific_user_id)) |
            (Q(sender = my_user_id) & Q(receiver = specific_user_id))
        ).values(
            'sender',
            'receiver',
            'sender__name',
            'receiver__name',
            'content',
            'date',
            ).order_by('date').all()
            
        chatSerializer = ChatDetailSerializer(messages, many = True)

        user_chat_with = User.objects.values(
            'id',
            'name',
            'username',
            'first_course__campus__name',
            img_path = Coalesce('profile__img_path', Value('default_profile.png'), output_field = ImageField())
        ).get(id = specific_user_id)

        chatProfileSerializer = ChatProfileSerializer(user_chat_with)
        response_data = {
            'chat': chatSerializer.data,
            'profile':chatProfileSerializer.data
        }
        return Response(response_data, status = status.HTTP_200_OK)