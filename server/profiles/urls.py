from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from profiles.views import ProfileView

urlpatterns = [
    path('<str:username>/', ProfileView.as_view(), name='profiles'),
]

urlpatterns = format_suffix_patterns(urlpatterns)