from django.test import TestCase
from rest_framework.test import APIClient

from habitos.models import Habito
from objetivos.models import FraseMes

from .models import AccesoRapido, Usuario


class RegistroTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def registrar(self, nombre, email):
        return self.client.post(
            "/api/auth/registro/",
            {"nombre": nombre, "email": email, "password": "claveSegura123"},
            format="json",
        )

    def test_registro_crea_perfil_y_seed(self):
        r = self.registrar("Javier", "javier@example.com")
        self.assertEqual(r.status_code, 201)
        self.assertEqual(r.data["perfil"]["nombre"], "Javier")

        usuario = Usuario.objects.get(email="javier@example.com")
        self.assertEqual(usuario.habitos.count(), 6)
        self.assertEqual(usuario.accesos.count(), 5)
        self.assertTrue(FraseMes.objects.filter(usuario=usuario).exists())

    def test_registro_inicia_sesion_y_me_responde(self):
        self.registrar("Javier", "javier@example.com")
        r = self.client.get("/api/auth/me/")
        self.assertEqual(r.status_code, 200)
        self.assertEqual(r.data["email"], "javier@example.com")

    def test_email_duplicado_rechazado(self):
        self.registrar("Javier", "javier@example.com")
        r = self.registrar("Otro", "javier@example.com")
        self.assertEqual(r.status_code, 400)

    def test_datos_aislados_entre_usuarios(self):
        self.registrar("Javier", "javier@example.com")
        u1 = Usuario.objects.get(email="javier@example.com")

        otro = APIClient()
        otro.post(
            "/api/auth/registro/",
            {"nombre": "Ana", "email": "ana@example.com", "password": "claveSegura123"},
            format="json",
        )
        u2 = Usuario.objects.get(email="ana@example.com")

        # cada usuario tiene su propio seed, sin compartir filas
        self.assertEqual(Habito.objects.filter(usuario=u1).count(), 6)
        self.assertEqual(Habito.objects.filter(usuario=u2).count(), 6)
        self.assertEqual(AccesoRapido.objects.filter(usuario=u1).count(), 5)
        self.assertFalse(Habito.objects.filter(usuario=u1, id__in=u2.habitos.values("id")).exists())

    def test_login_y_logout(self):
        self.registrar("Javier", "javier@example.com")
        self.client.post("/api/auth/logout/")
        r = self.client.get("/api/auth/me/")
        self.assertEqual(r.status_code, 403)

        r = self.client.post(
            "/api/auth/login/",
            {"email": "JAVIER@example.com", "password": "claveSegura123"},
            format="json",
        )
        self.assertEqual(r.status_code, 200)
        self.assertEqual(r.data["perfil"]["nombre"], "Javier")

    def test_login_credenciales_invalidas(self):
        self.registrar("Javier", "javier@example.com")
        self.client.post("/api/auth/logout/")
        r = self.client.post(
            "/api/auth/login/",
            {"email": "javier@example.com", "password": "incorrecta"},
            format="json",
        )
        self.assertEqual(r.status_code, 400)
