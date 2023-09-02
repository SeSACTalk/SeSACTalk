from django.db.models import Q
from django.http import HttpRequest
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

from accounts.models import User, Campus
from accounts.serializers import CampusSerializer
from master.serializers import UserSerializer, UserAuthSerializer, ReportDetailSerializer
from master.constants import ResponseMessages
from post.models import Report

class UserListView(APIView):
    def get(self, request: HttpRequest) -> Response:
       # 필터들
        username_value = request.query_params.get('username')
        campus_value = int(request.query_params.get('campus'))
        approval_date_value = request.query_params.get('approvaldate')

        date_filter = None
        # 날짜별 정렬
        if approval_date_value == 'oldest':
            date_filter = '-auth_approval_date'
        else:
            date_filter = 'auth_approval_date'

        users = None
        # default 유저 쿼리
        # 각 필터들은 하나만 선택가능
        if campus_value == 0: 
            users = User.objects.filter(
                Q(is_auth = 10) &
                Q(username__contains = username_value) 
                ).order_by(date_filter).all()
        else:
            users = User.objects.filter(
                Q(is_auth = 10) &
                Q(username__contains = username_value) & 
                Q(first_course__campus = campus_value) 
                ).order_by(date_filter).all()
            
        # 캠퍼스 쿼리
        campuses = Campus.objects.all()

        # 직렬화
        user_serializer = UserAuthSerializer(users, many = True)
        campus_serializer = CampusSerializer(campuses, many = True)

        data = {
            'list': user_serializer.data,
            'campus': campus_serializer.data
        }
        return Response(data, status = status.HTTP_200_OK)

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
        # 필터들
        username_value = request.query_params.get('username')
        campus_value = int(request.query_params.get('campus'))
        signupdate_date_value = request.query_params.get('signupdate')
        auth_value = int(request.query_params.get('auth'))

        date_filter = None
        # 날짜별 정렬
        if signupdate_date_value == 'oldest':
            date_filter = '-signup_date'
        else:
            date_filter = 'signup_date'

        users = None
        # default 유저 쿼리
        # 필터는 하나만 적용 가능, is_active false 제외할것인가..
        if campus_value == 0: 
            users = User.objects.exclude(is_auth = 10).filter(
                Q(username__contains = username_value) & 
                Q(is_auth = auth_value)
                ).order_by(date_filter).all()
        else:
            users = User.objects.exclude(is_auth = 10).filter(
                Q(username__contains = username_value) & 
                Q(first_course__campus = campus_value) &
                Q(is_auth = auth_value)
                ).order_by(date_filter).all()
            
        # 캠퍼스 쿼리
        campuses = Campus.objects.all()

        # 직렬화
        user_serializer = UserAuthSerializer(users, many = True)
        campus_serializer = CampusSerializer(campuses, many = True)

        data ={
            'list': user_serializer.data,
            'campus': campus_serializer.data
        }
        return Response(data, status = status.HTTP_200_OK)
    
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

        if not reports:
            return Response({'message': ResponseMessages.REPORT_NO_POSTS_TO_DISPLAY}, status=status.HTTP_200_OK)

        serializer = ReportDetailSerializer(reports, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class HandleReport(APIView):
    def post(self, request: HttpRequest, **kwargs) -> Response:
        report = Report.objects.get(id = request.data['id'])
        report.report_status = request.data['report_status']
        report.save()

        return Response('ok', status = status.HTTP_200_OK)