from rest_framework import serializers

from datetime import datetime

from post.models import Reply

class ReplySerializer(serializers.ModelSerializer):
    date = serializers.SerializerMethodField(read_only=True)
    img_path = serializers.SerializerMethodField(read_only=True)
    is_staff = serializers.BooleanField(source = 'user.is_staff', read_only=True)
    username = serializers.CharField(source = 'user.username', read_only=True)
    name = serializers.CharField(source = 'user.name', read_only=True)
    campusname = serializers.SerializerMethodField(read_only=True)

    post_id = serializers.IntegerField(source='post.id', read_only=True)
    class Meta:
        model = Reply
        fields = '__all__'
    def get_campusname(self, reply):
        user = reply.user
        try:
            campus_name = user.second_course.campus.name
        except Exception:
            campus_name = user.first_course.campus.name
        return campus_name

    def get_date(self, reply):
        date = reply.date
        today = datetime.now(date.tzinfo)
        difference = today - date

        if 7 <= difference.days < 28:
            return f"{difference.days // 7}주"
        elif 1 <= difference.days < 7:
            return f"{difference.days}일"
        elif 0 <= difference.total_seconds() < 86400:
            hours, remainder = divmod(difference.seconds, 3600)
            minutes = remainder // 60
            if hours >= 1:
                return f"{hours}시간"
            else:
                return f"{minutes}분"
        else:
            return date.strftime('%Y년 %m월 %d일')

    def get_img_path(self, reply):
        profile = reply.user.profile_set.first()
        if profile.img_path:
            img_path = profile.img_path
        else:
            img_path = '/media/profile/default_profile.png'

        return img_path

