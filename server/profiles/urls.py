from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from profiles.views import ProfileView, EditProfileView, ProfilePost, ProfileLike, ProfileReply

urlpatterns = [
    path('<str:username>/', ProfileView.as_view(), name='ProfileView'),
    path('<str:username>/edit/', EditProfileView.as_view(), name='EditProfileView'),
    path('<int:user_pk>/post/', ProfilePost.as_view(), name='ProfilePost'),
    path('<int:user_pk>/like/', ProfileLike.as_view(), name='ProfileLike'),
    path('<int:user_pk>/reply/', ProfileReply.as_view(), name='ProfileReply'),
]

urlpatterns = format_suffix_patterns(urlpatterns)