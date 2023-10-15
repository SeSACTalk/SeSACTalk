from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns

from user.views import RegistreFCMTokenView, Follow, Follower

urlpatterns = [
    #TODO: class view를 분리할 수 있으면 리팩토링하기
    path('<str:username>/notify/', RegistreFCMTokenView.as_view(), name = 'push notification'),
    path('<int:profile_user_id>/follow/', Follow.as_view(), name = 'Follow'),
    path('<int:profile_user_id>/follower/', Follower.as_view(), name = 'Follower'),
]

urlpatterns = format_suffix_patterns(urlpatterns)