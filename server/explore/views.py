from django.db.models import  Q
from django.http import HttpRequest
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView

from explore.serializers import UserExploreResultSerializer
from profiles.models import Profile


class ExploreUsers(APIView):
    def post(self, request: HttpRequest, u_name) -> Response:
        #  활성화된 회원만, 승인 여부가 10 11 21(재로그인 필요)인 회원만
        profiles_with_users_campus_name = Profile.objects.filter(
            Q(user__username__startswith=u_name) &
            Q(user__is_active=True) &
            (Q(user__is_auth=10) | Q(user__is_auth=11) | Q(user__is_auth=21))
        ).select_related(
            'user__first_course__campus',
            'user__second_course__campus'
        ).all()

        serializer = UserExploreResultSerializer(profiles_with_users_campus_name, many = True)

        return Response(serializer.data, status=status.HTTP_200_OK)

class ExploreTags(APIView):
    def post(self, request: HttpRequest, h_name) -> Response:
        return Response("success", status=status.HTTP_200_OK)
