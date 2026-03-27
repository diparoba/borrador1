from app.models.entities import Species


class ClassifierService:
    @staticmethod
    def classify_by_filename(filename: str, catalog: list[Species]) -> Species:
        lowered = filename.lower()
        for species in catalog:
            if species.common_name.lower().replace(" ", "_") in lowered:
                return species
            if species.scientific_name.lower().replace(" ", "_") in lowered:
                return species
        # Fallback deterministic for demo.
        return catalog[0]

    @staticmethod
    def build_alert(species: Species) -> str:
        if species.direct_danger.lower() == "yes":
            return (
                "Alerta: la especie analizada representa peligro directo para "
                "la poblacion. Se recomienda evitar contacto y notificar a salud publica."
            )
        if species.risk_category.lower() == "invasora":
            return (
                "Advertencia: especie invasora detectada. Puede alterar el "
                "ecosistema local y desplazar especies nativas."
            )
        return "Riesgo moderado: se recomienda seguimiento y educacion preventiva."
