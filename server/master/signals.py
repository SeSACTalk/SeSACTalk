from django.db.models.signals import pre_save
from django.dispatch import receiver

from post.models import Post, Reply, Report

def get_reported_content_obj(content_type):
    obj = None
    if content_type == 'post' :
        obj = Post
    elif content_type == 'reply':
        obj = Reply
    return obj

@receiver(pre_save, sender=Report)
def update_related_content(sender, instance, **kwargs):
    old_report_exist = Report.objects.filter(id = instance.id).exists()
    if old_report_exist:
        old_report = Report.objects.get(id = instance.id)
        content_obj = get_reported_content_obj(instance.content_type)

        if old_report.report_status != instance.report_status:
            # report_status 컬럼이 변경되었을 때만 실행, 신고처리(10)일 떄만 신고 여부를 True로 변경
            if instance.report_status == 10:
                content_obj = content_obj.objects.get(id = instance.content_id)
                content_obj.report_status = True
                content_obj.save()