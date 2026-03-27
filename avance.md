# Avance MVP RBE

Fecha: 2026-03-26

## Fase 1 - Backend FastAPI modular

- Estado: **completado**
- Entregables:
  - estructura modular en `backend/app` (`api`, `core`, `models`, `schemas`, `services`, `repositories`)
  - configuracion por entorno en `backend/app/core/config.py`
  - conexion async SQLAlchemy a PostgreSQL en `backend/app/core/database.py`
  - rutas base MVP:
    - `GET /api/v1/health`
    - `GET /api/v1/regions/provinces`
    - `GET /api/v1/regions/provinces/{id}`
    - `POST /api/v1/intelligence/analyze`

## Fase 2 - Esquema PostgreSQL/PostGIS + semillas

- Estado: **completado**
- Entregables:
  - `backend/sql/001_schema.sql` con tablas, constraints, PK/FK, indices y extension PostGIS
  - `backend/sql/002_seed.sql` con datos semilla para provincias, riesgos, especies y fuentes
- Cobertura de datos:
  - territorio provincial + coordenadas
  - riesgos/epidemiologia con fallback
  - catalogo de especies para demo de clasificacion
  - metadatos de fuentes y validacion

## Fase 3 - Frontend Next.js con mapa y detalle

- Estado: **completado**
- Entregables:
  - app Next.js en `frontend/`
  - interfaz responsive en `frontend/app/page.tsx`
  - mapa Leaflet con interaccion provincial (hover tooltip + click para detalle)
  - panel de detalle epidemiologico y riesgos con fuente/estado/ultima actualizacion
  - modulo demo de analisis de imagen conectado al endpoint backend

## Fase 4 - Documentacion portable

- Estado: **completado**
- Entregables:
  - `README.md` con:
    - configuracion venv en Windows
    - variables de entorno
    - inicializacion DB via SQL y via script Python
    - arranque backend/frontend
    - flujo diario de trabajo

## Fase 5 - Smoke validation E2E

- Estado: **completado con observaciones**
- Validaciones ejecutadas:
  - backend: `python -m compileall app scripts` (ok)
  - frontend: `npm run lint` (ok)
  - frontend: `npm run build` (ok)
  - API y UI en runtime dependen de tener PostgreSQL local activo con `rbe_db`
- Resultado:
  - build/lint/compilacion correctos
  - la validacion funcional end-to-end queda lista para ejecutar localmente al levantar PostgreSQL y ambos servicios

## Pendientes / siguiente paso

- Levantar PostgreSQL local y correr:
  - `psql -U postgres -d rbe_db -f .\sql\001_schema.sql`
  - `psql -U postgres -d rbe_db -f .\sql\002_seed.sql`
- Ejecutar backend + frontend y registrar capturas de validacion funcional en una siguiente iteracion.
# Avance del Proyecto RBE

## Estado general
- Fecha: 2026-03-27
- Fase actual: MVP 2 (implementacion base)
- Estado: En progreso

## Completado
- Backend FastAPI modular inicial (`app/api`, `core`, `models`, `schemas`, `services`, `repositories`).
- Conexion async a PostgreSQL por `DATABASE_URL`.
- Endpoints base:
  - `GET /api/v1/health`
  - `GET /api/v1/regions/provinces`
  - `GET /api/v1/regions/provinces/{id}`
  - `POST /api/v1/intelligence/analyze`
- Esquema relacional inicial para:
  - provincias
  - riesgos epidemiologicos
  - catalogo de especies
- Datos semilla para demo (provincias, riesgos, especies).
- Frontend Next.js adaptado:
  - mapa con Leaflet
  - selector de provincia
  - vista de riesgos y fuentes
  - formulario de analisis de imagen (demo local)
- README operativo creado con pasos de venv y arranque completo.

## En progreso
- Validacion local end-to-end (dependiente de instalacion de paquetes y servicios en entorno local).

## Pendiente inmediato
- Ejecutar `python -m scripts.init_db` contra PostgreSQL local.
- Ejecutar `npm install` en frontend para dependencias nuevas (`leaflet`, `react-leaflet`).
- Probar flujo completo en navegador y ajustar detalles de UI/UX.

## Riesgos/Bloqueos conocidos
- Si `rbe_db` no existe, la inicializacion fallara.
- Si no esta habilitado PostGIS y se requiere geodata avanzada, hay que ejecutar `scripts/init_postgis.sql`.
- El clasificador de vision artificial es demo local basado en nombre de archivo, no modelo ML real.

