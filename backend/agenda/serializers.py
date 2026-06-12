from rest_framework import serializers

from .models import ActividadAgenda, Autocuidado, BloqueSemana


class ActividadAgendaSerializer(serializers.ModelSerializer):
    hora = serializers.TimeField(format="%H:%M")

    class Meta:
        model = ActividadAgenda
        fields = ["id", "fecha", "hora", "actividad", "done", "notas"]


class BloqueSemanaSerializer(serializers.ModelSerializer):
    class Meta:
        model = BloqueSemana
        fields = ["id", "dia", "texto", "orden"]


class AutocuidadoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Autocuidado
        fields = ["id", "fecha", "texto", "done"]
