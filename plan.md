# Órbita — Dashboard personal de Javier

Plan de desarrollo por sprints. El prototipo de referencia (diseño y comportamiento aprobado) vive en `Javier/` y es la fuente de verdad visual: shell con sidebar (`app.jsx`), componentes base (`components.jsx`), y las vistas Hoy, Análisis, Hábitos, Conexiones, Objetivos y Ajustes.

> **Estado (2026-06-13):** Sprints 0-5 completados. **Sprint 6 en curso** — código de deploy listo y verificado en local; proyecto Railway "Orbita" creado; falta provisionar Postgres, desplegar el servicio web (`railway up`) y configurar dominio/variables de entorno. Ver detalle al final de la sección Sprint 6.

## Decisiones de arquitectura

| Tema | Decisión |
|---|---|
| Backend | Django + Django REST Framework |
| Base de datos | PostgreSQL (Railway) |
| Autenticación | Multiusuario — registro + login, cada usuario ve solo sus datos |
| Historial | Registro por fecha: agenda y hábitos se guardan por día; las gráficas y la racha se calculan de datos reales |
| Frontend | React + Vite (migración del prototipo), CSS existente del prototipo |
| Deploy | Railway: servicio web (Django sirve la SPA compilada con WhiteNoise) + PostgreSQL |

## Modelo de datos (borrador)

- **User** — modelo de Django (email como login).
- **Perfil** — usuario, nombre a mostrar, tema, color de acento, densidad, vista de agenda preferida.
- **ActividadAgenda** — usuario, fecha, hora, actividad, done, notas. La vista "Hoy" lee/escribe la fecha actual, pero se puede crear/editar en **cualquier fecha futura** (planificación adelantada); semana/mes/año agregan sobre este historial.
- **BloqueSemana** — usuario, día de la semana (0–6), texto del bloque (plan semanal recurrente).
- **Objetivo** — usuario, título, periodo (diario/semanal/mes/año), categoría (cuerpo/mente/trabajo/social), progreso 0–100, activo.
- **Habito** — usuario, nombre, tipo (sí-no / cantidad), unidad, objetivo, paso, mejorMas, color, icono, activo.
- **RegistroHabito** — hábito, fecha, valor. Único por (hábito, fecha).
- **Autocuidado** — usuario, fecha, texto, done.
- **Conexion** — usuario, nombre, relación, notas, último contacto (fecha), contactado esta semana.
- **FraseMes** — usuario, texto, autor.
- **AccesoRapido** — usuario, nombre, URL, icono, color, orden. Editable desde un modal (ver Sprint 5).

Racha: días consecutivos (hasta hoy) con al menos un registro de actividad/hábito completado — calculada en el backend, no almacenada a mano.

---

## Sprint 0 — Inicialización del proyecto ✔ COMPLETADO 2026-06-12

**Objetivo:** repositorio estructurado y entornos corriendo en local.

- [x] ~~Estructura del repo: `backend/` (Django) y `frontend/` (Vite + React).~~
- [x] ~~Proyecto Django con apps: `usuarios`, `agenda`, `habitos`, `objetivos`, `conexiones`.~~
- [x] ~~Configuración por variables de entorno (`DATABASE_URL`, `SECRET_KEY`, `DEBUG`, `ALLOWED_HOSTS`) con `.env.example`.~~
- [x] ~~PostgreSQL local conectado (BD `orbita_javier`, PostgreSQL 18 en :5432); primera migración aplicada.~~
- [x] ~~Proyecto Vite + React creado; CSS y assets del prototipo extraídos a `frontend/src/styles/orbita.css` y `frontend/src/assets/`.~~
- [x] ~~CORS y proxy de desarrollo (Vite :5173 → Django :8001) funcionando — Django corre en **8001** porque el 8000 lo ocupa otro proyecto local. Endpoint `/api/health/` verificado directo y vía proxy.~~

**Entregable:** `npm run dev` + `runserver 8001` levantan ambos lados sin errores. Ver README.md.

## Sprint 1 — Autenticación y usuarios ✔ COMPLETADO 2026-06-12

**Objetivo:** registro, login y datos aislados por usuario.

- [x] ~~Usuario custom con **email como login** (`usuarios.Usuario`, sin username) — definido antes de tener datos para no migrar después.~~
- [x] ~~**Todos los modelos del dominio creados y migrados** (se adelantó del borrador: Perfil, AccesoRapido, ActividadAgenda, BloqueSemana, Autocuidado, Habito, RegistroHabito, Objetivo, FraseMes, Conexion). El Sprint 2 solo añade serializers/viewsets.~~
- [x] ~~Endpoints `/api/auth/`: csrf, registro, login, logout, me. **Sesión con cookies** (SessionAuthentication de DRF + X-CSRFToken) — mismo dominio en producción, sin JWT.~~
- [x] ~~Al registrarse se crean datos iniciales: 6 hábitos del prototipo, frase del mes y 5 accesos rápidos (`usuarios/seed.py`). Agenda, objetivos y conexiones empiezan vacíos.~~
- [x] ~~Frontend: pantalla login/registro con estética del prototipo (`src/auth/AuthScreen.jsx`), cliente API con CSRF (`src/api.js`), guard de sesión y saludo con el nombre del perfil; tema del perfil aplicado.~~
- [x] ~~Admin de Django registrado para todos los modelos.~~
- [x] ~~6 tests de auth/seed/aislamiento en verde + verificación manual: usuarios `javier@test.com` y `ana@test.com` registrados vía proxy, cada uno con su propio seed.~~

**Entregable:** dos usuarios de prueba registrados, cada uno con sus datos separados. ✔

## Sprint 2 — API del dominio ✔ COMPLETADO 2026-06-12

**Objetivo:** CRUD completo de todas las entidades, filtrado por usuario autenticado.

- [x] ~~Serializers + ViewSets para todas las entidades, con router central en `core/api_urls.py` (URLs planas: `/api/actividades/`, `/api/habitos/`, `/api/registros/`, etc.).~~
- [x] ~~`PropietarioViewSet` (`core/mixins.py`): todo queryset filtra por `request.user` y todo create asigna el usuario.~~
- [x] ~~RegistroHabito: POST con **upsert** sobre (hábito, fecha); valida que el hábito sea del usuario.~~
- [x] ~~`/api/resumen/hoy/`: % del día, **racha calculada** (días consecutivos con actividad hecha o registro de hábito; hoy sin registrar no rompe la racha), hábitos en verde.~~
- [x] ~~`/api/analisis/`: actividades 7 días (%), conteo y % por mes del año en curso, historial 7 días por hábito alineado a `dias`.~~
- [x] ~~9 tests nuevos (aislamiento CRUD, filtros por fecha/rango, planificación a futuro, upsert, hábito ajeno rechazado, resumen, análisis) — 15/15 en verde.~~
- [x] ~~Verificación manual vía proxy con sesión real: actividad de hoy y a +60 días, upsert de registro, resumen y análisis con datos reales.~~
- [x] ~~Endpoints documentados en README.md. (Admin ya registrado en Sprint 1.)~~

**Entregable:** API navegable en DRF con datos de prueba; colección de endpoints documentada en el README. ✔

## Sprint 3 — Migración del frontend a Vite ✔ COMPLETADO 2026-06-13

**Objetivo:** el prototipo completo corriendo como SPA real, todavía contra la API.

- [x] ~~Migrar `components.jsx` (Card, Icon, Check, Ring, BarChart, LineChart, tone…) a componentes con imports.~~
- [x] ~~Migrar el shell de `app.jsx`: sidebar colapsable, topbar, tema claro/oscuro, navegación (estado de ruta + `window.__nav` para enlaces cruzados).~~
- [x] ~~Migrar las 6 vistas (`views_*.jsx`) manteniendo el diseño tal cual, **excepto Objetivos**, que se rediseña (ver abajo). La vista Hoy quedó compuesta en 8 subcomponentes (`src/views/hoy/`) que consumen su propio slice de la API.~~
- [x] ~~**Rediseño de "Objetivos":** se elimina el mapa orbital SVG y se reemplaza por un grid de 4 tarjetas por categoría (Cuerpo, Mente, Trabajo, Social), cada una con anillo de progreso medio (`Ring`) y la lista de sus objetivos con barras de progreso. Filtros por periodo (Todas/Diario/Semanal/Mes/Año) arriba.~~
- [x] ~~Capa de API (`src/api.js`): cliente fetch con manejo de sesión/CSRF y errores, con endpoints para todas las entidades del dominio.~~
- [x] ~~Estado global: `ORB.load/save` (localStorage) reemplazado por datos del backend; localStorage queda solo para preferencias de UI (sidebar colapsado).~~
- [x] ~~El panel de Tweaks (acento, densidad, tema espacial) pasa a la vista Ajustes y persiste en `Perfil` vía `/api/perfil/`.~~
- [x] ~~Se eliminaron dos elementos del prototipo sin equivalente real: el segmentado "Objetivo diario/semanal" decorativo de Hoy y el botón "Compartir como imagen" (decisión de producto #3).~~
- [x] ~~Verificación end-to-end: `vite build` y `eslint .` en verde; servidores Vite (:5173) y Django (:8001) levantados y probados contra la API real (perfil, hábitos, objetivos, frase, conexiones, análisis, resumen, actividades, registros, accesos) con un usuario de prueba.~~

**Entregable:** la app completa funciona contra la API en local; localStorage ya no guarda datos de negocio. ✔

## Sprint 4 — Lógica diaria e historial ✔ COMPLETADO 2026-06-13

**Objetivo:** el comportamiento "por fecha" funcionando de punta a punta.

- [x] ~~Vista Hoy: al entrar, carga la agenda de la fecha actual; cada día empieza vacío y el usuario escribe sus actividades (sin copiar el día anterior).~~ (ya implementado en Sprint 3, vía `AgendaDia` + `/api/actividades/?fecha=`)
- [x] ~~**Planificación a futuro:** selector de fecha en la agenda para navegar a cualquier día (futuro o pasado) y agregar/editar actividades — p. ej. hoy puedo anotar algo para el sábado o para dentro de dos meses. Desde el calendario del mes, clic en un día abre su agenda.~~ (ya implementado en Sprint 3, `AgendaMes` con `onSelectDay`)
- [x] ~~Tracker de hábitos escribe `RegistroHabito` de hoy; los steppers y botones sí/no hacen upsert. Cada día el tracker arranca en cero (los valores anteriores quedan en el historial). El tracker solo registra el día actual (no fechas futuras).~~ (ya implementado en Sprint 3, `HabitTracker`)
- [x] ~~Vista semana: combina `BloqueSemana` (plan recurrente) con lo real registrado y lo ya planificado a futuro.~~ — **nuevo en Sprint 4:** `AgendaSemana` ahora combina `bloques.list()` con `actividades.list({desde, hasta})` de la semana (lunes-domingo vía `inicioSemana`), muestra hora + estado `done` de cada actividad, y cada día es clicable (`onSelectDay`) para abrir su agenda diaria.
- [x] ~~Vista mes: calendario con conteo real de actividades por día (reemplaza el `busy` hardcodeado), incluyendo las planificadas a futuro; cada día es clicable para abrir su agenda.~~ (ya implementado en Sprint 3, `AgendaMes`)
- [x] ~~Vista año: actividades reales por mes.~~ (ya implementado en Sprint 3, `AgendaAno` + `/api/analisis/`)
- [x] ~~Racha calculada por el backend y mostrada en sidebar/KPIs.~~ (ya implementado en Sprint 2/3, `calcular_racha` + `Shell.jsx`)
- [x] ~~Vistas Análisis y Hábitos consumen las series reales del Sprint 2 (semáforo verde/ámbar/rojo sobre los últimos 7 días reales).~~ (ya implementado en Sprint 3)
- [x] ~~Conexiones: "último contacto" pasa a ser fecha real; el check semanal se reinicia cada lunes.~~ — **nuevo en Sprint 4:** se elimina el campo almacenado `contactado_semana` (migración `0003`); el serializer lo calcula con `SerializerMethodField` (`ultimo_contacto >= lunes de esta semana`), y el toggle del frontend hace PATCH de `ultimo_contacto` (hoy o `null`).
- [x] ~~Verificación end-to-end: `vite build` y `eslint .` en verde; migración aplicada; agenda semanal (bloques + actividades reales/futuras) y cómputo de `contactado_semana` (hoy, reseteo, semana pasada) probados contra la API real con un usuario de prueba.~~

**Entregable:** usar la app varios días seguidos genera historial visible en Análisis y Hábitos. ✔

## Sprint 5 — Ajustes, pulido y extras del prototipo ✔ COMPLETADO 2026-06-13

**Objetivo:** paridad total con el prototipo + detalles pendientes.

- [x] ~~Vista Ajustes completa: tema, edición de objetivos y hábitos (incluye crear/desactivar hábitos), frase del mes, y "restablecer datos" adaptado (borra historial del usuario con confirmación).~~ Nuevo endpoint `/api/restablecer/` (borra `ActividadAgenda`, `RegistroHabito` y `Autocuidado` del usuario; preserva hábitos, objetivos, bloques, conexiones, accesos, perfil y frase) + card "Datos" en Ajustes con confirmación.
- [x] ~~Accesos rápidos editables (hoy hardcodeados en `LAUNCHERS`): CRUD por usuario con modal de personalización — selector de icono (set de iconos del prototipo), nombre y URL.~~ `hoy/Accesos.jsx` con modal (`Modal.jsx`), `icon-picker` de 16 iconos y color picker; CRUD completo contra `/api/accesos/`.
- [x] ~~Quitar el botón "Compartir como imagen" de la agenda (decisión confirmada). Imprimir agenda se mantiene (`window.print` con estilos de impresión).~~ (ya satisfecho en Sprint 3)
- [x] ~~Estados vacíos, loaders y manejo de errores de red en todas las vistas.~~ Componente `ErrorMsg` (con botón "Reintentar") + clase `.empty.error`, aplicado a las 6 vistas principales y a los 8 subcomponentes de Hoy/agenda.
- [x] ~~Responsive: revisar móvil (sidebar overlay ya existe en el prototipo) en las 6 vistas, en especial las tarjetas de Objetivos y la tabla de agenda.~~ Grids a 1 columna en `@max-width:880px` (2 columnas para KPIs de Análisis en `@max-width:600px`); tablas/grids de agenda envueltas en `.agenda-scroll` con scroll horizontal.
- [x] ~~Verificación end-to-end: `vite build` y `eslint .` en verde; servidores Vite (:5173) y Django (:8001) levantados y probados contra la API real (CRUD de accesos, crear/desactivar hábito, editar frase del mes, `/api/restablecer/` con datos reales) con un usuario de prueba.~~

**Entregable:** demo completa lista para revisión de Javier. ✔

## Sprint 6 — Deploy en Railway y cierre

**Objetivo:** producción estable en Railway.

- [x] ~~Build del frontend integrado al deploy: `vite build` → estáticos servidos por Django con WhiteNoise (un solo servicio web).~~ Código listo y verificado en local: `frontend/vite.config.js` (`base: '/static/'` en producción), `backend/core/settings.py` (`FRONTEND_DIST` agregado a `STATICFILES_DIRS` y `TEMPLATES[0]["DIRS"]`, con `is_dir()` para no romper dev), `backend/core/urls.py` (catch-all `re_path` con `TemplateView` para servir la SPA, después de `admin/`/`api/...`). `npm run build`, `collectstatic` ("158 static files copied, 454 post-processed"), `manage.py check` y `manage.py test` (15/15) en verde; `runserver` probado con curl (`/`, `/static/assets/...`, `/api/health/`, `/admin/login/`).
- [x] ~~`gunicorn` + configuración de Railway; migraciones automáticas en el deploy.~~ `Dockerfile` multi-stage en la raíz del repo (stage `frontend` con `node:22-slim` corre `npm run build`; stage final `python:3.13-slim` instala `requirements.txt`, copia `backend/` + `frontend/dist`, corre `collectstatic` en build; `CMD` ejecuta `migrate --noinput && gunicorn core.wsgi:application`). `.dockerignore` y `railway.json` (`healthcheckPath: /api/health/`) creados en la raíz.
- [ ] Servicio PostgreSQL en Railway + variables de entorno del backend.
- [ ] `DEBUG=False`, `ALLOWED_HOSTS`, cookies seguras, HTTPS (configuración vía variables de entorno en Railway — el código ya las soporta desde Sprint 0).
- [ ] Crear el usuario real de Javier y cargar sus datos iniciales.
- [ ] Smoke test en producción: registro, login, registrar un día completo, verificar gráficas.
- [ ] README con instrucciones de desarrollo y deploy.

### Estado de la infraestructura Railway (en curso, 2026-06-13) — dónde quedamos

- Se creó un proyecto Railway **dedicado para Órbita: "Orbita"** (workspace "raltsito's Projects"), entorno `production`. El directorio del repo ya está linkeado a él (`railway status` → `Project: Orbita`, `Service: None` todavía).
  - Se descartó el proyecto preexistente `DashboardPersonalJavier` (al que se había linkeado por error inicialmente) porque ya alberga otro servicio en producción (`DashboardLiquid`, deploy de ARUOSAL con dominio propio `dashboardliquid-production.up.railway.app` y su propio Postgres con datos reales) — no relacionado con Órbita.
  - **Limpieza pendiente (manual, baja prioridad):** en `DashboardPersonalJavier` quedó un servicio Postgres vacío llamado `Postgres-nLe_` (creado antes de cambiar de proyecto). La CLI de Railway no permite borrar un servicio individual (solo proyectos completos); hay que borrarlo desde el dashboard web cuando se tenga oportunidad. No afecta a Órbita ni a DashboardLiquid.
- **Próximo paso inmediato** (proyecto "Orbita" ya linkeado):
  1. `railway add -d postgres` — provisionar Postgres en "Orbita".
  2. `railway up` — desplegar el servicio web desde el `Dockerfile` (raíz del repo).
  3. `railway domain` — generar dominio público `*.up.railway.app`.
  4. `railway variables --set ...` en el servicio web: `SECRET_KEY` (nueva, generada con `secrets.token_urlsafe`), `DEBUG=False`, `ALLOWED_HOSTS=${{RAILWAY_PUBLIC_DOMAIN}}`, `CSRF_TRUSTED_ORIGINS=https://${{RAILWAY_PUBLIC_DOMAIN}}`, `DATABASE_URL=${{Postgres.DATABASE_URL}}`, `TIME_ZONE=America/Mexico_City`.
  5. Re-deploy si hace falta, luego smoke test (`/api/health/`, `/`, registro/login real).
  - Plan detallado completo en `C:\Users\carlo\.claude\plans\deep-sleeping-key.md` (sigue vigente, solo cambia el proyecto Railway destino).

**Entregable:** URL pública en Railway funcionando con el usuario de Javier.

---

## Fuera de alcance (posibles fases futuras)

- Notificaciones/recordatorios (email o push).
- App móvil / PWA instalable.
- Exportación de datos (CSV/PDF).

## Decisiones de producto confirmadas (2026-06-12)

1. **Agenda diaria:** cada día empieza vacío; el usuario escribe lo que guarda ese día. No se copia el día anterior.
2. **Hábitos:** los valores del tracker se reinician cada día; lo registrado queda en el historial por fecha.
3. **Compartir como imagen:** se elimina el botón. Imprimir sí se mantiene.
4. **Accesos rápidos:** editables por usuario, con modal para personalizar icono, nombre y URL.
5. **Agenda futura:** desde cualquier día se pueden agregar actividades a fechas futuras (p. ej. el sábado o dentro de dos meses), con selector de fecha y días clicables en el calendario del mes.
6. **Vista Objetivos:** se elimina el mapa orbital y se reemplaza por tarjetas por categoría con anillo de progreso medio, lista de objetivos con barras y filtros por periodo.
