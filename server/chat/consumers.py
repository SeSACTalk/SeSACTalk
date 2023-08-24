from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.sessions.models import Session

import json

from chat.models import Chat
from chat.serializers import ChatSerializers


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.sender_id = self.scope['url_route']['kwargs']['sender_id']
        self.receiver_id = self.scope['url_route']['kwargs']['receiver_id']
        
        #! 채팅그룹명을 어떻게 지어야 효율적일까?
        self.room_group_name = f"chat_{self.sender_id}{self.receiver_id}"

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

    async def receive(self, text_data):
        data = json.loads(text_data)
        content = data['content']

        sender_id = self.scope['url_route']['kwargs']['sender_id']
        receiver_id = self.scope['url_route']['kwargs']['receiver_id']
        
        data = {
            'sender': sender_id,
            'receiver': receiver_id,
            'content': content
        }
        # DB에 저장
        serializer = ChatSerializers(data = data)
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
