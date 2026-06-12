# Órbita — Dashboard personal de Javier

Dashboard personal multiusuario: agenda diaria con historial por fecha, tracker de hábitos, objetivos por categoría de vida, conexiones personales y análisis. Plan completo en [plan.md](plan.md); el prototipo de referencia (diseño aprobado) está en `Javier/`.

## Stack

- **Backend:** Django 5 + Django REST Framework, PostgreSQL.
- **Frontend:** React + Vite (CSS del prototipo, sin frameworks de estilos).
- **Deploy:** Railway (Django + WhiteNoise sirviendo el build de Vite, PostgreSQL como plugin).

## Desarrollo local

Requisitos: Python 3.12+, Node 20+, PostgreSQL local.

### Backend (puerto 8001)

```powershell
cd backend
python -m venv .venv
.venv\Scripts\python.exe -m pip install -r requirements.txt
copy .env.example .env   # y ajusta DATABASE_URL / SECRET_KEY
.venv\Scripts\python.exe manage.py migrate
.venv\Scripts\python.exe manage.py runserver 8001
```

> Se usa el puerto 8001 porque el 8000 suele estar ocupado por otros proyectos locales.

### Frontend (puerto 5173)

```powershell
cd frontend
npm install
npm run dev
```

Vite proxya `/api` → `http://localhost:8001` (ver `frontend/vite.config.js`), así que en desarrollo el frontend se usa desde `http://localhost:5173`.

### Verificación rápida

- `http://localhost:8001/api/health/` → `{"status": "ok", "app": "orbita"}`
- `http://localhost:5173/` → shell de Órbita con estado de la API "conectada".

## API

Sesión con cookies de Django + CSRF: pide `GET /api/auth/csrf/` y reenvía la cookie `csrftoken` en el header `X-CSRFToken` en cada escritura. Todos los endpoints del dominio filtran por el usuario autenticado.

### Autenticación (`/api/auth/`)

| Endpoint | Métodos | Descripción |
|---|---|---|
| `/api/auth/csrf/` | GET | Entrega la cookie csrftoken |
| `/api/auth/registro/` | POST | `{nombre, email, password}` — crea cuenta con seed inicial e inicia sesión |
| `/api/auth/login/` | POST | `{email, password}` |
| `/api/auth/logout/` | POST | Cierra la sesión |
| `/api/auth/me/` | GET | Usuario actual con su perfil |

### Dominio (`/api/`)

| Endpoint | Métodos | Notas |
|---|---|---|
| `/api/actividades/` | CRUD | Agenda por fecha. Filtros `?fecha=`, `?desde=&hasta=` (permite planificar a futuro) |
| `/api/bloques/` | CRUD | Plan semanal recurrente (día 0–6) |
| `/api/autocuidado/` | CRUD | Filtro `?fecha=` |
| `/api/habitos/` | CRUD | Filtro `?activo=true` |
| `/api/registros/` | CRUD | POST hace **upsert** sobre (hábito, fecha). Filtros `?fecha=`, `?desde=&hasta=`, `?habito=` |
| `/api/objetivos/` | CRUD | Filtros `?periodo=`, `?categoria=`, `?activo=true` |
| `/api/conexiones/` | CRUD | Personas del círculo cercano |
| `/api/accesos/` | CRUD | Accesos rápidos personalizables |
| `/api/perfil/` | GET, PATCH | Preferencias (tema, acento, densidad, vista) |
| `/api/frase/` | GET, PATCH | Frase del mes (una por usuario) |
| `/api/resumen/hoy/` | GET | KPIs: % del día, racha calculada, hábitos en verde |
| `/api/analisis/` | GET | Series reales: 7 días, conteo/% por mes, historial semanal por hábito |

## Estructura

```
backend/    Django: core (settings/urls) + apps usuarios, agenda, habitos, objetivos, conexiones
frontend/   Vite + React: src/styles/orbita.css (design system del prototipo), src/assets/
Javier/     Prototipo original (referencia visual, no se sirve en producción)
plan.md     Plan de desarrollo por sprints
```
