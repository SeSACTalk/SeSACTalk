from channels.generic.websocket import AsyncWebsocketConsumer
from django.db.models import Q
import json

from chat.models import Chat
from chat.serializers import ChatSerializer

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        chat_room = self.scope['url_route']['kwargs']['chat_room']
        
        self.room_group_name = f"chat_{chat_room}"

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # TODO : 채팅내역 저장하는 방식 고민하기
    async def receive(self, text_data):
        chat_room = self.scope['url_route']['kwargs']['chat_room']
        data = json.loads(text_data)
        content = data['content']
        data['chat_room'] = chat_room

        
        # 채팅 내역 생성
        # TODO signals로 latest_content 저장하기
        serializer = ChatSerializer(data = data)

        if serializer.is_valid():
            serializer.save()

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': content
            }
        )

    async def chat_message(self, event):
        message = event['message']

        await self.send(text_data = json.dumps({
            'content': message
        }))
