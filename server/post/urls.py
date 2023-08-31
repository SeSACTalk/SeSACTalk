from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from post.views import Post, PostDetail, ReportPost, Replys

urlpatterns = [
    path('<str:username>/', Post.as_view(), name = 'Post'),
    path('<str:username>/<int:pk>/', PostDetail.as_view(), name = 'PostDetail'),
    path('<int:pk>/report/', ReportPost.as_view(), name='ReportPost'),
    path('<int:u_sq>/<int:p_sq>/', Replys.as_view(), name='reply'),
]

urlpatterns = format_suffix_patterns(urlpatterns)