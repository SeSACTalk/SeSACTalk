from django.http import HttpRequest

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

from post.models import Reply
from profiles.models import Profile
from profiles.serializers import EditProfileSerializer
from reply.serializers import ReplySerializer
from sesactalk.mixins import SessionDecoderMixin


class ReplyView(APIView, SessionDecoderMixin):
    def get(self, request: HttpRequest, p_sq: int)-> Response:
        user_id = self.extract_user_id_from_session(request.META.get('HTTP_AUTHORIZATION', ''))

        response_data=[]
        reply_querysets = Reply.objects.filter(post = p_sq)
        for reply in reply_querysets:
            data={}
            replySerializer = ReplySerializer(reply)
            data['reply']=replySerializer.data
            profile_queryset = Profile.objects.select_related('user').filter(user__id = reply.user.id).first()
            if profile_queryset:
                profileSerializer = EditProfileSerializer(profile_queryset)
                data['profile']=profileSerializer.data

            # user_id와 reply_userid 값 비교(True == 내 댓글)
            data['isReplyMine'] = user_id == reply.user.id

            response_data.append(data)

        return Response(data=response_data, status=status.HTTP_200_OK)
    def post(self, request: HttpRequest, p_sq: int)-> Response:
        # 클라이언트에서 전송된 데이터 가져오기
        reply_text = request.data.get('replyText')

        user_id = self.extract_user_id_from_session(request.META.get('HTTP_AUTHORIZATION', ''))

        # Reply 모델에 데이터 삽입
        try:
            data={'content':reply_text, 'user':user_id, 'post':p_sq}
            replySerializer = ReplySerializer(data=data)
            
            if replySerializer.is_valid():
                replySerializer.save()
            else:
                print(f"댓글 유효성 검사 실패")
                print(f'<<CHECK INVALID DATA>>\n{replySerializer.errors}')

            print("댓글이 성공적으로 삽입되었습니다.")
            return Response(status=status.HTTP_200_OK)
        
        except Exception as e:
            print(f"댓글 삽입 중 오류 발생: {str(e)}")
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ReplyDetailView(APIView, SessionDecoderMixin):
    def delete(self, request: HttpRequest, p_sq: int, r_sq: int)-> Response:
        # session_key로 user_id get
        user_id = self.extract_user_id_from_session(request.META.get('HTTP_AUTHORIZATION', ''))

        reply_queryset = Reply.objects.filter(id = r_sq).first()
        if reply_queryset.user.id == user_id:
            reply_queryset.delete()
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        return Response(status=status.HTTP_200_OK)
    
    def put(self, request: HttpRequest, p_sq: int, r_sq: int)-> Response:
        # session_key로 user_id get
        user_id = self.extract_user_id_from_session(request.META.get('HTTP_AUTHORIZATION', ''))

        reply_queryset = Reply.objects.get(id = r_sq)
        if reply_queryset.user.id == user_id:
            reply_queryset.content=request.data
            reply_queryset.save()
        else:
            return Response(status = status.HTTP_400_BAD_REQUEST)

        return Response(status = status.HTTP_200_OK)