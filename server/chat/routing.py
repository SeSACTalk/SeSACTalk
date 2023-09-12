from django.urls import path

from chat import consumers

websocket_urlpatterns = [
    path('ws/chat/<int:chat_room>', consumers.ChatConsumer.as_asgi()), 
]
