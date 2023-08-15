from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from accounts.views import LoginView, SignUpView, IdCheckView, FindIdView, FindPasswordView, test_view_email_template

urlpatterns = [
    path('login/', LoginView.as_view(), name = 'login'),
    path('signup/', SignUpView.as_view(), name = 'signUp'),
    path('check/id/', IdCheckView.as_view(), name = 'idCheck'),
    path('find/user/id/', FindIdView.as_view(), name = 'findId' ),
    path('find/user/password/', FindPasswordView.as_view(), name = 'findPassword' ),
    path('test_view_email', test_view_email_template, name='test_view_email_template')
]

urlpatterns = format_suffix_patterns(urlpatterns)