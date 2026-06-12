from django.contrib import admin

from .models import Habito, RegistroHabito


@admin.register(Habito)
class HabitoAdmin(admin.ModelAdmin):
    list_display = ["nombre", "tipo", "objetivo", "unidad", "mejor_mas", "activo", "usuario"]
    list_filter = ["tipo", "activo"]


@admin.register(RegistroHabito)
class RegistroHabitoAdmin(admin.ModelAdmin):
    list_display = ["habito", "fecha", "valor"]
    list_filter = ["fecha"]
