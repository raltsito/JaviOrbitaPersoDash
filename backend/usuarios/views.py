from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.middleware.csrf import get_token
from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from core.mixins import PropietarioViewSet

from .models import AccesoRapido
from .serializers import (
    AccesoRapidoSerializer,
    PerfilSerializer,
    RegistroSerializer,
    UsuarioSerializer,
)


def csrf(request):
    """Entrega la cookie csrftoken; el frontend la manda en X-CSRFToken."""
    return JsonResponse({"csrfToken": get_token(request)})


@api_view(["POST"])
@permission_classes([AllowAny])
def registro(request):
    serializer = RegistroSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    usuario = serializer.save()
    login(request, usuario)
    return Response(UsuarioSerializer(usuario).data, status=status.HTTP_201_CREATED)


@api_view(["POST"])
@permission_classes([AllowAny])
def login_view(request):
    email = (request.data.get("email") or "").lower()
    password = request.data.get("password") or ""
    usuario = authenticate(request, username=email, password=password)
    if usuario is None:
        return Response(
            {"detail": "Email o contraseña incorrectos."},
            status=status.HTTP_400_BAD_REQUEST,
        )
    login(request, usuario)
    return Response(UsuarioSerializer(usuario).data)


@api_view(["POST"])
def logout_view(request):
    logout(request)
    return Response({"detail": "Sesión cerrada."})


@api_view(["GET"])
def me(request):
    return Response(UsuarioSerializer(request.user).data)


class PerfilView(generics.RetrieveUpdateAPIView):
    """GET/PATCH de las preferencias del usuario autenticado."""

    serializer_class = PerfilSerializer

    def get_object(self):
        return self.request.user.perfil


class AccesoRapidoViewSet(PropietarioViewSet):
    queryset = AccesoRapido.objects.all()
    serializer_class = AccesoRapidoSerializer
