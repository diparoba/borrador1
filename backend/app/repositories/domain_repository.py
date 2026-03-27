from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.entities import Province, Species


class DomainRepository:
    async def list_provinces(self, db: AsyncSession) -> list[Province]:
        result = await db.execute(select(Province).order_by(Province.name.asc()))
        return list(result.scalars().all())

    async def get_province(self, db: AsyncSession, province_id: int) -> Province | None:
        result = await db.execute(
            select(Province)
            .where(Province.id == province_id)
            .options(selectinload(Province.risk_records))
        )
        return result.scalars().first()

    async def get_all_species(self, db: AsyncSession) -> list[Species]:
        result = await db.execute(select(Species))
        return list(result.scalars().all())
