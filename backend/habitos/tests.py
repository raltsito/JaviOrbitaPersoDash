from django.test import TestCase
from django.utils import timezone
from rest_framework.test import APIClient

from usuarios.models import Perfil, Usuario

from .models import Habito, RegistroHabito


def crear_usuario(email, nombre):
    u = Usuario.objects.create_user(email=email, password="claveSegura123")
    Perfil.objects.create(usuario=u, nombre=nombre)
    return u


class RegistroHabitoTests(TestCase):
    def setUp(self):
        self.javier = crear_usuario("javier@example.com", "Javier")
        self.ana = crear_usuario("ana@example.com", "Ana")
        self.habito = Habito.objects.create(
            usuario=self.javier, nombre="Hidratación", tipo="cantidad", unidad="L",
            objetivo=2, paso=0.25, mejor_mas=True,
        )
        self.cj = APIClient()
        self.cj.force_authenticate(self.javier)
        self.ca = APIClient()
        self.ca.force_authenticate(self.ana)

    def test_upsert_por_fecha(self):
        hoy = timezone.localdate().isoformat()
        r1 = self.cj.post("/api/registros/", {"habito": self.habito.id, "fecha": hoy, "valor": 1.0}, format="json")
        self.assertEqual(r1.status_code, 201)
        r2 = self.cj.post("/api/registros/", {"habito": self.habito.id, "fecha": hoy, "valor": 1.5}, format="json")
        self.assertEqual(r2.status_code, 200)  # actualizó, no duplicó

        registros = RegistroHabito.objects.filter(habito=self.habito, fecha=hoy)
        self.assertEqual(registros.count(), 1)
        self.assertEqual(float(registros.first().valor), 1.5)

    def test_no_se_puede_registrar_en_habito_ajeno(self):
        hoy = timezone.localdate().isoformat()
        r = self.ca.post("/api/registros/", {"habito": self.habito.id, "fecha": hoy, "valor": 2}, format="json")
        self.assertEqual(r.status_code, 400)
        self.assertEqual(RegistroHabito.objects.count(), 0)

    def test_registros_aislados_en_listado(self):
        hoy = timezone.localdate().isoformat()
        self.cj.post("/api/registros/", {"habito": self.habito.id, "fecha": hoy, "valor": 2}, format="json")
        self.assertEqual(len(self.cj.get("/api/registros/").data), 1)
        self.assertEqual(len(self.ca.get("/api/registros/").data), 0)

    def test_habito_en_verde_en_resumen(self):
        hoy = timezone.localdate().isoformat()
        self.cj.post("/api/registros/", {"habito": self.habito.id, "fecha": hoy, "valor": 2}, format="json")
        r = self.cj.get("/api/resumen/hoy/")
        self.assertEqual(r.data["habitos"]["en_verde"], 1)
        self.assertEqual(r.data["habitos"]["total"], 1)
        self.assertEqual(r.data["racha"], 1)
