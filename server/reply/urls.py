from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns  

from reply.views import ReplyView, ReplyDetailView, ReportReply

urlpatterns = [
    path('<int:p_sq>/', ReplyView.as_view(), name = 'ReplyView'),
    path('<int:p_sq>/<int:r_sq>/', ReplyDetailView.as_view(), name = 'ReplyDetailView'),
    path('<int:p_sq>/<int:r_sq>/report/', ReportReply.as_view(), name = 'ReportReply'),
]

urlpatterns = format_suffix_patterns(urlpatterns)

