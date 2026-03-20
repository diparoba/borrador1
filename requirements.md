# Documento de Requerimientos de Software - Proyecto RBE

## 1. Información General
* **Nombre del Proyecto:** RBE (Riesgos Biológicos Ecuador)
* **Público Objetivo:** Estudiantes de ciencias biomédicas, investigadores y autoridades de salud.
* **Plataformas:** Aplicación Web Responsiva (Desktop y Mobile).

## 2. Resumen del Sistema
RBE es una plataforma integral diseñada para la visualización y análisis de riesgos biológicos en Ecuador. Combina datos geoespaciales, indicadores demográficos y visión artificial para identificar amenazas biológicas (flora/fauna) y epidemiológicas, integrando fuentes validadas por centros de investigación y hospitales.

## 3. Arquitectura Tecnológica Propuesta
* **Backend:** Python con **FastAPI**.
* **Frontend:** **Next.js** (React) + Tailwind CSS.
* **Base de Datos:** **PostgreSQL** con extensión **PostGIS** para datos geográficos.
* **IA/Visión:** OpenCV / TensorFlow Lite (para identificación de especies).

## 4. Módulos del Sistema

### Módulo 1: Visualización Geoespacial (Mapa Interactivo)
* Visualización del mapa del Ecuador con navegación fluida.
* **Interacción Hover:** Al posicionar el mouse sobre una ciudad/provincia, mostrar:
    * Altura sobre el nivel del mar.
    * Población total.
    * Tasas de natalidad y mortalidad.
* **Selección de Región:** Apertura de panel lateral/pestaña con detalles profundos.

### Módulo 2: Inteligencia Biológica (Visión Artificial)
* Captura de imagen vía cámara en vivo o carga de captura de pantalla.
* Identificación de especies (insectos y plantas).
* **Análisis de Riesgo:** Clasificación según peligrosidad directa e impacto como especie invasora en el ecosistema local.

### Módulo 3: Epidemiológico y de Riesgos
* Despliegue de riesgos biológicos específicos por zona.
* Análisis de causas y consecuencias.
* **Estadísticas Hospitalarias:** Cantidad de centros de salud y promedio de pacientes diarios.
* **Análisis Histórico:** Comparativa de cifras actuales vs. años anteriores para trazabilidad de brotes.

### Módulo 4: Gestión de Fuentes y Validación
* Sistema de registro de bibliografía y fuentes oficiales.
* Etiquetado de información "Verificada y Validada".
* Indicador visible de "Última actualización" con fecha y hora exacta.

### Módulo 5: Colaboración Institucional
* Panel de administración para centros de investigación y hospitales asociados.
* API de actualización de datos en tiempo real para cifras de pacientes y riesgos emergentes.

## 5. Requerimientos de Datos (Modelo de Datos)
1.  **Datos Territoriales:** Capas GeoJSON con límites provinciales y cantonales de Ecuador.
2.  **Indicadores Bio-Demográficos:** Tablas de registros del INEC/Ministerio de Salud.
3.  **Repositorio Epidemiológico:** Histórico de enfermedades infectocontagiosas y zoonosis.
4.  **Catálogo de Especies:** Base de datos taxonómica con descripciones de impacto ecológico.

## 6. Requerimientos No Funcionales
* **Simplicidad:** Interfaz limpia pero con profundidad técnica.
* **Disponibilidad:** Acceso multiplataforma (Web y Móvil).
* **Integridad:** Toda información debe poseer una fuente verificable.