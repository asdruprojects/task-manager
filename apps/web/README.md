# Task Manager — Web

Frontend **Next.js** (App Router) para el gestor de tareas. Consume el API mediante el paquete `@task-manager/services`, tipos de `@task-manager/contracts` y componentes de `@repo/ui`.

## Requisitos

- Node.js 18+
- API en ejecución (por defecto se asume `http://localhost:3000`)

## Configuración

Crea `.env.local` a partir del ejemplo (desde `apps/web`):

```powershell
Copy-Item .env.example .env.local
```

En bash: `cp .env.example .env.local`.

En `apps/web/.env.local` define:

- `NEXT_PUBLIC_API_URL` — URL base del API **visible en el navegador** (en local suele ser `http://localhost:3000`).

Next solo expone al cliente las variables que empiezan por `NEXT_PUBLIC_`.

## Instalación

Desde esta carpeta:

```sh
npm install
```

O desde la raíz del monorepo: `npm install`.

## Ejecución

**Desarrollo** (puerto **3001** para no chocar con el API en 3000):

```sh
npm run dev
```

Abre [http://localhost:3001](http://localhost:3001).

**Compilar para producción:**

```sh
npm run build
```

**Servir el build localmente:**

```sh
npm run start
```

(Por defecto Next puede usar el puerto 3000 en `start`; si el API también está en 3000, ejecuta uno de los dos en otro puerto o usa solo el front compilado contra un API remoto.)

## Otros comandos

| Script | Descripción |
|--------|-------------|
| `npm run lint` | ESLint |
| `npm run check-types` | Comprobación de tipos (Next + tsc) |

## Relación con el monorepo

Esta app depende de workspaces internos:

- `@task-manager/contracts` — contratos de datos
- `@task-manager/services` — cliente HTTP y React Query
- `@repo/ui` — biblioteca de UI (Tailwind, atoms, components)

Para desarrollo conjunto, suele ser más cómodo ejecutar `npm run dev` en la **raíz** del repositorio y levantar API y web a la vez.
