"""
URL configuration for rifas_project project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path
from django.http import JsonResponse
from django.conf import settings
from django.conf.urls.static import static


def api_root(request):
    return JsonResponse({
        "users": "/api/users/",
        "raffles": "/api/raffles/",
        "sales": "/api/sales/",
        "payments": "/api/payments/",
        "comments": "/api/comments/",
    })


urlpatterns = [
    path('admin/', admin.site.urls),

    # 🔥 API ROOT
    path('', api_root),

    path('api-auth/', include('rest_framework.urls')),

    path('api/users/', include('apps.users.urls')),
    path('api/raffles/', include('apps.raffles.urls')),
    path('api/sales/', include('apps.sales.urls')),
    path('api/payments/', include('apps.payments.urls')),
    path('api/comments/', include('apps.comments.urls')),
    path(
    "api/comments/",
    include("apps.comments.urls")
),
]

# 🖼️ MEDIA FILES (IMPORTANT for images)
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)