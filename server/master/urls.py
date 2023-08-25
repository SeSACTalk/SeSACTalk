from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns

from master.views import UserListView, UserDetailVeiw, UserAuthRequestView

urlpatterns =[
    path('user/', UserListView.as_view(), name = 'UserList'),
    path('user/<int:id>', UserDetailVeiw.as_view(), name = 'UserDetail'),
    path('auth/user/', UserAuthRequestView.as_view(), name = 'AdminUserRequest')
]
    
urlpatterns = format_suffix_patterns(urlpatterns)