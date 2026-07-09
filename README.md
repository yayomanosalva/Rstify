# Rstify

**Modern React scaffold** — Rsbuild + React 19 + TypeScript 5 + Tailwind CSS v4 + Radix UI.

Feature-based architecture with an interactive CLI generator.

```bash
bun create github:yayomanosalva/Rstify my-app
cd my-app
bun install
bun run dev
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

## Usage

### Create a new project

```bash
bun create github:yayomanosalva/Rstify my-app
```

### Or clone and run setup

```bash
git clone https://github.com/yayomanosalva/Rstify.git
cd Rstify
bun run create.ts my-app
```

### CLI Options

The CLI will ask interactive questions:

- **Project name** (or pass as argument)
- **API URL** (default: `http://localhost:4000/api/v1`)
- **Port** (default: `9400`)
- **Features** to include (multi-select):
  - Auth (login, register, protected routes)
  - Users CRUD (list, create, edit, delete)
  - Dashboard layout (sidebar + layout)
  - Roles & Permissions

## Project Structure

```
my-app/
  src/
    app/              # Application pages (layouts, error, 404)
    config/           # Routes, constants, env validation
    features/         # Feature modules (auth, users, ...)
    shared/           # Shared: UI, API, hooks, types, utils
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
```

## License

MIT
