from rest_framework import status, viewsets
from rest_framework.response import Response

from core.mixins import PropietarioViewSet

from .models import Habito, RegistroHabito
from .serializers import HabitoSerializer, RegistroHabitoSerializer


class HabitoViewSet(PropietarioViewSet):
    """CRUD de hábitos. Filtro: ?activo=true."""

    queryset = Habito.objects.all()
    serializer_class = HabitoSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        if self.request.query_params.get("activo") in ("true", "1"):
            qs = qs.filter(activo=True)
        return qs


class RegistroHabitoViewSet(viewsets.ModelViewSet):
    """Registros por fecha. POST hace upsert sobre (hábito, fecha).
    Filtros: ?fecha=, ?desde=, ?hasta=, ?habito=."""

    queryset = RegistroHabito.objects.all()
    serializer_class = RegistroHabitoSerializer

    def get_queryset(self):
        qs = super().get_queryset().filter(habito__usuario=self.request.user)
        p = self.request.query_params
        if p.get("fecha"):
            qs = qs.filter(fecha=p["fecha"])
        if p.get("desde"):
            qs = qs.filter(fecha__gte=p["desde"])
        if p.get("hasta"):
            qs = qs.filter(fecha__lte=p["hasta"])
        if p.get("habito"):
            qs = qs.filter(habito_id=p["habito"])
        return qs

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        datos = serializer.validated_data
        registro, creado = RegistroHabito.objects.update_or_create(
            habito=datos["habito"], fecha=datos["fecha"], defaults={"valor": datos["valor"]}
        )
        out = self.get_serializer(registro)
        return Response(out.data, status=status.HTTP_201_CREATED if creado else status.HTTP_200_OK)
