import asyncio

from app.core.database import init_models
from scripts.seed_data import seed_data


async def main() -> None:
    await init_models()
    await seed_data()
    print("Base de datos inicializada con datos semilla.")


if __name__ == "__main__":
    asyncio.run(main())
