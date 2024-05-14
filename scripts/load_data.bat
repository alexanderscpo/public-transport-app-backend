@echo on
pnpm wrangler d1 execute d1-public-transport-db --local --file=./sql/provincia.sql
pnpm wrangler d1 execute d1-public-transport-db --local --file=./sql/terminal.sql
pnpm wrangler d1 execute d1-public-transport-db --local --file=./sql/ruta.sql
pnpm wrangler d1 execute d1-public-transport-db --local --file=./sql/parada.sql
pnpm wrangler d1 execute d1-public-transport-db --local --file=./sql/rutas_to_paradas.sql

@REM Start-Process -FilePath '.\scripts\load_data.bat'
