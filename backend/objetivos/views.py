from rest_framework import generics

from core.mixins import PropietarioViewSet

from .models import FraseMes, Objetivo
from .serializers import FraseMesSerializer, ObjetivoSerializer


class ObjetivoViewSet(PropietarioViewSet):
    """CRUD de objetivos. Filtros: ?periodo=, ?categoria=, ?activo=true."""

    queryset = Objetivo.objects.all()
    serializer_class = ObjetivoSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        p = self.request.query_params
        if p.get("periodo"):
            qs = qs.filter(periodo=p["periodo"])
        if p.get("categoria"):
            qs = qs.filter(categoria=p["categoria"])
        if p.get("activo") in ("true", "1"):
            qs = qs.filter(activo=True)
        return qs


class FraseMesView(generics.RetrieveUpdateAPIView):
    """GET/PATCH de la frase del mes del usuario (una por usuario)."""

    serializer_class = FraseMesSerializer

    def get_object(self):
        frase, _ = FraseMes.objects.get_or_create(
            usuario=self.request.user,
            defaults={"texto": "", "autor": ""},
        )
        return frase
