from django.db.models import Q, Count, F
from django.http import HttpRequest
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView

from explore.serializers import UserExploreResultSerializer, HashTagExploreResultSerializer, HashTagExploreResultDetailSerializer
from post.models import HashTag, Post
from profiles.models import Profile


class ExploreUsers(APIView):
    def get(self, request:HttpRequest) -> Response:
        # 사용자명
        name = request.query_params.get('name')

        users = Profile.objects.filter(
            Q(user__name__startswith = name) &
            Q(user__is_active = True) &
            (Q(user__is_auth = 10) | Q(user__is_auth = 11) | Q(user__is_auth = 21))
        ).select_related(
            'user__first_course__campus',
            'user__second_course__campus'
        ).all()
        
        serializer = UserExploreResultSerializer(users, many = True)

        return Response(serializer.data, status = status.HTTP_200_OK)

class ExploreTags(APIView):
    def get(self, request: HttpRequest) -> Response:
        tag_name = request.query_params.get('name')

        hashtag_queryset = HashTag.objects.filter(name__startswith = tag_name).annotate(count_post=Count('post'))
        serializer = HashTagExploreResultSerializer(hashtag_queryset, many = True)

        return Response(serializer.data, status = status.HTTP_200_OK)
    
class TagsResult(APIView):
    def get(self, request: HttpRequest, tag_name) -> Response:
        post_queryset = Post.objects.filter(tags__name = tag_name)\
            .select_related('user')\
            .order_by('-date')\
            .annotate(hashtag_name = F('tags__name'), username = F('user__username'))
        
        serializer = HashTagExploreResultDetailSerializer(post_queryset, many = True)

        return Response(serializer.data, status = status.HTTP_200_OK)
