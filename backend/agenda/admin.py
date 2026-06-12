from django.contrib import admin

from .models import ActividadAgenda, Autocuidado, BloqueSemana


@admin.register(ActividadAgenda)
class ActividadAgendaAdmin(admin.ModelAdmin):
    list_display = ["fecha", "hora", "actividad", "done", "usuario"]
    list_filter = ["fecha", "done"]
    search_fields = ["actividad"]


@admin.register(BloqueSemana)
class BloqueSemanaAdmin(admin.ModelAdmin):
    list_display = ["dia", "texto", "orden", "usuario"]


@admin.register(Autocuidado)
class AutocuidadoAdmin(admin.ModelAdmin):
    list_display = ["fecha", "texto", "done", "usuario"]
