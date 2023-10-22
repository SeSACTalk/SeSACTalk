import os

from django.db.models.signals import pre_save
from django.dispatch import receiver
from profiles.models import Profile

@receiver(pre_save, sender = Profile)
def update_profile_image(sender, instance, **kwargs):
    img_path = instance.img_path
    if img_path and os.path.isfile(img_path.path):
        os.remove(img_path.path)