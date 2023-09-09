from django.http import HttpRequest
from django.contrib.sessions.models import Session
from django.db.models import Q, Value, ImageField, Max, Subquery, OuterRef
from django.db.models.functions import Coalesce
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response

from chat.models import Chat
from chat.serializers import ChatUserSerializer, ChatDetailSerializer
from sesactalk.mixins import SessionDecoderMixin

class ChatListView(APIView, SessionDecoderMixin):
    def get(self, request: HttpRequest) -> Response:
        user_id = self.extract_user_id_from_session(request.META.get('HTTP_AUTHORIZATION', ''))

        max_chat_date_subquery = Chat.objects.filter(receiver = user_id).values('receiver').annotate(max_date = Max('date')).filter(receiver = OuterRef('receiver')).values('max_date')[:1]

        chat_users = Chat.objects.filter(receiver = user_id, date = Subquery(max_chat_date_subquery)).values(
            'sender',
            'sender__name',
            'sender__first_course__campus__name',
            'content',
            'date',
            img_path = Coalesce('sender__profile__img_path', Value('default_profile.png'), output_field = ImageField())
        ).distinct().all()

        serializer = ChatUserSerializer(chat_users, many = True)
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

        messages = Chat.objects.filter(
            (Q(receiver = my_user_id) & Q(sender = specific_user_id)) |
            (Q(sender = my_user_id) & Q(receiver = specific_user_id))
        ).values('sender__name', 'receiver__name', 'content', 'date').order_by('date').all()
    
        serializer = ChatDetailSerializer(messages, many = True)
        return Response(serializer.data, status = status.HTTP_200_OK)