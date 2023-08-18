from django.http import HttpRequest
from rest_framework import status
from rest_framework.generics import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response

from accounts.models import User
from post.models import Post as PostModel, Like, View, Reply, HashTag, Report
from post.serializers import PostSerializer, LikeSerializer, ViewSerializer, ReplySerializer, HashTagSerializer, ReportSerializer

class Posts(APIView):
    def get(self, request: HttpRequest, username) -> Response:
        #TODO: follow기반으로 수정
        posts = PostModel.objects.all()
        postSerializer = PostSerializer(posts, many=True)

        return Response(postSerializer.data)

class Post(APIView):
    def get(self, request: HttpRequest) -> Response:
        pass

    def post(self, request: HttpRequest, username) -> Response:
        content = request.data['content']
        img_path = request.FILES['img_path']

        if content and len(content) <= 500: # content의 길이 제한(500자 이하)
            user = User.objects.get(id=14) #TODO: test용 user이므로, 테스트 이후 수정 필요
            post = PostModel.objects.create(content = content, img_path = img_path, user = user)
            post.save()
        else:
            print('content의 길이가 500자를 초과')
            return Response({'data' : 'content의 길이가 500자를 초과하였습니다.'}, status.HTTP_400_BAD_REQUEST)
        return Response({'message': 'Post Upload Success'}, status = status.HTTP_201_CREATED)

class PostDetail(APIView):
    def post(self, request: HttpRequest) -> Response:
        pass

    def put(self, request) -> Response:
        pass

    def delete(self, request) -> Response:
        pass