from rest_framework import serializers

from .models import Habito, RegistroHabito


class HabitoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Habito
        fields = ["id", "nombre", "tipo", "unidad", "objetivo", "paso", "mejor_mas", "color", "icono", "activo", "orden"]


class RegistroHabitoSerializer(serializers.ModelSerializer):
    class Meta:
        model = RegistroHabito
        fields = ["id", "habito", "fecha", "valor"]
        # sin validador de unicidad: el POST hace upsert sobre (habito, fecha)
        validators = []

    def validate_habito(self, value):
        if value.usuario_id != self.context["request"].user.id:
            raise serializers.ValidationError("Hábito inválido.")
        return value
