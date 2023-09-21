from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from explore.views import ExploreUsers, ExploreTags, TagsResult

urlpatterns = [
    path('tag/', ExploreTags.as_view(), name = 'ExploreTags'),
    path('tag/<str:tag_name>/', TagsResult.as_view(), name = 'TagsResult'),
    path('user/', ExploreUsers.as_view(), name = 'ExploreUsers'),
]

urlpatterns = format_suffix_patterns(urlpatterns)