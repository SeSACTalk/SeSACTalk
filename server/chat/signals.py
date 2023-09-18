from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver

from chat.models import Chat, ChatRoom

@receiver(post_save, sender = Chat)
def connect_with_tags(sender, instance, created, **kwargs):
    if created:
        chat_room = instance.chat_room.id
        content = instance.content

        ChatRoom.objects.filter(id = chat_room).update(latest_content = content)


        
        
        