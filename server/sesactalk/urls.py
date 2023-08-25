from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

from post.views import Main

urlpatterns = [
    path('', Main.as_view(), name = 'Main'),
    path('admin/', include('master.urls')),
    path('accounts/', include('accounts.urls')),
    path('user/', include('user.urls')),
    path('post/', include('post.urls')),
]

urlpatterns += static(settings.MEDIA_URL, document_root = settings.MEDIA_ROOT)

if settings.DEBUG:
    import debug_toolbar
    urlpatterns += [
        path('__debug__', include(debug_toolbar.urls))
    ]

