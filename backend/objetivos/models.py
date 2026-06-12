from django.conf import settings
from django.db import models


class Objetivo(models.Model):
    PERIODOS = [("diario", "Diario"), ("semanal", "Semanal"), ("mes", "Mes"), ("año", "Año")]
    CATEGORIAS = [("cuerpo", "Cuerpo"), ("mente", "Mente"), ("trabajo", "Trabajo"), ("social", "Social")]

    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="objetivos")
    titulo = models.CharField(max_length=150)
    periodo = models.CharField(max_length=10, choices=PERIODOS, default="diario")
    categoria = models.CharField(max_length=10, choices=CATEGORIAS, default="mente")
    progreso = models.PositiveSmallIntegerField(default=0)  # 0–100
    activo = models.BooleanField(default=True)

    class Meta:
        ordering = ["id"]

    def __str__(self):
        return f"{self.titulo} ({self.periodo})"


class FraseMes(models.Model):
    usuario = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="frase")
    texto = models.CharField(max_length=300)
    autor = models.CharField(max_length=80, blank=True, default="")

    class Meta:
        verbose_name_plural = "Frases del mes"

    def __str__(self):
        return self.texto[:40]
