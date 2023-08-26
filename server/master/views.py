from django.db.models import Q
from django.http import HttpRequest
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

from accounts.models import User
from master.serializers import UserSerializer, UserAuthSerializer
from master.constants import ResponseMessages
from post.models import Report, Post, Reply


class UserListView(APIView):
    def get(self, request: HttpRequest) -> Response:
        auth_users = User.objects.exclude(is_auth = 0).all()
        serializer = UserSerializer(auth_users, many = True)

        return Response(serializer.data, status = status.HTTP_200_OK)

class UserDetailVeiw(APIView):
    def get(self, request: HttpRequest, **kwargs) -> Response:
        user_id = kwargs['id']
        user = User.objects.get(id = user_id)
        serializer = UserSerializer(user)

        return Response(serializer.data, status = status.HTTP_200_OK)
    
    def put(self, request: HttpRequest, **kwargs) -> Response:
        user_id = kwargs['id']
        user = User.objects.get(id = user_id)
        serializer = UserSerializer(user, data = request.data, partial = True )
        if serializer.is_valid():
            serializer.save()
            return Response({'message': ResponseMessages.UPDATE_SUCCESS}, status = status.HTTP_201_CREATED)
        return Response({'message':ResponseMessages.UPDATE_FAIL}, status = status.HTTP_400_BAD_REQUEST)

class UserAuthRequestView(APIView):
    def get(self, request: HttpRequest) -> Response:
        users = User.objects.exclude(is_auth = 1).all()
        serializer = UserAuthSerializer(users, many = True)

        return Response(serializer.data, status = status.HTTP_200_OK)
    
    def put(self, request: HttpRequest) -> Response:
        user = User.objects.get(id = request.data['id'])
        serializer = UserAuthSerializer(user, data = request.data, partial = True)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': ResponseMessages.UPDATE_SUCCESS}, status = status.HTTP_201_CREATED)
        return Response({'message':ResponseMessages.UPDATE_FAIL}, status = status.HTTP_400_BAD_REQUEST)


class NotifycationReport(APIView):
    def get(self, request: HttpRequest) -> Response:
        # 신고 처리 또는 거절된 것을 제외한 신고 내역만 가져옴
        reports = Report.objects.exclude(
            Q(report_status = 10) | Q(report_status = 30)
        ).select_related('reported', 'reporter').order_by('-date')

        # Queryset 결과 없음
        if not bool(reports):
            return Response({'message': ResponseMessages.REPORT_NO_POSTS_TO_DISPLAY}, status=status.HTTP_200_OK)

        # content 유형에 따라 response data를 달리 함
        content_type_mapping = {}

        for report in reports:
            if report.content_type == 'post':
                content_type_mapping[report.content_id] = Post.objects.get(id=report.content_id).content
                content_type_mapping[f'{report.content_id}post_id'] = report.content_id
            elif report.content_type == 'reply':
                reply = Reply.objects.filter(id=report.content_id).select_related('post').first()
                content_type_mapping[report.content_id] = reply.content
                content_type_mapping[f'{report.content_id}post_id'] = reply.post.id

        report_data = []
        for report in reports:
            report_dict = {
                'id' : report.id,
                'date' : report.date,
                'content_type' : report.content_type,
                'category' : report.category,
                'content_id' : report.content_id,
                'report_status' : report.report_status,

                'reported_id' : report.reported.id,
                'reported_name': report.reported.name,
                'reported_username': report.reported.username,

                'reporter_id' : report.reporter.id,
                'reporter_name': report.reporter.name,
                'reporter_username': report.reporter.username,

                'post_id': content_type_mapping.get(f'{report.content_id}post_id', ''),
                'reported_content': content_type_mapping.get(report.content_id, ''),
            }
            report_data.append(report_dict)

        return Response(report_data, status = status.HTTP_200_OK)

class HandleReport(APIView):
    def post(self, request: HttpRequest, **kwargs) -> Response:
        report = Report.objects.get(id = request.data['id'])
        report.report_status = request.data['report_status']
        report.save()

        return Response('ok', status = status.HTTP_200_OK)