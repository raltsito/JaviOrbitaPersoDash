from rest_framework import serializers

from .models import Conexion


class ConexionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Conexion
        fields = ["id", "nombre", "relacion", "notas", "ultimo_contacto", "contactado_semana"]
