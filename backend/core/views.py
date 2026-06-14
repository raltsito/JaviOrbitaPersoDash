"""Endpoints agregados: resumen del día y series para Análisis."""
from datetime import timedelta

from django.utils import timezone
from rest_framework.decorators import api_view
from rest_framework.response import Response

from agenda.models import ActividadAgenda, Autocuidado
from habitos.models import Habito, RegistroHabito


def _fechas_con_actividad(usuario, desde, hasta):
    """Fechas (set) con al menos una actividad hecha o un registro de hábito."""
    actividades = ActividadAgenda.objects.filter(
        usuario=usuario, done=True, fecha__gte=desde, fecha__lte=hasta
    ).values_list("fecha", flat=True)
    registros = RegistroHabito.objects.filter(
        habito__usuario=usuario, fecha__gte=desde, fecha__lte=hasta
    ).values_list("fecha", flat=True)
    return set(actividades) | set(registros)


def calcular_racha(usuario):
    """Días consecutivos con actividad, contando hacia atrás. Si hoy aún
    no registra nada, la racha no se rompe: se cuenta desde ayer."""
    hoy = timezone.localdate()
    fechas = _fechas_con_actividad(usuario, hoy - timedelta(days=3650), hoy)
    dia = hoy if hoy in fechas else hoy - timedelta(days=1)
    racha = 0
    while dia in fechas:
        racha += 1
        dia -= timedelta(days=1)
    return racha


def _habito_en_verde(habito, valor):
    if habito.mejor_mas:
        return valor >= habito.objetivo
    return valor <= habito.objetivo


@api_view(["GET"])
def resumen_hoy(request):
    """KPIs de la vista Hoy: progreso del día, racha y hábitos en verde."""
    usuario = request.user
    hoy = timezone.localdate()

    acts = ActividadAgenda.objects.filter(usuario=usuario, fecha=hoy)
    total = acts.count()
    hechas = acts.filter(done=True).count()

    habitos = list(Habito.objects.filter(usuario=usuario, activo=True))
    valores = dict(
        RegistroHabito.objects.filter(habito__usuario=usuario, fecha=hoy)
        .values_list("habito_id", "valor")
    )
    en_verde = sum(1 for h in habitos if _habito_en_verde(h, valores.get(h.id, 0)))

    return Response({
        "fecha": hoy,
        "actividades": {
            "total": total,
            "hechas": hechas,
            "pct": round(hechas / total * 100) if total else 0,
        },
        "racha": calcular_racha(usuario),
        "habitos": {"en_verde": en_verde, "total": len(habitos)},
    })


@api_view(["GET"])
def analisis(request):
    """Series reales para las vistas Análisis y Hábitos."""
    usuario = request.user
    hoy = timezone.localdate()
    dias7 = [hoy - timedelta(days=i) for i in range(6, -1, -1)]

    # --- últimos 7 días: % de actividades completadas por día ---
    acts7 = ActividadAgenda.objects.filter(usuario=usuario, fecha__gte=dias7[0], fecha__lte=hoy)
    por_dia = {d: {"total": 0, "hechas": 0} for d in dias7}
    for a in acts7.values("fecha", "done"):
        por_dia[a["fecha"]]["total"] += 1
        if a["done"]:
            por_dia[a["fecha"]]["hechas"] += 1
    actividades_7dias = [
        {
            "fecha": d,
            "total": por_dia[d]["total"],
            "hechas": por_dia[d]["hechas"],
            "pct": round(por_dia[d]["hechas"] / por_dia[d]["total"] * 100) if por_dia[d]["total"] else 0,
        }
        for d in dias7
    ]

    # --- año en curso: conteo y % por mes ---
    acts_anio = ActividadAgenda.objects.filter(usuario=usuario, fecha__year=hoy.year)
    meses = [{"total": 0, "hechas": 0} for _ in range(12)]
    for a in acts_anio.values("fecha", "done"):
        m = meses[a["fecha"].month - 1]
        m["total"] += 1
        if a["done"]:
            m["hechas"] += 1
    actividades_por_mes = [m["hechas"] for m in meses]
    pct_mes = [round(m["hechas"] / m["total"] * 100) if m["total"] else 0 for m in meses]

    # --- historial 7 días por hábito (alineado a `dias`) ---
    habitos = list(Habito.objects.filter(usuario=usuario, activo=True))
    registros = RegistroHabito.objects.filter(
        habito__usuario=usuario, fecha__gte=dias7[0], fecha__lte=hoy
    ).values("habito_id", "fecha", "valor")
    mapa = {(r["habito_id"], r["fecha"]): float(r["valor"]) for r in registros}
    hist_habitos = {
        str(h.id): [mapa.get((h.id, d), 0) for d in dias7] for h in habitos
    }

    return Response({
        "dias": dias7,
        "actividades_7dias": actividades_7dias,
        "actividades_por_mes": actividades_por_mes,
        "pct_actividades_mes": pct_mes,
        "hist_habitos": hist_habitos,
    })


@api_view(["POST"])
def restablecer(request):
    """Borra el historial del usuario (agenda, registros de hábitos y
    autocuidado). No toca configuración: hábitos, objetivos, bloques,
    conexiones, accesos rápidos, perfil ni frase del mes."""
    usuario = request.user
    actividades, _ = ActividadAgenda.objects.filter(usuario=usuario).delete()
    registros, _ = RegistroHabito.objects.filter(habito__usuario=usuario).delete()
    autocuidados, _ = Autocuidado.objects.filter(usuario=usuario).delete()
    return Response({"actividades": actividades, "registros": registros, "autocuidados": autocuidados})
