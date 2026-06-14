"""Router central de la API del dominio (todo bajo /api/)."""
from django.urls import path
from rest_framework.routers import DefaultRouter

from agenda.views import ActividadAgendaViewSet, AutocuidadoViewSet, BloqueSemanaViewSet
from conexiones.views import ConexionViewSet
from habitos.views import HabitoViewSet, RegistroHabitoViewSet
from objetivos.views import FraseMesView, ObjetivoViewSet
from usuarios.views import AccesoRapidoViewSet, PerfilView

from . import views

router = DefaultRouter()
router.register("actividades", ActividadAgendaViewSet)
router.register("bloques", BloqueSemanaViewSet)
router.register("autocuidado", AutocuidadoViewSet)
router.register("habitos", HabitoViewSet)
router.register("registros", RegistroHabitoViewSet)
router.register("objetivos", ObjetivoViewSet)
router.register("conexiones", ConexionViewSet)
router.register("accesos", AccesoRapidoViewSet)

urlpatterns = [
    path("perfil/", PerfilView.as_view()),
    path("frase/", FraseMesView.as_view()),
    path("resumen/hoy/", views.resumen_hoy),
    path("analisis/", views.analisis),
    path("restablecer/", views.restablecer),
] + router.urls
