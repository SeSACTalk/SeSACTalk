from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns

from user.views import RegistreFCMTokenView

urlpatterns = [
    path('<str:username>/notify', RegistreFCMTokenView.as_view(), name = 'push notification')
]

urlpatterns = format_suffix_patterns(urlpatterns)