import os

from django.db.models.signals import post_delete, post_save
from django.dispatch import receiver
from profiles.models import Profile

@receiver(post_save, sender = Profile)
def update_profile_image(sender, instance, **kwargs):
    # Post의 record가 삭제될 때, Post의 img_path가 참조하는 경로의 이미지도 삭제한다.
    if instance.img_path:
        if os.path.isfile(instance.img_path.path):
            os.remove(instance.img_path.path)