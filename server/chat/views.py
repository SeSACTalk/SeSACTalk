from django.http import HttpRequest
from django.contrib.sessions.models import Session
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response

from accounts.models import User
from chat.models import Chat

class ChatListView(APIView):
    def get(self, request: HttpRequest) -> Response:
        # 사용자의 세션키로부터 id 추출
        frontend_session_key = request.META.get('HTTP_AUTHORIZATION', '')
        session = Session.objects.get(session_key = frontend_session_key)
        user_id = session.get_decoded().get('_auth_user_id')
        
        chat_users = Chat.objects.distinct().values_list('reciever').filter(reciever = user_id)
        print(chat_users)
        # chat_users = Chat.objects.order_by('reciever').filter(reciever = user_id).select_related('reciever').all() # 메시지 수신자의 id를 이용하여 대화내역 복원
        # for u in chat_users:
        #     print(u.sender)
        return Response(status = status.HTTP_200_OK)