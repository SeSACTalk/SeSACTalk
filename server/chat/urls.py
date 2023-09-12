from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns

from chat.views import ChatListView, ChatDetailView

urlpatterns = [
    path('', ChatListView.as_view(), name = 'ChatView'),
    path('<int:chatroom>/', ChatDetailView.as_view(), name = 'ChatDetailView')
]

urlpatterns = format_suffix_patterns(urlpatterns)