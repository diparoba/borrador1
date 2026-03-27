# RBE MVP (FastAPI + Next.js + PostgreSQL)

MVP 2 para Riesgos Biologicos Ecuador con:

- mapa 2D interactivo con seleccion provincial,
- vista epidemiologica y de riesgos,
- fuentes validadas con trazabilidad de actualizacion,
- modulo de inteligencia biologica en modo demo local.

## Requisitos previos

- Python 3.11+
- Node.js 20+ y npm
- PostgreSQL 15+ en `localhost:5432`
- (Opcional recomendado) extension PostGIS instalada en PostgreSQL

## Estructura

- `backend/`: API FastAPI modular y scripts de inicializacion
- `backend/sql/`: esquema SQL inicial y datos semilla
- `frontend/`: aplicacion Next.js + Tailwind + Leaflet
- `avance.md`: bitacora de desarrollo y validaciones

## 1) Backend - entorno virtual (Windows)

Desde la raiz del proyecto:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
```

## 2) Variables de entorno backend

Crear `backend/.env` tomando como base `backend/.env.example`.

Ejemplo:

```env
APP_NAME=RBE API
APP_ENV=development
API_V1_PREFIX=/api/v1
FRONTEND_ORIGIN=http://localhost:3000
DATABASE_URL=postgresql+asyncpg://postgres:yey62185@localhost:5432/rbe_db
```

## 3) Inicializar base de datos local

Crear base vacia (si aun no existe):

```sql
CREATE DATABASE rbe_db;
```

Aplicar esquema y semillas:

```powershell
psql -U postgres -d rbe_db -f .\sql\001_schema.sql
psql -U postgres -d rbe_db -f .\sql\002_seed.sql
```

Alternativa usando ORM del backend (crea tablas segun modelos y carga seed demo):

```powershell
python -m scripts.init_db
```

## 4) Levantar backend

```powershell
uvicorn app.main:app --reload --port 8000
```

Endpoints clave:

- `GET http://localhost:8000/api/v1/health`
- `GET http://localhost:8000/api/v1/regions/provinces`
- `GET http://localhost:8000/api/v1/regions/provinces/{id}`
- `POST http://localhost:8000/api/v1/intelligence/analyze` (form-data con campo `image`)

## 5) Frontend - instalacion y arranque

En otra terminal:

```powershell
cd frontend
npm install
```

Opcional: crear `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

Ejecutar frontend:

```powershell
npm run dev
```

Abrir: `http://localhost:3000`

## 6) Flujo diario recomendado

1. Activar venv backend:
   - `cd backend`
   - `.\.venv\Scripts\Activate.ps1`
2. Levantar API:
   - `uvicorn app.main:app --reload --port 8000`
3. Levantar frontend en otra terminal:
   - `cd frontend`
   - `npm run dev`
4. Verificar smoke basico:
   - seleccionar provincia en mapa,
   - revisar detalle de riesgos y fuentes,
   - subir imagen para clasificacion demo.

## Notas

- Si PostgreSQL no esta disponible, el frontend no podra cargar datos de provincias.
- `backend/sql/001_schema.sql` incluye preparacion para PostGIS (`CREATE EXTENSION IF NOT EXISTS postgis`).
# RBE - Riesgos Biologicos Ecuador (MVP 2)

Aplicacion full stack con:
- `frontend/`: Next.js + Tailwind + Leaflet
- `backend/`: FastAPI async + SQLAlchemy + PostgreSQL

## 1) Requisitos previos

- Windows 10/11
- Python 3.11+ instalado
- Node.js + npm instalado
- PostgreSQL local en puerto `5432`
  - usuario: `postgres`
  - clave: `yey62185`

## 2) Estructura del proyecto

- `frontend/`: interfaz web responsiva
- `backend/`: API REST
- `backend/scripts/init_db.py`: crea tablas y carga semillas
- `backend/scripts/init_postgis.sql`: habilita PostGIS (opcional)

## 3) Crear y activar VENV (cada vez que trabajes)

Desde la carpeta raiz del proyecto:

```powershell
python -m venv .venv
```

Activar el entorno virtual:

```powershell
.venv\Scripts\Activate.ps1
```

Si PowerShell bloquea scripts:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.venv\Scripts\Activate.ps1
```

Verificar que esta activo (debe aparecer `(.venv)` en la terminal).

## 4) Configurar backend

Instalar dependencias:

```powershell
cd backend
pip install -r requirements.txt
```

Archivo de entorno ya preparado en `backend/.env`:

```env
DATABASE_URL=postgresql+asyncpg://postgres:yey62185@localhost:5432/rbe_db
FRONTEND_ORIGIN=http://localhost:3000
```

Crear base de datos (si no existe), desde `psql`:

```sql
CREATE DATABASE rbe_db;
```

Opcional (PostGIS):

```powershell
psql -U postgres -d rbe_db -f scripts/init_postgis.sql
```

Inicializar tablas y semillas:

```powershell
python -m scripts.init_db
```

Levantar API:

```powershell
uvicorn app.main:app --reload --port 8000
```

Endpoints principales:
- `GET http://localhost:8000/api/v1/health`
- `GET http://localhost:8000/api/v1/regions/provinces`
- `GET http://localhost:8000/api/v1/regions/provinces/{id}`
- `POST http://localhost:8000/api/v1/intelligence/analyze`

## 5) Configurar frontend

En una nueva terminal, desde la raiz:

```powershell
cd frontend
npm install
```

Crear `.env.local` en `frontend/`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
```

Levantar frontend:

```powershell
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000).

## 6) Flujo diario recomendado

1. Abrir terminal en la raiz del proyecto.
2. Activar VENV: `.venv\Scripts\Activate.ps1`
3. Levantar backend (`uvicorn ...`) en una terminal.
4. Levantar frontend (`npm run dev`) en otra terminal.
5. Trabajar y validar cambios.

## 7) Smoke test manual rapido

1. Verifica `GET /api/v1/health` devuelve `{"status":"ok"}`.
2. En la UI, verifica que el mapa cargue y muestre provincias con popup.
3. Selecciona provincia y revisa detalle epidemiologico.
4. Sube una imagen con nombre sugerido (ejemplo: `aedes_aegypti.jpg`) y valida respuesta del modulo demo.

