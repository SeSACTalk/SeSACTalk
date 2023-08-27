from django.db.models import Q, Subquery
from django.http import HttpRequest
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

from accounts.models import User, Campus
from accounts.serializers import CampusSerializer
from master.serializers import UserSerializer, UserAuthSerializer

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
            return Response({'message':'수정되었습니다'}, status = status.HTTP_201_CREATED)
        return Response({'message':'다시 시도해주세요'}, status = status.HTTP_400_BAD_REQUEST)

class UserAuthRequestView(APIView):
    def get(self, request: HttpRequest) -> Response:
        # 필터들
        username_value = request.query_params.get('username')
        campus_value = int(request.query_params.get('campus'))
        approval_date_value = request.query_params.get('approvaldate')
        auth_value = int(request.query_params.get('auth'))

        date_filter = None
        # 날짜별 정렬
        if approval_date_value == 'oldest':
            date_filter = '-auth_approval_date'
        else:
            date_filter = 'auth_approval_date'

        users = None
        # default 유저 쿼리
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
            return Response({'message':'수정되었습니다'}, status = status.HTTP_201_CREATED)
        return Response({'message':'다시 시도해주세요'}, status = status.HTTP_400_BAD_REQUEST)