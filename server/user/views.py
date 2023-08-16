from django.http import HttpRequest
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from firebase_admin import messaging
# Create your views here.
class NotificationView(APIView):
    def post(self, request:HttpRequest) -> Response:
        fcm_token = request.data['fcm_token']
        if not fcm_token:
            return Response({'message': 'FCM token is required'}, status = status.HTTP_400_BAD_REQUEST)
        


        # 푸시 알림 메시지 설정
        message = messaging.Message(
            token = fcm_token,
            notification = messaging.Notification(
                title = "New Notification",
                body = "You've got a new message!"
            )
        )

        # 푸시 알림 발송
        try:
            response = messaging.send(message)
            return Response({'message': 'Push Notification sent'})
        except Exception:
            return Response({'message': str(Exception)}, status = status.HTTP_500_INTERNAL_SERVER_ERROR)