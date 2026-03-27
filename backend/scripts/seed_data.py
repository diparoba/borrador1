from datetime import datetime, timezone

from sqlalchemy import delete

from app.core.database import SessionLocal
from app.models.entities import Province, RiskRecord, Species


async def seed_data() -> None:
    async with SessionLocal() as db:
        await db.execute(delete(RiskRecord))
        await db.execute(delete(Species))
        await db.execute(delete(Province))
        await db.commit()

        provinces = [
            Province(
                name="Pichincha",
                region="Sierra",
                latitude=-0.1807,
                longitude=-78.4678,
                altitude_m=2850,
                population=3228000,
                birth_rate=13.2,
                death_rate=5.7,
            ),
            Province(
                name="Guayas",
                region="Costa",
                latitude=-2.1894,
                longitude=-79.8891,
                altitude_m=4,
                population=4301000,
                birth_rate=14.1,
                death_rate=6.0,
            ),
            Province(
                name="Azuay",
                region="Sierra",
                latitude=-2.9001,
                longitude=-79.0059,
                altitude_m=2560,
                population=881394,
                birth_rate=11.8,
                death_rate=5.2,
            ),
        ]
        db.add_all(provinces)
        await db.flush()

        risk_records = [
            RiskRecord(
                province_id=provinces[0].id,
                risk_name="Brotes respiratorios estacionales",
                causes="Alta movilidad urbana y cambios climaticos.",
                consequences="Aumento de consultas y ausentismo academico.",
                affected_population="Ninos, adultos mayores y pacientes cronicos.",
                hospitals_count=36,
                avg_daily_patients=980,
                epidemiological_fallback="Boletin MSP semana 11: incremento moderado.",
                source_name="MSP Ecuador",
                source_url="https://www.salud.gob.ec/",
                validation_status="approved",
                updated_at=datetime.now(tz=timezone.utc),
            ),
            RiskRecord(
                province_id=provinces[1].id,
                risk_name="Enfermedades vectoriales",
                causes="Zonas humedas y presencia de criaderos.",
                consequences="Mayor presion en emergencias y vigilancia comunitaria.",
                affected_population="Barrios periurbanos y zonas costeras.",
                hospitals_count=41,
                avg_daily_patients=None,
                epidemiological_fallback=(
                    "Sin dato diario consolidado. Se muestra situacion "
                    "epidemiologica mensual MSP."
                ),
                source_name="Geosalud",
                source_url="https://geosalud.msp.gob.ec/",
                validation_status="approved",
                updated_at=datetime.now(tz=timezone.utc),
            ),
        ]
        db.add_all(risk_records)

        species = [
            Species(
                common_name="Aedes aegypti",
                scientific_name="Aedes aegypti",
                risk_category="Portadora de parasitos",
                health_impact="Transmision potencial de dengue, zika y chikungunya.",
                ecosystem_impact="Interaccion con ecosistemas urbanos densos.",
                reference_image_url="https://example.com/aedes.jpg",
                direct_danger="yes",
            ),
            Species(
                common_name="Caracol gigante africano",
                scientific_name="Achatina fulica",
                risk_category="Invasora",
                health_impact="Puede alojar parasitos que afectan a humanos.",
                ecosystem_impact="Desplaza especies nativas y afecta cultivos.",
                reference_image_url="https://example.com/achatina.jpg",
                direct_danger="no",
            ),
            Species(
                common_name="Ortiga brava",
                scientific_name="Urtica dioica",
                risk_category="Venenosa",
                health_impact="Irritacion cutanea intensa por contacto.",
                ecosystem_impact="Bajo impacto ecosistemico en presencia controlada.",
                reference_image_url="https://example.com/urtica.jpg",
                direct_danger="yes",
            ),
        ]
        db.add_all(species)
        await db.commit()
