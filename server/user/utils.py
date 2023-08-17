from firebase_admin import messaging
def send_fcm_notification(token, title, body, data = None):
    message = messaging.Message(
        token = token,
        notification = messaging.Notification(
            title = title,
            body = body,
        ),
        data = data
    )
    messaging.send(message)