"""Datos iniciales que recibe cada cuenta nueva.

Equivalente mínimo del SEED del prototipo (Javier/data.js): hábitos por
defecto, frase del mes y accesos rápidos. La agenda, objetivos y
conexiones empiezan vacíos — los llena el usuario.
"""
from habitos.models import Habito
from objetivos.models import FraseMes

from .models import AccesoRapido

HABITOS_DEFAULT = [
    {"nombre": "Hidratación", "tipo": "cantidad", "unidad": "L", "objetivo": 2, "paso": 0.25, "mejor_mas": True, "color": "blue", "icono": "drop"},
    {"nombre": "Estiramiento", "tipo": "sino", "objetivo": 1, "paso": 1, "mejor_mas": True, "color": "mint", "icono": "stretch"},
    {"nombre": "Tabaco", "tipo": "cantidad", "unidad": "cig", "objetivo": 20, "paso": 1, "mejor_mas": False, "color": "red", "icono": "smoke"},
    {"nombre": "Actividad física", "tipo": "cantidad", "unidad": "min", "objetivo": 20, "paso": 5, "mejor_mas": True, "color": "green", "icono": "run"},
    {"nombre": "Mindfulness", "tipo": "cantidad", "unidad": "min", "objetivo": 20, "paso": 5, "mejor_mas": True, "color": "violet", "icono": "lotus"},
    {"nombre": "Alimentación", "tipo": "sino", "objetivo": 1, "paso": 1, "mejor_mas": True, "color": "amber", "icono": "apple"},
]

ACCESOS_DEFAULT = [
    {"nombre": "Claude", "icono": "ai", "color": "#7c5cfc", "url": "https://claude.ai"},
    {"nombre": "ChatGPT", "icono": "spark", "color": "#10a37f", "url": "https://chatgpt.com"},
    {"nombre": "Música", "icono": "music", "color": "#1db954", "url": "https://open.spotify.com"},
    {"nombre": "YouTube", "icono": "play", "color": "#ff3b30", "url": "https://youtube.com"},
    {"nombre": "Canva", "icono": "design", "color": "#60a5fa", "url": "https://canva.com"},
]

FRASE_DEFAULT = {
    "texto": "La disciplina es elegir entre lo que quieres ahora y lo que quieres más.",
    "autor": "Augusta F. Kantra",
}


def crear_datos_iniciales(usuario):
    Habito.objects.bulk_create(
        Habito(usuario=usuario, orden=i, **h) for i, h in enumerate(HABITOS_DEFAULT)
    )
    AccesoRapido.objects.bulk_create(
        AccesoRapido(usuario=usuario, orden=i, **a) for i, a in enumerate(ACCESOS_DEFAULT)
    )
    FraseMes.objects.create(usuario=usuario, **FRASE_DEFAULT)
