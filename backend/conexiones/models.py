from django.conf import settings
from django.db import models


class Conexion(models.Model):
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="conexiones")
    nombre = models.CharField(max_length=80, blank=True, default="")
    relacion = models.CharField(max_length=60, blank=True, default="")
    notas = models.CharField(max_length=300, blank=True, default="")
    ultimo_contacto = models.DateField(null=True, blank=True)
    # Marcado manualmente; se reinicia cada lunes (Sprint 4)
    contactado_semana = models.BooleanField(default=False)

    class Meta:
        ordering = ["id"]
        verbose_name_plural = "Conexiones"

    def __str__(self):
        return self.nombre or "(sin nombre)"
