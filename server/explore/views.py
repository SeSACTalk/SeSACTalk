from django.db.models import Q, Count, F
from django.http import HttpRequest
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView

from explore.serializers import UserExploreResultSerializer, HashTagExploreResultSerializer, HashTagExploreResultDetailSerializer
from post.models import HashTag, Post
from profiles.models import Profile


class ExploreUsers(APIView):
    def post(self, request: HttpRequest, u_name) -> Response:
        #  활성화된 회원만, 승인 여부가 10 11 21(재로그인 필요)인 회원만
        profiles_with_users_campus_name = Profile.objects.filter(
            Q(user__username__startswith=u_name) &
            Q(user__is_active = True) &
            (Q(user__is_auth = 10) | Q(user__is_auth=11) | Q(user__is_auth=21))
        ).select_related(
            'user__first_course__campus',
            'user__second_course__campus'
        ).all()

        serializer = UserExploreResultSerializer(profiles_with_users_campus_name, many = True)

        return Response(serializer.data, status=status.HTTP_200_OK)

class ExploreTags(APIView):
    def get(self, request: HttpRequest, h_name) -> Response:
        post_queryset = Post.objects.filter(tag_set__name__startswith=h_name)\
            .select_related('user')\
            .order_by('-date')\
            .annotate(hashtag_name=F('tag_set__name'), username=F('user__username'))
        serializer = HashTagExploreResultDetailSerializer(post_queryset, many = True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request: HttpRequest, h_name) -> Response:
        hashtag_queryset = HashTag.objects.filter(name__startswith=h_name).annotate(count_post=Count('post'))
        serializer = HashTagExploreResultSerializer(hashtag_queryset, many = True)

        return Response(serializer.data, status=status.HTTP_200_OK)