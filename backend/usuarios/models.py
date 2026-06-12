from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models


class UsuarioManager(BaseUserManager):
    """Manager para login por email (sin username)."""

    use_in_migrations = True

    def _create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError("El email es obligatorio")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", False)
        extra_fields.setdefault("is_superuser", False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self._create_user(email, password, **extra_fields)


class Usuario(AbstractUser):
    username = None
    email = models.EmailField("email", unique=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = UsuarioManager()

    def __str__(self):
        return self.email


class Perfil(models.Model):
    TEMAS = [("claro", "Claro"), ("oscuro", "Oscuro")]
    DENSIDADES = [("compact", "Compacta"), ("regular", "Regular"), ("comfy", "Cómoda")]
    VISTAS_AGENDA = [("dia", "Día"), ("semana", "Semana"), ("mes", "Mes"), ("año", "Año")]

    usuario = models.OneToOneField(Usuario, on_delete=models.CASCADE, related_name="perfil")
    nombre = models.CharField(max_length=80)
    tema = models.CharField(max_length=10, choices=TEMAS, default="claro")
    acento = models.CharField(max_length=9, default="#7c5cfc")
    densidad = models.CharField(max_length=10, choices=DENSIDADES, default="regular")
    tema_espacial = models.BooleanField(default=False)
    vista_agenda = models.CharField(max_length=10, choices=VISTAS_AGENDA, default="dia")

    def __str__(self):
        return f"Perfil de {self.nombre}"


class AccesoRapido(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name="accesos")
    nombre = models.CharField(max_length=40)
    url = models.URLField()
    icono = models.CharField(max_length=30, default="spark")
    color = models.CharField(max_length=9, default="#7c5cfc")
    orden = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ["orden", "id"]
        verbose_name_plural = "Accesos rápidos"

    def __str__(self):
        return self.nombre
