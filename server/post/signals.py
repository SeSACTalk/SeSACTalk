import os

from django.db.models.signals import post_delete
from django.dispatch import receiver
from post.models import Post


@receiver(post_delete, sender=Post)
def delete_post_image(sender, instance, **kwargs):
    # Post의 record가 삭제될 때, Post의 img_path가 참조하는 경로의 이미지도 삭제한다.
    if instance.img_path:
        if os.path.isfile(instance.img_path.path):
            os.remove(instance.img_path.path)