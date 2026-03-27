from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.repositories.domain_repository import DomainRepository
from app.schemas.domain import ProvinceDetail, ProvinceSummary, RiskDetail

router = APIRouter(prefix="/regions", tags=["regions"])
repo = DomainRepository()


@router.get("/provinces", response_model=list[ProvinceSummary])
async def list_provinces(db: AsyncSession = Depends(get_db)) -> list[ProvinceSummary]:
    provinces = await repo.list_provinces(db)
    return [
        ProvinceSummary(
            id=province.id,
            name=province.name,
            region=province.region,
            latitude=province.latitude,
            longitude=province.longitude,
            altitude_m=province.altitude_m,
            population=province.population,
            birth_rate=province.birth_rate,
            death_rate=province.death_rate,
        )
        for province in provinces
    ]


@router.get("/provinces/{province_id}", response_model=ProvinceDetail)
async def get_province_detail(
    province_id: int, db: AsyncSession = Depends(get_db)
) -> ProvinceDetail:
    province = await repo.get_province(db, province_id)
    if province is None:
        raise HTTPException(status_code=404, detail="Provincia no encontrada")

    risks = [
        RiskDetail(
            risk_name=r.risk_name,
            causes=r.causes,
            consequences=r.consequences,
            affected_population=r.affected_population,
            hospitals_count=r.hospitals_count,
            avg_daily_patients=r.avg_daily_patients,
            epidemiological_fallback=r.epidemiological_fallback,
            source_name=r.source_name,
            source_url=r.source_url,
            validation_status=r.validation_status,
            updated_at=r.updated_at,
        )
        for r in province.risk_records
    ]

    return ProvinceDetail(
        id=province.id,
        name=province.name,
        region=province.region,
        latitude=province.latitude,
        longitude=province.longitude,
        altitude_m=province.altitude_m,
        population=province.population,
        birth_rate=province.birth_rate,
        death_rate=province.death_rate,
        risks=risks,
    )
