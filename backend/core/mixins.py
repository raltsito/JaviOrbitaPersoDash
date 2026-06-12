from rest_framework import viewsets


class PropietarioViewSet(viewsets.ModelViewSet):
    """ViewSet base: cada usuario solo ve y escribe sus propias filas."""

    def get_queryset(self):
        return super().get_queryset().filter(usuario=self.request.user)

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)
