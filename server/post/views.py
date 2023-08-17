from django.http import HttpRequest
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

from post.models import Post, Like, View, Reply, HashTag, Report
from post.serializers import PostSerializer, LikeSerializer, ViewSerializer, ReplySerializer, HashTagSerializer, ReportSerializer

class Post(APIView):
    def get(self, request: HttpRequest) -> Response:
        pass

    def post(self, request) -> Response:
        pass

class PostDetail(APIView):
    def post(self, request: HttpRequest) -> Response:
        pass

    def put(self, request) -> Response:
        pass

    def delete(self, request) -> Response:
        pass