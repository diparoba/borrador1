CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE IF NOT EXISTS provinces (
    id SERIAL PRIMARY KEY,
    name VARCHAR(120) NOT NULL UNIQUE,
    region VARCHAR(80) NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    altitude_m INTEGER NOT NULL CHECK (altitude_m >= 0),
    population INTEGER NOT NULL CHECK (population >= 0),
    birth_rate DOUBLE PRECISION NOT NULL CHECK (birth_rate >= 0),
    death_rate DOUBLE PRECISION NOT NULL CHECK (death_rate >= 0),
    geom GEOMETRY(POINT, 4326),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS data_sources (
    id SERIAL PRIMARY KEY,
    institution_name VARCHAR(180) NOT NULL,
    source_url TEXT NOT NULL,
    validation_status VARCHAR(30) NOT NULL
        CHECK (validation_status IN ('pending', 'approved', 'rejected')),
    validated_by VARCHAR(120),
    validated_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS risk_records (
    id SERIAL PRIMARY KEY,
    province_id INTEGER NOT NULL REFERENCES provinces(id) ON DELETE CASCADE,
    source_id INTEGER REFERENCES data_sources(id) ON DELETE SET NULL,
    risk_name VARCHAR(140) NOT NULL,
    causes TEXT NOT NULL,
    consequences TEXT NOT NULL,
    affected_population TEXT NOT NULL,
    hospitals_count INTEGER NOT NULL CHECK (hospitals_count >= 0),
    avg_daily_patients INTEGER,
    epidemiological_fallback TEXT NOT NULL,
    source_name VARCHAR(180) NOT NULL,
    source_url TEXT NOT NULL,
    validation_status VARCHAR(30) NOT NULL DEFAULT 'approved'
        CHECK (validation_status IN ('pending', 'approved', 'rejected')),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS species_catalog (
    id SERIAL PRIMARY KEY,
    common_name VARCHAR(120) NOT NULL,
    scientific_name VARCHAR(160) NOT NULL,
    risk_category VARCHAR(60) NOT NULL
        CHECK (risk_category IN ('Invasora', 'Venenosa', 'Portadora de parasitos')),
    health_impact TEXT NOT NULL,
    ecosystem_impact TEXT NOT NULL,
    reference_image_url TEXT NOT NULL,
    direct_danger VARCHAR(10) NOT NULL DEFAULT 'no'
        CHECK (direct_danger IN ('yes', 'no')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS species_observations (
    id SERIAL PRIMARY KEY,
    province_id INTEGER NOT NULL REFERENCES provinces(id) ON DELETE CASCADE,
    species_id INTEGER NOT NULL REFERENCES species_catalog(id) ON DELETE CASCADE,
    observed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    source_id INTEGER REFERENCES data_sources(id) ON DELETE SET NULL,
    notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_provinces_region ON provinces(region);
CREATE INDEX IF NOT EXISTS idx_provinces_name ON provinces(name);
CREATE INDEX IF NOT EXISTS idx_provinces_geom ON provinces USING GIST(geom);
CREATE INDEX IF NOT EXISTS idx_data_sources_status ON data_sources(validation_status);
CREATE INDEX IF NOT EXISTS idx_risk_records_province ON risk_records(province_id);
CREATE INDEX IF NOT EXISTS idx_risk_records_status ON risk_records(validation_status);
CREATE INDEX IF NOT EXISTS idx_risk_records_updated_at ON risk_records(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_species_catalog_names ON species_catalog(common_name, scientific_name);
CREATE INDEX IF NOT EXISTS idx_species_observations_province ON species_observations(province_id, observed_at DESC);
