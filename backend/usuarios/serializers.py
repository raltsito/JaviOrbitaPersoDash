from django.contrib.auth.password_validation import validate_password
from django.db import transaction
from rest_framework import serializers

from .models import AccesoRapido, Perfil, Usuario
from .seed import crear_datos_iniciales


class PerfilSerializer(serializers.ModelSerializer):
    class Meta:
        model = Perfil
        fields = ["nombre", "tema", "acento", "densidad", "tema_espacial", "vista_agenda"]


class AccesoRapidoSerializer(serializers.ModelSerializer):
    class Meta:
        model = AccesoRapido
        fields = ["id", "nombre", "url", "icono", "color", "orden"]


class UsuarioSerializer(serializers.ModelSerializer):
    perfil = PerfilSerializer(read_only=True)

    class Meta:
        model = Usuario
        fields = ["id", "email", "perfil"]


class RegistroSerializer(serializers.Serializer):
    nombre = serializers.CharField(max_length=80)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate_email(self, value):
        if Usuario.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("Ya existe una cuenta con este email.")
        return value.lower()

    def validate_password(self, value):
        validate_password(value)
        return value

    @transaction.atomic
    def create(self, validated_data):
        usuario = Usuario.objects.create_user(
            email=validated_data["email"], password=validated_data["password"]
        )
        Perfil.objects.create(usuario=usuario, nombre=validated_data["nombre"].strip())
        crear_datos_iniciales(usuario)
        return usuario
