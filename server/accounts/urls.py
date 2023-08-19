from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns

from accounts.views import LoginView, SignUpView, IdCheckView, FindIdView, VerifyUserView, FindPasswordView, UserInfoView

urlpatterns = [
    path('verify/session/', VerifyUserView.as_view(), name = 'VerifyUser'),
    path('user/info/', UserInfoView.as_view(), name='UserInfo' ),
    path('login/', LoginView.as_view(), name = 'login'),
    path('signup/', SignUpView.as_view(), name = 'signUp'),
    path('check/id/', IdCheckView.as_view(), name = 'idCheck'),
    path('find/user/id/', FindIdView.as_view(), name = 'findId' ),
    path('find/user/password/', FindPasswordView.as_view(), name = 'findPassword'),
]

urlpatterns = format_suffix_patterns(urlpatterns)