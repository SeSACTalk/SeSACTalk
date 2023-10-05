from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns

from accounts.views import LoginView, LogoutView, SignUpView, IdCheckView, FindIdView, VerifyUserView, FindPasswordView,\
                           UserInfoView, VerifyPassword, UserWithdraw

urlpatterns = [
    path('verify/session/', VerifyUserView.as_view(), name = 'VerifyUser'),
    path('user/info/', UserInfoView.as_view(), name='UserInfo' ),
    path('login/', LoginView.as_view(), name = 'login'),
    path('logout/', LogoutView.as_view(), name = 'logout'),
    path('signup/', SignUpView.as_view(), name = 'signUp'),
    path('check/id/', IdCheckView.as_view(), name = 'idCheck'),
    path('find/user/id/', FindIdView.as_view(), name = 'findId' ),
    path('find/user/password/', FindPasswordView.as_view(), name = 'findPassword'),
    path('verify/password/', VerifyPassword.as_view(), name = 'VerifyPassword'),
    path('<str:username>/withdraw/', UserWithdraw.as_view(), name = 'UserWithdraw'),
]

urlpatterns = format_suffix_patterns(urlpatterns)