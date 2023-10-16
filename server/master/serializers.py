from rest_framework import serializers

from accounts.models import User
from accounts.serializers import CourseSerializer
from profiles.serializers import ProfileSerializer
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
    auth_approval_date = serializers.DateTimeField(format = "%Y년 %m월 %d일 %H시 %M분")

    def validate(self, data):
        is_auth = data.get('is_auth')
        if is_auth is not None and (is_auth < 0 or is_auth > 40):
            raise serializers.ValidationError('is auth 값은 0에서 3 사이어야 합니다')
        return data

    class Meta:
        model = User
        exclude = ('password', 'user_permissions', 'groups', 'withdraw_date', 'last_login', 'is_superuser')

class UserCourseSerializer(serializers.ModelSerializer):
    campus_name = serializers.SerializerMethodField()
    course_name = serializers.SerializerMethodField()
    profile_set = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'name', 'username', 'campus_name', 'course_name', 'profile_set')

    def get_campus_name(self, user):
        return user.second_course.campus.name
        
    def get_course_name(self, user):
         return user.second_course.name
    
    def get_profile_set(self, user):
        profile = user.profile_set.get()
        serializer = ProfileSerializer(profile)
        return serializer.data

class ReportDetailSerializer(serializers.ModelSerializer):
    date = serializers.SerializerMethodField(read_only=True)
    content_type = serializers.SerializerMethodField(read_only=True)
    reported_name = serializers.CharField(source='reported.name', read_only=True)
    reported_username = serializers.CharField(source='reported.username', read_only=True)
    reporter_name = serializers.CharField(source='reporter.name', read_only=True)
    reporter_username = serializers.CharField(source='reporter.username', read_only=True)

    reported_content = serializers.SerializerMethodField(read_only=True)
    post_id = serializers.SerializerMethodField(read_only=True)

    uri = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = Report
        fields = '__all__'

    def get_date(self, report):
        return report.date.strftime('%Y-%m-%d %p %I:%M:%S')

    def get_content_type(self, report):
        content_type = report.content_type
                
        if content_type == 'reply':
            return '댓글'
        if content_type == 'post':
            return '게시물'

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
    def get_reply_id(self, report):
        reply_id = None
        if report.content_type == 'reply':
            reply_id = Reply.objects.get(id=report.content_id).id
        return reply_id

    def get_uri(self, report):
        post_id = self.get_post_id(report)
        post_uuid = Post.objects.get(pk = post_id).uuid
        return f"/post/{post_uuid}"