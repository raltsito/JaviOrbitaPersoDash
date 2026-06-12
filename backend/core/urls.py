"""Rutas raíz del proyecto."""
from django.contrib import admin
from django.http import JsonResponse
from django.urls import include, path


def health(request):
    return JsonResponse({"status": "ok", "app": "orbita"})


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/health/", health),
    path("api/auth/", include("usuarios.urls")),
    path("api/", include("core.api_urls")),
]
