from datetime import date, timedelta

from django.test import TestCase
from django.utils import timezone
from rest_framework.test import APIClient

from usuarios.models import Perfil, Usuario


def crear_usuario(email, nombre):
    u = Usuario.objects.create_user(email=email, password="claveSegura123")
    Perfil.objects.create(usuario=u, nombre=nombre)
    return u


class ActividadesTests(TestCase):
    def setUp(self):
        self.javier = crear_usuario("javier@example.com", "Javier")
        self.ana = crear_usuario("ana@example.com", "Ana")
        self.cj = APIClient()
        self.cj.force_authenticate(self.javier)
        self.ca = APIClient()
        self.ca.force_authenticate(self.ana)

    def crear_actividad(self, cliente, **extra):
        datos = {"fecha": "2026-06-12", "hora": "07:00", "actividad": "Meditación", "notas": ""}
        datos.update(extra)
        return cliente.post("/api/actividades/", datos, format="json")

    def test_crud_y_aislamiento(self):
        r = self.crear_actividad(self.cj)
        self.assertEqual(r.status_code, 201)
        actividad_id = r.data["id"]

        # Javier la ve, Ana no
        self.assertEqual(len(self.cj.get("/api/actividades/").data), 1)
        self.assertEqual(len(self.ca.get("/api/actividades/").data), 0)

        # Ana no puede leer ni editar la fila de Javier
        self.assertEqual(self.ca.get(f"/api/actividades/{actividad_id}/").status_code, 404)
        self.assertEqual(
            self.ca.patch(f"/api/actividades/{actividad_id}/", {"done": True}, format="json").status_code,
            404,
        )

        # Javier sí
        r = self.cj.patch(f"/api/actividades/{actividad_id}/", {"done": True}, format="json")
        self.assertEqual(r.status_code, 200)
        self.assertTrue(r.data["done"])

    def test_filtro_por_fecha_y_rango(self):
        self.crear_actividad(self.cj, fecha="2026-06-12")
        self.crear_actividad(self.cj, fecha="2026-06-14", actividad="Sprint review")
        self.crear_actividad(self.cj, fecha="2026-08-01", actividad="Plan futuro")

        self.assertEqual(len(self.cj.get("/api/actividades/?fecha=2026-06-12").data), 1)
        rango = self.cj.get("/api/actividades/?desde=2026-06-12&hasta=2026-06-30").data
        self.assertEqual(len(rango), 2)

    def test_planificacion_a_futuro(self):
        lejos = (timezone.localdate() + timedelta(days=60)).isoformat()
        r = self.crear_actividad(self.cj, fecha=lejos, actividad="Cita planificada")
        self.assertEqual(r.status_code, 201)
        self.assertEqual(len(self.cj.get(f"/api/actividades/?fecha={lejos}").data), 1)

    def test_resumen_hoy(self):
        hoy = timezone.localdate().isoformat()
        self.crear_actividad(self.cj, fecha=hoy)
        r2 = self.crear_actividad(self.cj, fecha=hoy, actividad="Lectura")
        self.cj.patch(f"/api/actividades/{r2.data['id']}/", {"done": True}, format="json")

        r = self.cj.get("/api/resumen/hoy/")
        self.assertEqual(r.status_code, 200)
        self.assertEqual(r.data["actividades"]["total"], 2)
        self.assertEqual(r.data["actividades"]["hechas"], 1)
        self.assertEqual(r.data["actividades"]["pct"], 50)
        self.assertEqual(r.data["racha"], 1)  # hoy cuenta: hay actividad hecha

    def test_analisis_estructura(self):
        hoy = timezone.localdate().isoformat()
        r2 = self.crear_actividad(self.cj, fecha=hoy)
        self.cj.patch(f"/api/actividades/{r2.data['id']}/", {"done": True}, format="json")

        r = self.cj.get("/api/analisis/")
        self.assertEqual(r.status_code, 200)
        self.assertEqual(len(r.data["dias"]), 7)
        self.assertEqual(len(r.data["actividades_7dias"]), 7)
        self.assertEqual(len(r.data["actividades_por_mes"]), 12)
        self.assertEqual(r.data["actividades_7dias"][-1]["pct"], 100)
