# Task Manager

Monorepo con API en NestJS, frontend en Next.js y paquetes compartidos para contratos, llamadas HTTP y UI.

## Cómo ejecutarlo

Desde la raíz del repositorio:

```sh
npm install
```

1. Crea la base de datos PostgreSQL (por ejemplo `task_manager`) y anota usuario, contraseña, host y puerto.
2. Variables de entorno (ejemplo → archivo real):
   - En `apps/api`: `.env.example` → `.env` (PowerShell: `Copy-Item .env.example .env`).
   - En `apps/web`: `.env.example` → `.env.local` (PowerShell: `Copy-Item .env.example .env.local`).
3. Ajusta `DATABASE_URL` en `apps/api/.env` y `NEXT_PUBLIC_API_URL` en `apps/web/.env.local` (por defecto el API escucha en el puerto **3000** y el front en **3001**).

Desde la **raíz del repo**, Turborepo levanta **a la vez el back (Nest, puerto 3000) y el front (Next, puerto 3001)**:

```sh
npm run dev
```

Compila todas las apps y paquetes que tengan tarea `build`:

```sh
npm run build
```

## Instalación y ejecución (detallada)

### Requisitos

- Node.js **20.9+** (requerido por Next.js 16; el repo usa npm workspaces).
- PostgreSQL accesible desde tu máquina.

### Variables de entorno

| Ubicación | Origen | Propósito |
|-----------|--------|-----------|
| `apps/api/.env` | `apps/api/.env.example` | Conexión a Postgres, JWT, puerto del API, `CLIENT_URL` para CORS en producción. |
| `apps/web/.env.local` | `apps/web/.env.example` | URL pública del API (`NEXT_PUBLIC_API_URL`) para el navegador. |

En `apps/api/.env`, `DATABASE_URL` sigue el formato:

`postgresql://USUARIO:CONTRASEÑA@localhost:5432/NOMBRE_BD`

Crea la base con tu herramienta preferida, por ejemplo en `psql`:

```sql
CREATE DATABASE task_manager;
```

En desarrollo, TypeORM puede sincronizar el esquema creando automáticamente las tablas en la base de datos (`synchronize` activo fuera de producción). En **producción** no se sincroniza: el esquema se versiona con **migraciones** en `apps/api/src/migrations` y se aplican al arrancar el API (`migrationsRun`). Para generar una migración nueva tras cambiar entidades: `npm run migration:generate -- src/migrations/Nombre` desde `apps/api` (ver [apps/api/README.md](apps/api/README.md)).

### Arranque conjunto

`npm run dev` ejecuta [Turborepo](https://turborepo.dev/) y levanta en paralelo el API y el front (y lo que cada workspace defina como `dev`).

### Arranque por app

- **Solo API:** `cd apps/api && npm run dev` — ver [apps/api/README.md](apps/api/README.md).
- **Solo web:** `cd apps/web && npm run dev` — ver [apps/web/README.md](apps/web/README.md).

---

## Arquitectura

```
apps/
  api/          # NestJS: auth (JWT), usuarios, tareas, TypeORM + PostgreSQL
  web/          # Next.js (App Router): páginas y layouts que consumen paquetes
packages/
  contracts/    # Tipos y DTOs compartidos (@task-manager/contracts)
  services/     # Cliente API + hooks React Query (@task-manager/services)
  ui/           # Componentes reutilizables (@repo/ui): atoms, components, util cn()
  eslint-config/, typescript-config/  # Configuración compartida de tooling
```

El front no duplica la forma de los datos: los contratos viven en `packages/contracts`; las peticiones y mutaciones van en `packages/services`; la capa visual compartida en `packages/ui`.

---

## Documentación de API

Con el API en marcha, la documentación interactiva **OpenAPI (Swagger)** está en:

**`/api/docs`** — por ejemplo [http://localhost:3000/api/docs](http://localhost:3000/api/docs) si usas el puerto por defecto.

Ahí puedes ver rutas, esquemas y probar endpoints con el botón *Authorize* para JWT.

---

## Decisiones técnicas

- **Monorepo (npm workspaces + Turborepo):** un solo `npm install`, tareas cacheadas y desarrollo paralelo de API y web.
- **Backend NestJS:** módulos por dominio (auth, users, tasks), validación con `class-validator`, configuración tipada y variables validadas al arrancar.
- **Seguridad en backend:** [Helmet](https://helmetjs.github.io/) para cabeceras HTTP; CORS restringido en producción mediante `CLIENT_URL`; contraseñas con **bcrypt**; autenticación **JWT** (Passport).
- **Límite de peticiones:** `@nestjs/throttler` aplicado de forma global (por ejemplo 100 solicitudes por ventana de tiempo) para reducir abuso.
- **Persistencia:** **TypeORM** con PostgreSQL; en desarrollo `synchronize`; en producción **migraciones** y `migrationsRun` al arranque.
- **Eliminación lógica:** las tareas no se borran físicamente del todo: se marca `active = false` y dejan de listarse para el usuario.
- **Frontend Next.js 16** con **React 19**, estilos con **Tailwind CSS 4** y utilidades como `tailwind-merge` / CVA donde aplica en `@repo/ui`.
- **Estado:** **Context API** de React para la sesión de usuario (auth); **TanStack React Query** para datos remotos, caché y mutaciones.
- **Contratos y servicios en paquetes:** evita divergencias entre tipos del cliente y del servidor y concentra la lógica HTTP en un solo lugar.
- **Pruebas:** pruebas unitarias con **Jest** en el API (`apps/api`).

## Despliegue (producción)

- **Hosting:** [Railway](https://railway.app) — API (Nest) y frontend (Next) como servicios del mismo monorepo.
- **Base de datos:** [Supabase](https://supabase.com) (PostgreSQL gestionado).
- **Acceso al front (login):** [https://web-production-de358.up.railway.app/login](https://web-production-de358.up.railway.app/login)

---

## Estructura de paquetes

| Paquete | Nombre npm | Rol |
|---------|------------|-----|
| Contratos | `@task-manager/contracts` | Tipos e interfaces compartidos (auth, tasks, etc.). |
| Servicios | `@task-manager/services` | Funciones que llaman al API + hooks de React Query. |
| UI | `@repo/ui` | Componentes presentacionales exportados por subpaths (`atoms`, `components`, `utils/cn`). |

La app `web` depende de estos paquetes mediante referencias de workspace (`*` en `package.json`).
