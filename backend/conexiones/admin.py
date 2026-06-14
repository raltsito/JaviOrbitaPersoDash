from django.contrib import admin

from .models import Conexion


@admin.register(Conexion)
class ConexionAdmin(admin.ModelAdmin):
    list_display = ["nombre", "relacion", "ultimo_contacto", "usuario"]
