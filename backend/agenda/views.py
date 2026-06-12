from core.mixins import PropietarioViewSet

from .models import ActividadAgenda, Autocuidado, BloqueSemana
from .serializers import ActividadAgendaSerializer, AutocuidadoSerializer, BloqueSemanaSerializer


class ActividadAgendaViewSet(PropietarioViewSet):
    """CRUD de actividades. Filtros: ?fecha=YYYY-MM-DD o ?desde=&hasta=."""

    queryset = ActividadAgenda.objects.all()
    serializer_class = ActividadAgendaSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        p = self.request.query_params
        if p.get("fecha"):
            qs = qs.filter(fecha=p["fecha"])
        if p.get("desde"):
            qs = qs.filter(fecha__gte=p["desde"])
        if p.get("hasta"):
            qs = qs.filter(fecha__lte=p["hasta"])
        return qs


class BloqueSemanaViewSet(PropietarioViewSet):
    queryset = BloqueSemana.objects.all()
    serializer_class = BloqueSemanaSerializer


class AutocuidadoViewSet(PropietarioViewSet):
    """CRUD de autocuidado. Filtro: ?fecha=YYYY-MM-DD."""

    queryset = Autocuidado.objects.all()
    serializer_class = AutocuidadoSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        if self.request.query_params.get("fecha"):
            qs = qs.filter(fecha=self.request.query_params["fecha"])
        return qs