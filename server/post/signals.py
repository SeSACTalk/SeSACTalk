import os
from django.db.models.signals import post_delete, post_save
from django.dispatch import receiver


from post.models import Post, HashTag

@receiver(post_delete, sender = Post)
def delete_post_image(sender, instance, **kwargs):
    # Post의 record가 삭제될 때, Post의 img_path가 참조하는 경로의 이미지도 삭제한다.
    if instance.img_path:
        if os.path.isfile(instance.img_path.path):
            os.remove(instance.img_path.path)

@receiver(post_save, sender = Post)
def connect_with_tags(sender, instance, created, **kwargs):
    if created:
        origin_contents = instance.content.split() # 원본 content
        
        hash_tags = [] # 해시태그들
        content = '' # 저장해야할 content
        
        for origin_content in origin_contents:
            if origin_content.startswith('#'):
                hash_tags.append(origin_content[1:])
            else:
                content += f'{origin_content} '

        content = content.strip()

        # 원본 content 업데이트
        instance.content = content

        # POST 칼럼 업데이트
        instance.save()

        for hash_tag in hash_tags:
            h_tag, created = HashTag.objects.get_or_create(name = hash_tag)
            instance.tags.add(h_tag)