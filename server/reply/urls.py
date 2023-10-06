from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns  

from reply.views import ReplyView, ReplyDetailView

urlpatterns = [
    path('<int:p_sq>/', ReplyView.as_view(), name = 'ReplyView'),
    path('<int:p_sq>/<int:r_sq>/', ReplyDetailView.as_view(), name = 'ReplyDetailView'),
]

urlpatterns = format_suffix_patterns(urlpatterns)

