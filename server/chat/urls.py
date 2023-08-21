from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns

from chat.views import ChatListView

urlpatterns = [
    path('', ChatListView.as_view(), name='ChatView')
]

urlpatterns = format_suffix_patterns(urlpatterns)