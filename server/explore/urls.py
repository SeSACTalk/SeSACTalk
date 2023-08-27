from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from explore.views import ExploreUsers, ExploreTags

urlpatterns = [
    path('tags/<str:h_name>/', ExploreTags.as_view(), name = 'ExploreTags'),
    path('users/<str:u_name>/', ExploreUsers.as_view(), name = 'ExploreUsers'),
]

urlpatterns = format_suffix_patterns(urlpatterns)