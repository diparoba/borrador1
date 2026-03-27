BEGIN;

INSERT INTO data_sources (institution_name, source_url, validation_status, validated_by, validated_at, notes)
VALUES
    ('MSP Ecuador', 'https://www.salud.gob.ec/', 'approved', 'admin_demo', NOW(), 'Fuente oficial de salud publica'),
    ('Geosalud MSP', 'https://geosalud.msp.gob.ec/', 'approved', 'admin_demo', NOW(), 'Tablero epidemiologico territorial')
ON CONFLICT DO NOTHING;

INSERT INTO provinces (name, region, latitude, longitude, altitude_m, population, birth_rate, death_rate, geom)
VALUES
    (
        'Pichincha',
        'Sierra',
        -0.1807,
        -78.4678,
        2850,
        3228000,
        13.2,
        5.7,
        ST_SetSRID(ST_MakePoint(-78.4678, -0.1807), 4326)
    ),
    (
        'Guayas',
        'Costa',
        -2.1894,
        -79.8891,
        4,
        4301000,
        14.1,
        6.0,
        ST_SetSRID(ST_MakePoint(-79.8891, -2.1894), 4326)
    ),
    (
        'Azuay',
        'Sierra',
        -2.9001,
        -79.0059,
        2560,
        881394,
        11.8,
        5.2,
        ST_SetSRID(ST_MakePoint(-79.0059, -2.9001), 4326)
    )
ON CONFLICT (name) DO NOTHING;

INSERT INTO risk_records (
    province_id,
    source_id,
    risk_name,
    causes,
    consequences,
    affected_population,
    hospitals_count,
    avg_daily_patients,
    epidemiological_fallback,
    source_name,
    source_url,
    validation_status
)
SELECT
    p.id,
    ds.id,
    'Brotes respiratorios estacionales',
    'Alta movilidad urbana y cambios climaticos',
    'Aumento de consultas y ausentismo academico',
    'Ninos, adultos mayores y pacientes cronicos',
    36,
    980,
    'Boletin MSP semana 11: incremento moderado',
    'MSP Ecuador',
    'https://www.salud.gob.ec/',
    'approved'
FROM provinces p
CROSS JOIN data_sources ds
WHERE p.name = 'Pichincha' AND ds.institution_name = 'MSP Ecuador'
ON CONFLICT DO NOTHING;

INSERT INTO risk_records (
    province_id,
    source_id,
    risk_name,
    causes,
    consequences,
    affected_population,
    hospitals_count,
    avg_daily_patients,
    epidemiological_fallback,
    source_name,
    source_url,
    validation_status
)
SELECT
    p.id,
    ds.id,
    'Enfermedades vectoriales',
    'Zonas humedas y presencia de criaderos',
    'Mayor presion en emergencias y vigilancia comunitaria',
    'Barrios periurbanos y zonas costeras',
    41,
    NULL,
    'Sin dato diario consolidado; mostrar situacion epidemiologica mensual MSP',
    'Geosalud MSP',
    'https://geosalud.msp.gob.ec/',
    'approved'
FROM provinces p
CROSS JOIN data_sources ds
WHERE p.name = 'Guayas' AND ds.institution_name = 'Geosalud MSP'
ON CONFLICT DO NOTHING;

INSERT INTO species_catalog (
    common_name,
    scientific_name,
    risk_category,
    health_impact,
    ecosystem_impact,
    reference_image_url,
    direct_danger
)
VALUES
    (
        'Aedes aegypti',
        'Aedes aegypti',
        'Portadora de parasitos',
        'Transmision potencial de dengue, zika y chikungunya',
        'Interaccion con ecosistemas urbanos densos',
        'https://example.com/aedes.jpg',
        'yes'
    ),
    (
        'Caracol gigante africano',
        'Achatina fulica',
        'Invasora',
        'Puede alojar parasitos que afectan a humanos',
        'Desplaza especies nativas y afecta cultivos',
        'https://example.com/achatina.jpg',
        'no'
    ),
    (
        'Ortiga brava',
        'Urtica dioica',
        'Venenosa',
        'Irritacion cutanea intensa por contacto',
        'Bajo impacto ecosistemico en presencia controlada',
        'https://example.com/urtica.jpg',
        'yes'
    )
ON CONFLICT DO NOTHING;

INSERT INTO species_observations (province_id, species_id, source_id, notes)
SELECT
    p.id,
    s.id,
    ds.id,
    'Registro demo para mapa/riesgos'
FROM provinces p
JOIN species_catalog s ON s.common_name = 'Aedes aegypti'
JOIN data_sources ds ON ds.institution_name = 'MSP Ecuador'
WHERE p.name = 'Pichincha'
ON CONFLICT DO NOTHING;

COMMIT;
