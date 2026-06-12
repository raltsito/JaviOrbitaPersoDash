from django.contrib import admin

from .models import FraseMes, Objetivo


@admin.register(Objetivo)
class ObjetivoAdmin(admin.ModelAdmin):
    list_display = ["titulo", "periodo", "categoria", "progreso", "activo", "usuario"]
    list_filter = ["periodo", "categoria", "activo"]


@admin.register(FraseMes)
class FraseMesAdmin(admin.ModelAdmin):
    list_display = ["texto", "autor", "usuario"]
