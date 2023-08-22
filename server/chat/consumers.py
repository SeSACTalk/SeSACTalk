import json
from channels.generic.websocket import AsyncWebsocketConsumer

from chat.models import Chat


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['user_id']
        self.room_group_name = f"chat_{self.room_name}"

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

    # TODO: 현재 접속중인 사용자의 id를 추출 -> DB저장용
    # TODO: 메시지의 내용 + 날짜찍히게 하기(가공해서)
    async def receive(self, text_data):
        data = json.loads(text_data)
        content = data['content']

        sender_pk = self.scope['url_route']['kwargs']['user_id']


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
