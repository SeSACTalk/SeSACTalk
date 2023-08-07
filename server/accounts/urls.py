from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from accounts.views import LoginView

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    # path('signup/',)
]

urlpatterns = format_suffix_patterns(urlpatterns)