from django.conf import settings
from django.db import models


class ActividadAgenda(models.Model):
    """Una fila de la agenda. Cada día tiene sus propias actividades;
    se puede crear en cualquier fecha (planificación a futuro)."""

    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="actividades")
    fecha = models.DateField(db_index=True)
    hora = models.TimeField()
    actividad = models.CharField(max_length=200)
    done = models.BooleanField(default=False)
    notas = models.CharField(max_length=300, blank=True, default="")

    class Meta:
        ordering = ["fecha", "hora", "id"]
        verbose_name_plural = "Actividades de agenda"

    def __str__(self):
        return f"{self.fecha} {self.hora:%H:%M} — {self.actividad}"


class BloqueSemana(models.Model):
    """Plan semanal recurrente: bloques de texto por día de la semana (0=lunes)."""

    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="bloques_semana")
    dia = models.PositiveSmallIntegerField(choices=[(i, d) for i, d in enumerate(["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"])])
    texto = models.CharField(max_length=120)
    orden = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ["dia", "orden", "id"]
        verbose_name_plural = "Bloques de semana"

    def __str__(self):
        return f"{self.get_dia_display()}: {self.texto}"


class Autocuidado(models.Model):
    """Actividad libre de autocuidado registrada en el tracker, por fecha."""

    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="autocuidados")
    fecha = models.DateField(db_index=True)
    texto = models.CharField(max_length=200, blank=True, default="")
    done = models.BooleanField(default=False)

    class Meta:
        ordering = ["fecha", "id"]
        verbose_name_plural = "Autocuidados"

    def __str__(self):
        return f"{self.fecha} — {self.texto}"
