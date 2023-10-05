from django.db.models import Q
from django.http import HttpRequest
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from datetime import datetime

from accounts.models import User, Campus
from accounts.serializers import CampusSerializer
from master.serializers import UserSerializer, UserAuthSerializer, ReportDetailSerializer
from master.constants import ResponseMessages
from post.models import Report
from master.mixins import AccessRestrictionMixin

class UserListView(APIView, AccessRestrictionMixin):
    def get(self, request: HttpRequest) -> Response:
        is_staff = self.check_admin_by_pk(request.META.get('HTTP_AUTHORIZATION', ''))
        if not is_staff:
            return Response({'message':ResponseMessages.NOT_STAFF}, status = status.HTTP_401_UNAUTHORIZED)
       
       # 필터들
        name_value = request.query_params.get('name')
        campus_value = request.query_params.get('campus')
        approval_date_value = request.query_params.get('date')
        
        # 사용자 가져오기
        users = User.objects.filter(
                (Q(is_auth = 10)| Q(is_auth = 11) | Q(is_auth = 21)) &
                Q(name__contains = name_value) &
                Q(auth_approval_date__contains = approval_date_value) &
                (Q(first_course__campus__name__contains = campus_value) | 
                 Q(second_course__campus__name__contains = campus_value))
                ).all()
        
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

class UserDetailVeiw(APIView, AccessRestrictionMixin):
    def get(self, request: HttpRequest, **kwargs) -> Response:
        is_staff = self.check_admin_by_pk(request.META.get('HTTP_AUTHORIZATION', ''))
        if not is_staff:
            return Response({'message':ResponseMessages.NOT_STAFF}, status = status.HTTP_401_UNAUTHORIZED)
        
        user_id = kwargs['id']
        user = User.objects.get(id = user_id)
        serializer = UserSerializer(user)

        return Response(serializer.data, status = status.HTTP_200_OK)

class UserAuthRequestView(APIView, AccessRestrictionMixin):
    def get(self, request: HttpRequest) -> Response:
        is_staff = self.check_admin_by_pk(request.META.get('HTTP_AUTHORIZATION', ''))
        if not is_staff:
            return Response({'message':ResponseMessages.NOT_STAFF}, status = status.HTTP_401_UNAUTHORIZED)
        
        # 필터들
        name_value = request.query_params.get('name')
        campus_value = request.query_params.get('campus')
        signup_date_date_value = request.query_params.get('date')
        auth_value = request.query_params.get('auth')

        # 사용자 쿼리
        users = User.objects.filter(
                Q(is_auth = auth_value) &
                Q(name__contains = name_value) &
                Q(signup_date__contains = signup_date_date_value) &
                (Q(first_course__campus__name__contains = campus_value) | 
                 Q(second_course__campus__name__contains = campus_value))
                ).all()
        
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
        is_staff = self.check_admin_by_pk(request.META.get('HTTP_AUTHORIZATION', ''))
        if not is_staff:
            return Response({'message':ResponseMessages.NOT_STAFF}, status = status.HTTP_401_UNAUTHORIZED)
        
        user = User.objects.get(id = request.data['id'])

        if request.data['is_auth'] == 10:
            request.data['auth_approval_date'] = datetime.now()

        serializer = UserAuthSerializer(user, data = request.data, partial = True)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': ResponseMessages.UPDATE_SUCCESS}, status = status.HTTP_202_ACCEPTED)
        
        return Response({'message':ResponseMessages.UPDATE_FAIL}, status = status.HTTP_304_NOT_MODIFIED)

class NotifycationReport(APIView, AccessRestrictionMixin):
    def get(self, request: HttpRequest) -> Response:
        is_staff = self.check_admin_by_pk(request.META.get('HTTP_AUTHORIZATION', ''))
        if not is_staff:
            return Response({'message':ResponseMessages.NOT_STAFF}, status = status.HTTP_401_UNAUTHORIZED)
        
        # 신고 처리 또는 거절된 것을 제외한 신고 내역만 가져옴
        reports = Report.objects.exclude(
            Q(report_status = 10) | Q(report_status = 30)
        ).select_related('reported', 'reporter').order_by('-date')

        if not reports:
            return Response({'message': ResponseMessages.REPORT_NO_POSTS_TO_DISPLAY}, status=status.HTTP_200_OK)

        serializer = ReportDetailSerializer(reports, many = True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class HandleReport(APIView, AccessRestrictionMixin):
    def post(self, request: HttpRequest, **kwargs) -> Response:
        is_staff = self.check_admin_by_pk(request.META.get('HTTP_AUTHORIZATION', ''))
        if not is_staff:
            return Response({'message':ResponseMessages.NOT_STAFF}, status = status.HTTP_401_UNAUTHORIZED)
        
        report = Report.objects.get(id = request.data['id'])
        report.report_status = request.data['report_status']
        report.save()

        return Response('ok', status = status.HTTP_200_OK)