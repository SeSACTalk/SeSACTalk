from rest_framework import serializers

from accounts.models import User
from accounts.serializers import CourseSerializer
from post.models import Report, Post, Reply


class UserSerializer(serializers.ModelSerializer):
    first_course = CourseSerializer(read_only = True)
    second_course = CourseSerializer(read_only = True)
    auth_approval_date = serializers.DateTimeField(format = "%Y년 %m월 %d일 %H시%M분")
    last_login = serializers.DateTimeField(format = "%Y년 %m월 %d일 %H시%M분")
    withdraw_date = serializers.DateTimeField(format = "%Y년 %m월 %d일 %H시%M분")

    is_auth = serializers.SerializerMethodField()

    class Meta:
        model = User
        exclude = ('password', 'user_permissions', 'groups', 'signup_date')
    
    def get_is_auth(self, user):
        if user.is_auth == 10:
            return '승인'
        elif user.is_auth == 11:
            return '임시비밀번호 발급'
        elif user.is_auth == 20:
            return '비밀번호 변경 대기'


class UserAuthSerializer(serializers.ModelSerializer):
    first_course = CourseSerializer(read_only = True)
    second_course = CourseSerializer(read_only = True)
    signup_date = serializers.DateTimeField(format = "%Y년 %m월 %d일")

    def validate(self, data):
        is_auth = data.get('is_auth')
        if is_auth is not None and (is_auth < 0 or is_auth > 40):
            raise serializers.ValidationError('is auth 값은 0에서 3 사이어야 합니다')
        return data

    class Meta:
        model = User
        exclude = ('password', 'user_permissions', 'groups', 'withdraw_date', 'last_login', 'auth_approval_date', 'is_superuser')
    

class ReportDetailSerializer(serializers.ModelSerializer):
    reported_name = serializers.CharField(source='reported.name', read_only=True)
    reported_username = serializers.CharField(source='reported.username', read_only=True)
    reporter_name = serializers.CharField(source='reporter.name', read_only=True)
    reporter_username = serializers.CharField(source='reporter.username', read_only=True)

    reported_content = serializers.SerializerMethodField()
    post_id = serializers.SerializerMethodField()

    class Meta:
        model = Report
        fields = ['id', 'date', 'content_type', 'category', 'content_id', 'report_status',
                  'reported_id', 'reported_name', 'reported_username',
                  'reporter_id', 'reporter_name', 'reporter_username',
                  'reported_content', 'post_id']

    def get_reported_content(self, report):
        if report.content_type == 'post':
            return Post.objects.get(id=report.content_id).content
        elif report.content_type == 'reply':
            return Reply.objects.get(id=report.content_id).content

    def get_post_id(self, report):
        if report.content_type == 'post':
            return report.content_id
        elif report.content_type == 'reply':
            reply = Reply.objects.filter(id=report.content_id).select_related('post').first()
            return reply.post.id