from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from post.views import Posts, Post, PostDetail

urlpatterns = [
    path('<str:username>/', Posts.as_view(), name = 'Posts'),
    path('<str:username>/write/', Post.as_view(), name = 'Post'),
    path('<str:username>/<int:pk>/', PostDetail.as_view(), name = 'PostDetail'),
]

urlpatterns = format_suffix_patterns(urlpatterns)