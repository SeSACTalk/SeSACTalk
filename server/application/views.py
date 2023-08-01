from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import authenticate, login
from django.http import Http404

from .serializers import ReviewSerializer
from .models import Review

class ReviewList(APIView): # 목록 보여줌
    def get(self, request): # 리스트 보여줌
        reviews = Review.objects.all()

        serializer = ReviewSerializer(reviews, many=True) # 여러개 객체를 serializer 하려면 many=True
        return Response(serializer.data)

    def post(self, request): # 새 글 작성시
        serializer = ReviewSerializer(data= request.data) # request.data 는 사용자의 입력데이터
        if serializer.is_valid(): #유효성 검사
            serializer.save() # 저장 
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.erros, status=status.HTTP_400_BAD_REQUEST)
        
class ReviewDetail(APIView):
    def get_object(self, pk): #Review 객체 가져오기
        try:
            return Review.objects.get(pk=pk)
        except Review.DoesNotExist:
            raise Http404
        
    def get(self, request, pk, format=None): # Review Detail 보기
        review = self.get_object(pk)
        serializer = ReviewSerializer(review)
        return Response(serializer.data)
    
    def put(self, request, pk, format=None): # Review 수정하기
        review = self.get_object(pk)
        serializer = ReviewSerializer(review, data=request.data)
        if serializer.is_valid(): # 유효성검사
            serializer.save() # 저장
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk, format=None): #Review 삭제하기
        review = self.get_object(pk)
        review.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)

        if user:
            login(request, user)
            return Response({'message': 'Login Successful'})
        else:
            return Response({'error': 'Invalud credentials'}, status=400)

# Create your views here.
