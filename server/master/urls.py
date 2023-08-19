from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns

from master.views import UserAuthRequestView

urlpatterns =[
    path('auth/user/', UserAuthRequestView.as_view(), name = 'AdminUserRequest')
]
    
urlpatterns = format_suffix_patterns(urlpatterns)