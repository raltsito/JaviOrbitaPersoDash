"""Rutas raíz del proyecto."""
from django.contrib import admin
from django.http import JsonResponse
from django.urls import include, path, re_path
from django.views.generic import TemplateView


def health(request):
    return JsonResponse({"status": "ok", "app": "orbita"})


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/health/", health),
    path("api/auth/", include("usuarios.urls")),
    path("api/", include("core.api_urls")),
    # SPA: cualquier ruta no-API sirve el index.html del build de Vite
    re_path(r"^.*$", TemplateView.as_view(template_name="index.html")),
]
