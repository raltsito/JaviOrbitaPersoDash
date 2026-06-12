from django.conf import settings
from django.db import models


class Habito(models.Model):
    """Configuración de un hábito a trackear. El valor de cada día
    vive en RegistroHabito; el tracker arranca en cero cada mañana."""

    TIPOS = [("sino", "Sí / No"), ("cantidad", "Cantidad")]

    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="habitos")
    nombre = models.CharField(max_length=60)
    tipo = models.CharField(max_length=10, choices=TIPOS, default="cantidad")
    unidad = models.CharField(max_length=15, blank=True, default="")
    objetivo = models.DecimalField(max_digits=7, decimal_places=2, default=1)
    paso = models.DecimalField(max_digits=6, decimal_places=2, default=1)
    # True: alcanzar el objetivo es bueno (agua). False: no pasarse del máximo (tabaco).
    mejor_mas = models.BooleanField(default=True)
    color = models.CharField(max_length=15, default="violet")
    icono = models.CharField(max_length=30, default="spark")
    activo = models.BooleanField(default=True)
    orden = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ["orden", "id"]
        verbose_name_plural = "Hábitos"

    def __str__(self):
        return self.nombre


class RegistroHabito(models.Model):
    """Valor registrado de un hábito en una fecha. Único por (hábito, fecha)."""

    habito = models.ForeignKey(Habito, on_delete=models.CASCADE, related_name="registros")
    fecha = models.DateField(db_index=True)
    valor = models.DecimalField(max_digits=7, decimal_places=2, default=0)

    class Meta:
        ordering = ["fecha"]
        constraints = [models.UniqueConstraint(fields=["habito", "fecha"], name="registro_unico_por_dia")]
        verbose_name_plural = "Registros de hábito"

    def __str__(self):
        return f"{self.habito.nombre} {self.fecha}: {self.valor}"
