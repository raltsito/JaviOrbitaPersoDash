from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import AccesoRapido, Perfil, Usuario


@admin.register(Usuario)
class UsuarioAdmin(UserAdmin):
    ordering = ["email"]
    list_display = ["email", "is_active", "is_staff", "date_joined"]
    search_fields = ["email"]
    fieldsets = (
        (None, {"fields": ("email", "password")}),
        ("Permisos", {"fields": ("is_active", "is_staff", "is_superuser", "groups")}),
        ("Fechas", {"fields": ("last_login", "date_joined")}),
    )
    add_fieldsets = ((None, {"classes": ("wide",), "fields": ("email", "password1", "password2")}),)


@admin.register(Perfil)
class PerfilAdmin(admin.ModelAdmin):
    list_display = ["nombre", "usuario", "tema", "densidad"]


@admin.register(AccesoRapido)
class AccesoRapidoAdmin(admin.ModelAdmin):
    list_display = ["nombre", "usuario", "url", "orden"]
