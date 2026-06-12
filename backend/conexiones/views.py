from core.mixins import PropietarioViewSet

from .models import Conexion
from .serializers import ConexionSerializer


class ConexionViewSet(PropietarioViewSet):
    queryset = Conexion.objects.all()
    serializer_class = ConexionSerializer
