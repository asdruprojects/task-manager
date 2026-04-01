# Task Manager — API

API REST construida con **NestJS**, **TypeORM** y **PostgreSQL**: registro e inicio de sesión (JWT), CRUD de tareas por usuario y documentación OpenAPI.

## Requisitos

- Node.js 20.9+ (alineado con el monorepo / Next)
- PostgreSQL y una base de datos creada (por ejemplo `task_manager`)

## Configuración

Crea `.env` a partir del ejemplo (desde `apps/api`):

```powershell
Copy-Item .env.example .env
```

En bash: `cp .env.example .env`.

Edita `apps/api/.env` y define al menos:

- `DATABASE_URL` — cadena de conexión PostgreSQL
- `JWT_SECRET` — clave segura para firmar tokens
- `JWT_EXPIRATION` — por ejemplo `1d`
- `PORT` — puerto HTTP (por defecto **3000**)
- `CLIENT_URL` — origen del front; en desarrollo suele ser `http://localhost:3001`; en producción, la URL de tu despliegue (necesaria para CORS)

`NODE_ENV` suele ser `development` en local.

## Instalación

Desde esta carpeta:

```sh
npm install
```

O una sola vez desde la raíz del monorepo: `npm install` (instala todos los workspaces).

## Ejecución

**Desarrollo (recarga al guardar):**

```sh
npm run dev
```

Equivale a `nest start --watch`.

**Producción (tras compilar):**

```sh
npm run build
npm run start:prod
```

El binario arranca con `node dist/main`.

## Migraciones (TypeORM)

En **producción** (`NODE_ENV=production`) el API **aplica migraciones pendientes al arrancar** (`migrationsRun`). No hace falta SQL manual en la BD.

Las migraciones viven en `src/migrations/`. Nest las compila a `dist/migrations/*.js` y se cargan por **patrón glob** (no hace falta importar cada archivo en `app.module`).

| Comando | Uso |
|--------|-----|
| `npm run migration:show` | Ver qué migraciones están aplicadas o pendientes (requiere `.env` con `DATABASE_URL`). |
| `npm run migration:run` | Aplicar pendientes desde tu máquina (misma lógica que en prod). |
| `npm run migration:revert` | Deshace la última migración. |

**Cuando cambias entidades** (nueva columna, tabla, etc.), lo habitual es **generar** el diff contra la BD que ya tiene las migraciones anteriores aplicadas:

```sh
npm run migration:generate -- src/migrations/DescripcionDelCambio
```

TypeORM crea un archivo nuevo en `src/migrations/`. **Revísalo** (a veces hay que ajustar índices o nombres), luego commit y deploy.

La **primera** migración del proyecto puede ser manual (como la inicial) o generada con la BD vacía tras alinear entidades; a partir de ahí, **generate** es la práctica más cómoda.

## Documentación de la API (Swagger)

Con el servidor en marcha, abre en el navegador:

**http://localhost:3000/api/docs**

(Sustituye el puerto si cambiaste `PORT` en `.env`.)

Desde Swagger puedes explorar rutas, ver DTOs y probar endpoints. Para rutas protegidas, usa *Authorize* y pega el token JWT (`Bearer …`).

## Pruebas

```sh
npm run test        # unitarias
npm run test:e2e    # extremo a extremo (requiere entorno configurado)
npm run test:cov    # cobertura
```

## Scripts útiles

| Script | Descripción |
|--------|-------------|
| `npm run build` | Compila a `dist/` |
| `npm run start` | Arranque Nest sin watch |
| `npm run lint` | ESLint |
