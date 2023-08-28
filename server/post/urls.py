from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from post.views import Replys

urlpatterns = [
    path('<int:u_sq>/<int:p_sq>/', Replys.as_view(), name='reply'),
]

urlpatterns = format_suffix_patterns(urlpatterns)