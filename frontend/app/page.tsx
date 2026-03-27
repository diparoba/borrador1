"use client";

import { ChangeEvent, useEffect, useState } from "react";
import dynamic from "next/dynamic";

type Province = {
  id: number;
  name: string;
  region: string;
  latitude: number;
  longitude: number;
  altitude_m: number;
  population: number;
  birth_rate: number;
  death_rate: number;
};

type Risk = {
  risk_name: string;
  causes: string;
  consequences: string;
  affected_population: string;
  hospitals_count: number;
  avg_daily_patients: number | null;
  epidemiological_fallback: string;
  source_name: string;
  source_url: string;
  validation_status: string;
  updated_at: string;
};

type ProvinceDetail = Province & { risks: Risk[] };

type Inference = {
  common_name: string;
  scientific_name: string;
  risk_category: string;
  health_impact: string;
  ecosystem_impact: string;
  reference_image_url: string;
  direct_danger: boolean;
  alert_message: string;
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";
const MapContainer = dynamic(() => import("react-leaflet").then((m) => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((m) => m.TileLayer), { ssr: false });
const CircleMarker = dynamic(() => import("react-leaflet").then((m) => m.CircleMarker), { ssr: false });
const Tooltip = dynamic(() => import("react-leaflet").then((m) => m.Tooltip), { ssr: false });

export default function Home() {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [selectedProvinceId, setSelectedProvinceId] = useState<number | null>(null);
  const [provinceDetail, setProvinceDetail] = useState<ProvinceDetail | null>(null);
  const [provinceError, setProvinceError] = useState<string | null>(null);
  const [loadingProvince, setLoadingProvince] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<Inference | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);

  useEffect(() => {
    async function loadProvinces() {
      try {
        const res = await fetch(`${API_BASE}/regions/provinces`);
        if (!res.ok) throw new Error("No se pudieron cargar las provincias.");
        const data = (await res.json()) as Province[];
        setProvinces(data);
      } catch (error) {
        setProvinceError(error instanceof Error ? error.message : "Error cargando provincias.");
      }
    }
    void loadProvinces();
  }, []);

  useEffect(() => {
    if (!selectedProvinceId) return;
    async function loadDetail() {
      setLoadingProvince(true);
      setProvinceError(null);
      try {
        const res = await fetch(`${API_BASE}/regions/provinces/${selectedProvinceId}`);
        if (!res.ok) throw new Error("No se pudo cargar la provincia seleccionada.");
        const data = (await res.json()) as ProvinceDetail;
        setProvinceDetail(data);
      } catch (error) {
        setProvinceError(error instanceof Error ? error.message : "Error cargando detalle.");
      } finally {
        setLoadingProvince(false);
      }
    }
    void loadDetail();
  }, [selectedProvinceId]);

  async function analyzeImage() {
    if (!file) {
      setAnalysisError("Selecciona una imagen antes de analizar.");
      return;
    }
    setLoadingAnalysis(true);
    setAnalysisError(null);
    setAnalysis(null);
    try {
      const body = new FormData();
      body.append("image", file);
      const res = await fetch(`${API_BASE}/intelligence/analyze`, { method: "POST", body });
      if (!res.ok) throw new Error("No fue posible analizar la imagen.");
      const data = (await res.json()) as Inference;
      setAnalysis(data);
    } catch (error) {
      setAnalysisError(error instanceof Error ? error.message : "Error en analisis.");
    } finally {
      setLoadingAnalysis(false);
    }
  }

  const onSelectFile = (event: ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files?.[0] ?? null);
    setAnalysis(null);
    setAnalysisError(null);
  };

  return (
    <main className="mx-auto max-w-7xl space-y-4 p-4">
      <header className="rounded-xl border border-slate-200 bg-white p-4">
        <h1 className="text-2xl font-bold text-slate-900">RBE - Riesgos Biologicos Ecuador</h1>
        <p className="text-sm text-slate-600">
          Mapa 2D de Ecuador, detalle epidemiologico por provincia y analisis demo local.
        </p>
      </header>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-xl border border-slate-200 bg-white p-4">
          <h2 className="mb-3 text-lg font-semibold">Mapa Interactivo</h2>
          <div className="h-96 overflow-hidden rounded-lg border border-slate-200">
            <MapContainer center={[-1.6, -78.7]} zoom={6} className="h-full w-full">
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {provinces.map((province) => (
                <CircleMarker
                  key={province.id}
                  center={[province.latitude, province.longitude]}
                  radius={selectedProvinceId === province.id ? 9 : 7}
                  pathOptions={{ color: selectedProvinceId === province.id ? "#dc2626" : "#1d4ed8" }}
                  eventHandlers={{ click: () => setSelectedProvinceId(province.id) }}
                >
                  <Tooltip direction="top">
                    <div className="text-xs">
                      <p className="font-semibold">{province.name}</p>
                      <p>Altitud: {province.altitude_m} m</p>
                      <p>Habitantes: {province.population.toLocaleString("es-EC")}</p>
                      <p>Natalidad: {province.birth_rate} | Mortalidad: {province.death_rate}</p>
                    </div>
                  </Tooltip>
                </CircleMarker>
              ))}
            </MapContainer>
          </div>
        </article>

        <article className="rounded-xl border border-slate-200 bg-white p-4">
          <h2 className="mb-3 text-lg font-semibold">Vista Epidemiologica y Riesgos</h2>
          {provinceError && <p className="mb-2 rounded bg-red-50 p-2 text-sm text-red-700">{provinceError}</p>}
          {!selectedProvinceId && (
            <p className="text-sm text-slate-600">Selecciona una provincia desde el mapa.</p>
          )}
          {loadingProvince && <p className="text-sm text-slate-600">Cargando detalle...</p>}
          {provinceDetail && !loadingProvince && (
            <div className="space-y-2">
              <p className="text-sm">
                <strong>{provinceDetail.name}</strong> ({provinceDetail.region}) - poblacion{" "}
                {provinceDetail.population.toLocaleString("es-EC")}
              </p>
              {provinceDetail.risks.map((risk) => (
                <article key={`${provinceDetail.id}-${risk.risk_name}`} className="rounded-lg border border-slate-200 p-3 text-sm">
                  <p className="font-semibold">{risk.risk_name}</p>
                  <p><strong>Causas:</strong> {risk.causes}</p>
                  <p><strong>Consecuencias:</strong> {risk.consequences}</p>
                  <p><strong>Poblacion afectada:</strong> {risk.affected_population}</p>
                  <p><strong>Hospitales:</strong> {risk.hospitals_count}</p>
                  <p>
                    <strong>Pacientes diarios:</strong>{" "}
                    {risk.avg_daily_patients ?? "Sin dato diario (usando fallback MSP)"}
                  </p>
                  {risk.avg_daily_patients === null && (
                    <p><strong>Situacion epidemiologica:</strong> {risk.epidemiological_fallback}</p>
                  )}
                  <p>
                    <strong>Fuente:</strong>{" "}
                    <a className="text-blue-700 underline" href={risk.source_url} target="_blank" rel="noreferrer">
                      {risk.source_name}
                    </a>
                  </p>
                  <p className="text-xs text-slate-500">
                    Estado: {risk.validation_status} | Ultima actualizacion:{" "}
                    {new Date(risk.updated_at).toLocaleString("es-EC")}
                  </p>
                </article>
              ))}
            </div>
          )}
        </article>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <h2 className="mb-3 text-lg font-semibold">Inteligencia Biologica (Demo local)</h2>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <input type="file" accept="image/*" onChange={onSelectFile} />
          <button
            type="button"
            onClick={analyzeImage}
            disabled={loadingAnalysis}
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {loadingAnalysis ? "Analizando..." : "Analizar imagen"}
          </button>
        </div>
        {analysisError && <p className="mt-2 rounded bg-red-50 p-2 text-sm text-red-700">{analysisError}</p>}
        {analysis && (
          <div className="mt-3 rounded-lg border border-slate-200 p-3 text-sm">
            <p className="font-semibold">
              {analysis.common_name} ({analysis.scientific_name})
            </p>
            <p><strong>Categoria:</strong> {analysis.risk_category}</p>
            <p><strong>Impacto salud:</strong> {analysis.health_impact}</p>
            <p><strong>Impacto ecosistema:</strong> {analysis.ecosystem_impact}</p>
            <p><strong>Peligro directo:</strong> {analysis.direct_danger ? "Si" : "No"}</p>
            <p><strong>Alerta:</strong> {analysis.alert_message}</p>
          </div>
        )}
      </section>
    </main>
  );
}
