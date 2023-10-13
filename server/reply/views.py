from django.http import HttpRequest

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

from post.models import Reply
from post.serializers import ReportSerializer
from profiles.models import Profile
from profiles.serializers import EditProfileSerializer
from reply.constants import ResponseMessages
from reply.serializers import ReplySerializer
from sesactalk.mixins import SessionDecoderMixin


class ReplyView(APIView, SessionDecoderMixin):
    def get(self, request: HttpRequest, p_sq: int)-> Response:
        user_id = self.extract_user_id_from_session(request.META.get('HTTP_AUTHORIZATION', ''))

        response_data=[]
        reply_querysets = Reply.objects.filter(post = p_sq).order_by('-date')
        for reply in reply_querysets:
            data = {}
            data['reply']=ReplySerializer(reply).data
            data['isReplyMine'] = user_id == reply.user.id

            response_data.append(data)
        return Response(data=response_data, status=status.HTTP_200_OK)

    def post(self, request: HttpRequest, p_sq: int)-> Response:
        print(p_sq)
        user_id = self.extract_user_id_from_session(request.META.get('HTTP_AUTHORIZATION', ''))
        content = request.data.get('content')

        # Reply 모델에 데이터 삽입
        data={'content':content, 'user':user_id, 'post':p_sq}
        replySerializer = ReplySerializer(data=data)

        if replySerializer.is_valid():
            replySerializer.save()
            print("댓글이 성공적으로 삽입되었습니다.")
            return Response(status=status.HTTP_200_OK)
        else:
            print(f"댓글 유효성 검사 실패")
            print(f'<<CHECK INVALID DATA>>\n{replySerializer.errors}')
            return Response({"errors" : replySerializer.errors}, status = status.HTTP_400_BAD_REQUEST)

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
    
    # def put(self, request: HttpRequest, p_sq: int, r_sq: int)-> Response:
    #     # session_key로 user_id get
    #     user_id = self.extract_user_id_from_session(request.META.get('HTTP_AUTHORIZATION', ''))
    #
    #     reply_queryset = Reply.objects.get(id = r_sq)
    #     if reply_queryset.user.id == user_id:
    #         reply_queryset.content=request.data
    #         reply_queryset.save()
    #     else:
    #         return Response(status = status.HTTP_400_BAD_REQUEST)
    #
    #     return Response(status = status.HTTP_200_OK)

class ReportReply(APIView, SessionDecoderMixin):
    def post(self, request, p_sq:int, r_sq:int) -> Response:
        reportSerializer = ReportSerializer(data = request.data)
        reportSerializer.content_id = r_sq
        reportSerializer.reported = Reply.objects.get(id = r_sq).user_id
        reportSerializer.reporter = self.extract_user_id_from_session(request.META.get('HTTP_AUTHORIZATION'))

        if not reportSerializer.is_valid():
            return Response({'error': reportSerializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        reportSerializer.save()
        return Response({'message': ResponseMessages.REPORT_CREATE_SUCCESS}, status=status.HTTP_201_CREATED)