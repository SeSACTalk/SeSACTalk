from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver

from user.utils import send_fcm_notification
from chat.models import Chat, ChatRoom
from user.models import UserRelationship
from post.models import Reply, Like, Report

@receiver(post_save, sender = Reply) # 댓글 생성알림
def send_fcm_on_new_reply(sender, instance, created, **kwargs):
    if created:
        reply_user = instance.user.name
        reply_content = instance.content

        try:
            post_author_token = instance.post.user.fcmtoken.token
        except:
            post_author_token = None
        message_title = "새 알림"
        message_body = f"{reply_user}님이 회원님의 게시글에 댓글을 남겼습니다."
        data_message = {
            'reply_id': str(instance.id),
            'reply_content': str(reply_content),
        }

        send_fcm_notification(post_author_token, message_title, message_body, data_message)

@receiver(post_save, sender = Like) # 좋아요 알림
def send_fcm_on_new_like(sender, instance, created, **kwargs):
    if created:
        like_user = instance.user.name

        try: 
            post_author_token = instance.post.user.fcmtoken.token
        except:
            post_author_token = None

        message_title = "새 알림"
        message_body = f"{like_user}님이 회원님의 게시글에 좋아요를 남겼습니다."
        data_message = {
            'like_id': str(instance.id),
        }

        send_fcm_notification(post_author_token, message_title, message_body, data_message)

@receiver(post_save, sender = UserRelationship) # 팔로우 알림
def send_fcm_on_new_follow(sender, instance, created, **kwargs):
    if created:
        follower = instance.user_follower.name
        
        try:
            user_token = instance.user_follow.fcmtoken.token
        except:
            user_token = None

        message_title = "새 알림"
        message_body = f"{follower}님이 회원님을 팔로우합니다."
        data_message = {
            'follow_id': str(instance.id),
        }

        send_fcm_notification(user_token, message_title, message_body, data_message)

@receiver(post_save, sender = Chat) # 채팅 알림
def send_fcm_on_new_chat(sender, instance, created, **kwargs):
    if created:
        chat_room_id = instance.chat_room.id
        sender_id = instance.sender.id
        sender_name = instance.sender.name
        
        # 조건에 따른 받는 사용자 조회
        target = None

        chat_room = ChatRoom.objects.get(id = chat_room_id)

        if chat_room.user_one.id == sender_id:
            target = chat_room.user_two.id
        elif chat_room.user_two.id == sender_id:
            target = chat_room.user_one.id

        try:
            receiver_token = target.fcmtoken.token
        except:
            receiver_token = None

        message_title = "새 메시지"
        message_body = f"{sender_name}님이 회원님에게 메시지를 보냈습니다.."
        data_message = {
            'sender_id': str(instance.sender.id),
        }

        send_fcm_notification(receiver_token, message_title, message_body, data_message)

@receiver(post_delete, sender = Report) # 신고 알림
def send_fcm_on_new_report(sender, instance, **kwargs):
    try:
        reported_token = instance.reported.fcmtoken.token
    except:
        reported_token = None

    message_title = "새 알림"
    message_body = f"회원님의 게시글이 운영정책 위반으로 삭제되었습니다."
    data_message = {
        'report_id': str(instance.id),
        'report_date': str(instance.date),
    }

    send_fcm_notification(reported_token, message_title, message_body, data_message)