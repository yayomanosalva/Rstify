# Rstify

**Modern React scaffold** — Rsbuild + React 19 + TypeScript 5 + Tailwind CSS v4 + Radix UI.

Feature-based architecture with an interactive CLI generator.

## Quick Start

### Opción 1: GitHub Template (recomendada)

1. Haz clic en **"Use this template"** en [github.com/yayomanosalva/Rstify](https://github.com/yayomanosalva/Rstify)
2. Clona tu nuevo repo y ejecuta:

```bash
bun install
bun run dev
```

### Opción 2: CLI interactivo (crear nuevo proyecto)

```bash
git clone https://github.com/yayomanosalva/Rstify.git
cd Rstify
bun run create.ts mi-proyecto
cd mi-proyecto
bun install
bun run dev
```

### Opción 3: Non-interactive (defaults)

```bash
bun run create.ts mi-proyecto -d
```

## Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Bun |
| Framework | React 19 |
| Language | TypeScript 5 (strict) |
| Build | Rsbuild 1.3 (Rspack) |
| Routing | React Router DOM 6.20 |
| Server State | TanStack React Query 5 |
| Client State | React Context / Zustand 5 |
| Styling | Tailwind CSS v4 + Radix Themes |
| UI | Radix UI + shadcn/ui style (CVA) |
| Forms | TanStack React Form + Zod |
| API | Axios (auto-refresh token) |
| Icons | Lucide React + Heroicons |
| Charts | Recharts |
| Animations | Framer Motion |
| Linting | Biome + ESLint 9 |
| Testing | Playwright |

## CLI Features

Al ejecutar `bun run create.ts` se activa el CLI interactivo que pregunta:

- **Project name**
- **API URL** (default: `http://localhost:4000/api/v1`)
- **Port** (default: `9400`)
- **Features** (multi-select):
  - Auth (login, register, protected routes)
  - Users CRUD (list, create, edit, delete)
  - Dashboard layout (sidebar + layout)
- **Include Playwright E2E tests?**
- **Include Docker config?**

## Project Structure (generated)

```
my-app/
  src/
    app/              # Pages (home, error, 404, unauthorized)
    config/           # Routes, constants, env validation
    features/         # Feature modules
      auth/           # Auth context, login, ProtectedRoute
      users/          # CRUD: api, hooks, pages, components
    shared/           # Shared layer
      api/            # Axios clients con refresh token
      components/     # UI primitives (Button, Input, etc.)
      hooks/          # useDebounce, useBreadcrumb
      http/           # Axios instance + interceptors
      styles/         # Tailwind v4 + HSL design tokens
      types/          # Global types
      utils/          # format, logger
    index.tsx         # Entry point
    root.tsx          # Root wrapper (Helmet + Theme)
    server.tsx        # Bun SSR server
```

## Development

```bash
bun run dev       # Development server
bun run build     # Production build
bun run check     # Biome lint + format
bun run rsx:module <name>  # Generate a new feature
bun run rsx:view <feature> <view>  # Generate a new view
```

## GitHub Template

Este repo está configurado como **GitHub Template**. Haz clic en "Use this template" en la página del repo para crear un nuevo proyecto sin historial.

**Para activar el template:**
1. Ve a `Settings > General > Template repository`
2. Marca el checkbox

## Branch Strategy

```
main              # Estable, release-ready (GitHub Template)
  └── develop     # Integración de features activas
        ├── feature/*    # Nuevas features
        ├── fix/*        # Bug fixes
        ├── docs/*       # Documentación
        └── cli/*        # Mejoras del CLI
```

## ROADMAP

Ver [ROADMAP.md](./ROADMAP.md) para el plan de desarrollo completo y tareas pendientes.

## License

MIT
