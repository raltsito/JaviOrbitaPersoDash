from rest_framework import serializers

from .models import FraseMes, Objetivo


class ObjetivoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Objetivo
        fields = ["id", "titulo", "periodo", "categoria", "progreso", "activo"]

    def validate_progreso(self, value):
        return max(0, min(100, value))


class FraseMesSerializer(serializers.ModelSerializer):
    class Meta:
        model = FraseMes
        fields = ["texto", "autor"]
