from channels.generic.websocket import AsyncWebsocketConsumer
from django.db.models import Q

import json

from chat.models import Chat, ChatRoom
from chat.serializers import ChatSerializers

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.sender_id = self.scope['url_route']['kwargs']['sender_id']
        self.receiver_id = self.scope['url_route']['kwargs']['receiver_id']
        
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
        
        # 채팅방 확인 및 가져오기
        chat_room = ChatRoom.objects.filter(
            (Q(sender=sender_id, receiver=receiver_id) | Q(sender=receiver_id, receiver=sender_id))
        ).first()

        if not chat_room:
            # 채팅방이 없으면 생성
            chat_room = ChatRoom.objects.create(sender = sender_id, receiver = receiver_id, latest_content = content)

        chat_room.latest_content = content
        chat_room.save()

        # 채팅 내역 생성
        chat = Chat.objects.create(content=content, chat_room=chat_room)
        chat.save()

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
