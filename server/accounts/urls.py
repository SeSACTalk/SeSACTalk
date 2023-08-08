from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from accounts.views import LoginView, SignUpView

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('signup/',SignUpView.as_view(), name='signUp')
]

urlpatterns = format_suffix_patterns(urlpatterns)