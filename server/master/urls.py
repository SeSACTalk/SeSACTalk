from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns

from master.views import UserListView, UserDetailVeiw, UserAuthRequestView, NotifycationReport, HandleReport

urlpatterns =[
    path('user/', UserListView.as_view(), name = 'UserList'),
    path('user/<int:id>', UserDetailVeiw.as_view(), name = 'UserDetail'),
    path('auth/user/', UserAuthRequestView.as_view(), name = 'AdminUserRequest'),
    path('notify/report/', NotifycationReport.as_view(), name = 'NotifycationReport'),
    path('report/<str:content_type>/<int:reported_id>/<int:reporter_id>/', HandleReport.as_view(), name = 'HandleReport'),
]
    
urlpatterns = format_suffix_patterns(urlpatterns)