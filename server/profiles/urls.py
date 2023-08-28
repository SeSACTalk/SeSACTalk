from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from profiles.views import ProfileView, EditProfileView

urlpatterns = [
    path('<str:username>/', ProfileView.as_view(), name='profiles'),
    path('<str:username>/edit/', EditProfileView.as_view(), name='editProfile'),
]

urlpatterns = format_suffix_patterns(urlpatterns)