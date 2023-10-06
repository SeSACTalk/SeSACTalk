from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

from post.views import Main, RecruitView

urlpatterns = [
    path('', Main.as_view(), name = 'Main'),
    path('recruit/', RecruitView.as_view(), name = 'RecruitView'),
    path('admin/', include('master.urls')),
    path('accounts/', include('accounts.urls')),
    path('user/', include('user.urls')),
    path('post/', include('post.urls')),
    path('chat/', include('chat.urls')),
    path('explore/', include('explore.urls')),
    path('profile/', include('profiles.urls')),
    path('reply/', include('reply.urls')),
]

urlpatterns += static(settings.MEDIA_URL, document_root = settings.MEDIA_ROOT)

if settings.DEBUG:
    import debug_toolbar
    urlpatterns += [
        path('__debug__', include(debug_toolbar.urls))
    ]