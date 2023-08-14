from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from accounts.views import LoginView, CheckIdView

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('check/id/',CheckIdView.as_view(), name='checkId')
]

urlpatterns = format_suffix_patterns(urlpatterns)