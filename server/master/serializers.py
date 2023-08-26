from rest_framework import serializers

from accounts.models import User
from accounts.serializers import CourseSerializer
from post.models import Report, Post, Reply


class UserSerializer(serializers.ModelSerializer):
    first_course = CourseSerializer(read_only = True)
    second_course = CourseSerializer(read_only = True)
    class Meta:
        model = User
        exclude = ('password',)


class UserAuthSerializer(serializers.ModelSerializer):
    first_course = CourseSerializer(read_only = True)
    second_course = CourseSerializer(read_only = True)

    def validate(self, data):
        is_auth = data.get('is_auth')
        if is_auth is not None and (is_auth < 0 or is_auth > 40):
            raise serializers.ValidationError('is auth 값은 0에서 3 사이어야 합니다')
        return data

    class Meta:
        model = User
        fields = (
        'id', 'username', 'name', 'birthdate', 'gender', 'phone_number', 'email', 'signup_date', 'withdraw_date',
        'first_course', 'second_course', 'is_auth', 'is_active', 'is_staff', 'is_superuser')


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