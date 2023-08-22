from django.http import HttpRequest
from django.contrib.sessions.models import Session
from django.db.models import Q
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response

from chat.models import Chat
from chat.serializers import ChatUserSerializer, ChatSerializer

class ChatListView(APIView):
    def get(self, request: HttpRequest) -> Response:
        # 사용자의 세션키로부터 id 추출
        frontend_session_key = request.META.get('HTTP_AUTHORIZATION', '')
        session = Session.objects.get(session_key = frontend_session_key)
        user_id = session.get_decoded().get('_auth_user_id')
        
        chat_users = Chat.objects.filter(receiver = user_id).values('sender', 'sender__name').distinct().all()
        serializer = ChatUserSerializer(chat_users, many = True)

        return Response(serializer.data, status = status.HTTP_200_OK)
    
class ChatDetailView(APIView):
    def get(self, request: HttpRequest, **kwargs) -> Response:
        frontend_session_key = request.META.get('HTTP_AUTHORIZATION', '')
        session = Session.objects.get(session_key = frontend_session_key)
        receiver_id = session.get_decoded().get('_auth_user_id')

        sender_id = kwargs['id']

        chats_with_sender = Chat.objects.filter(Q(receiver = receiver_id) & Q(sender = sender_id)).values('sender__name', 'receiver__name', 'content', 'date').order_by('-date').all()
        serializer = ChatSerializer(chats_with_sender, many = True)

        return Response(serializer.data ,status = status.HTTP_200_OK)