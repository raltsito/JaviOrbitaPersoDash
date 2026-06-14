from datetime import timedelta

from django.utils import timezone
from rest_framework import serializers

from .models import Conexion


class ConexionSerializer(serializers.ModelSerializer):
    contactado_semana = serializers.SerializerMethodField()

    class Meta:
        model = Conexion
        fields = ["id", "nombre", "relacion", "notas", "ultimo_contacto", "contactado_semana"]

    def get_contactado_semana(self, obj):
        if not obj.ultimo_contacto:
            return False
        hoy = timezone.localdate()
        lunes = hoy - timedelta(days=hoy.weekday())
        return obj.ultimo_contacto >= lunes
