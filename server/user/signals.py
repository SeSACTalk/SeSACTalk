from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver

from user.utils import send_fcm_notification
from chat.models import Chat
from user.models import UserRealtionship
from post.models import Reply, Like, Report

@receiver(post_save, sender = Reply) # 댓글 생성알림
def send_fcm_on_new_reply(sender, instance, created, **kwargs):
    if created:
        reply_user = instance.user.name
        reply_content = instance.content

        post_author_token = instance.post.user.fcm_token

        message_title = "새 알림"
        message_body = f"{reply_user}님이 회원님의 게시글에 댓글을 남겼습니다."
        data_message = {
            'reply_id': instance.id,
            'reply_content': reply_content,
        }

        send_fcm_notification(post_author_token, message_title, message_body, data_message)

@receiver(post_save, sender = Like) # 좋아요 알림
def send_fcm_on_new_like(sender, instance, created, **kwargs):
    if created:
        like_user = instance.user.name

        post_author_token = instance.post.user.fcm_token

        message_title = "새 알림"
        message_body = f"{like_user}님이 회원님의 게시글에 좋아요를 남겼습니다."
        data_message = {
            'like_id': instance.id,
        }

        send_fcm_notification(post_author_token, message_title, message_body, data_message)

@receiver(post_save, sender = UserRealtionship) # 팔로우 알림
def send_fcm_on_new_follow(sender, instance, created, **kwargs):
    if created:
        follower = instance.user_follower.name

        user_token = instance.user_follow.fcm_token

        message_title = "새 알림"
        message_body = f"{follower}님이 회원님을 팔로우합니다."
        data_message = {
            'follow_id': instance.id,
        }

        send_fcm_notification(user_token, message_title, message_body, data_message)

# TODO : 채팅 수정하기
@receiver(post_save, sender = Chat) # 채팅 알림
def send_fcm_on_new_chat(sender, instance, created, **kwargs):
    if created:
        sender = instance.sender.name

        receiver_token = instance.reciever.fcm_token

        message_title = "새 메시지"
        message_body = f"{sender}님이 회원님에게 메시지를 보냈습니다.."
        data_message = {
            'sender_id': instance.id,
        }

        send_fcm_notification(receiver_token, message_title, message_body, data_message)

@receiver(post_delete, sender = Report) # 신고 알림
def send_fcm_on_new_report(sender, instance, **kwargs):
    reported_token = instance.reported.fcm_token

    message_title = "새 알림"
    message_body = f"회원님의 게시글이 운영정책 위반으로 삭제되었습니다."
    data_message = {
        'report_id': instance.id,
        'report_date': instance.date,
    }

    send_fcm_notification(reported_token_token, message_title, message_body, data_message)