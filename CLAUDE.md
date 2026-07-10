# CLAUDE.md - Rstify Project Instructions

## Project Overview

Rstify is a **React scaffold CLI** that generates production-ready frontend projects with:

- **Stack:** Rsbuild + React 19 + TypeScript 5 (strict) + Tailwind CSS v4 + Radix UI
- **Architecture:** Feature-based modular with shared/core layer
- **State:** TanStack React Query 5 (server) + React Context (client)
- **API:** Axios with auto-refresh token interceptor
- **Forms:** TanStack React Form + Zod validation
- **Routing:** React Router DOM 6.20 with lazy loading
- **SSR:** Bun.serve() with HMR

The repo has two parts:
1. **CLI tool** (`create.ts` + `src/cli/`) — interactive project generator
2. **Template** (`template/`) — the actual project scaffold

## Branch Strategy

```
main              # Stable, release-ready (GitHub Template base)
  └── develop     # Integration branch for active development
        ├── feature/*    # New features (feature/roles-generator)
        ├── fix/*        # Bug fixes (fix/env-var-issue)
        ├── docs/*       # Documentation (docs/contributing-guide)
        └── cli/*        # CLI-specific improvements (cli/npm-publish)
```

**Rules:**
- `main` solo recibe merges desde `develop` via PR
- `feature/*` branches se crean desde `develop` y se mergean a `develop`
- Commits directos a `main` solo para hotfixes críticos
- Usar Conventional Commits: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `cli:`

## Development Workflow

```sh
# 1. Feature branch
git checkout develop
git checkout -b feature/<name>

# 2. Make changes + verify
bun run create.ts /tmp/test-app -d     # Test CLI works
cd /tmp/test-app
bun install
bun run build                          # Verify build
bun run check                          # Biome lint
cd -

# 3. Commit
git add -A
git commit -m "feat: description"

# 4. Merge back
git checkout develop
git merge feature/<name>
```

## Verification Loop (before any commit)

1. `bun run check` — Biome lint + format
2. Run `create.ts` con defaults y verificar que genera proyecto
3. `bun install + bun run build` en proyecto generado
4. Revisar `git diff` para confirmar solo lo necesario

## Architecture Rules

### CLI (`create.ts` + `src/cli/`)
- `create.ts` es el entry point, NO contiene lógica de generación
- Cada feature tiene su propio generator en `src/cli/generators/<name>.ts`
- Los generators mutan archivos en `targetDir` después del copy del template
- `prompts.ts` maneja toda interacción con el usuario
- Las respuestas viajan como `Answers` interface

### Template (`template/`)
- Es el proyecto base completo con TODAS las features
- El CLI COPIA el template completo y REMUEVE features no seleccionadas
- `template/package.json` es el package.json del proyecto generado (NO del CLI)
- El template debe poder `bun install && bun run build` sin errores
- NO poner node_modules, dist, bun.lock en el template

### Generators
- Cada generator exporta una función: `generate<Name>(templateDir, targetDir, answers)`
- Usar solo `fs` nativo (no librerías externas en generators)
- Las rutas siempre con `join()` y `resolve()` de path

## Code Style

- TypeScript strict, sin `any` sin aprobación explícita
- Prefer `type` sobre `interface` para DTOs y props
- Usar `import type` para imports de tipos
- Nombres: `camelCase` para funciones/vars, `PascalCase` para componentes/tipos
- Componentes: export function, sin React.FC (excepto forwardRef)
- Sin comentarios en código generado (template/)
- Errores: try/catch con mensajes descriptivos, no tragar errores

## Commands Reference

```sh
# CLI development
bun run create.ts <project-name>          # Run CLI interactively
bun run create.ts <project-name> -d      # Run with defaults (non-interactive)

# Template verification (inside generated project)
bun install                               # Install 648 packages
bun run dev                               # Dev server
bun run build                             # Production build
bun run check                             # Biome lint + format

# Git
git status
git diff
git log --oneline -10
```

## Self-Improvement

- Cada corrección → actualizar este CLAUDE.md
- Si el AI repite un error → añadir regla explícita
- Errores comunes tracked abajo

### Known Mistakes (no repetir)

1. No mezclar package.json del CLI con el del template (cada uno tiene el suyo)
2. No hardcodear rutas, siempre usar `join(import.meta.dir, 'template')`
3. Template debe buildear sin errores de favicon/rutas faltantes
4. CLI debe funcionar con args de ruta absoluta y relativa
5. No dejar test artifacts (limpiar `/tmp/`)

## Session Management

- Usar `/branch` o `--fork-session` para bifurcar sesiones complejas
- Usar `/btw` para preguntas laterales sin interrumpir trabajo actual
- Al retomar, leer: `git log --oneline -5` + `git branch` + este CLAUDE.md
- Para trabajo paralelo: `git worktree add ../rstify-<task> feature/<name>`

## Multi-Repo Context

- `scafolding/` en `/home/yayo/projects/scafolding/` es la fuente original
- `Rstify` en `/home/yayo/projects/dev/Rstify/` es el repo activo
- `Bidilink_Nexus/services/frontend/` es la referencia de arquitectura original

## Next Session Start

Para retomar el desarrollo:

```sh
cd /home/yayo/projects/dev/Rstify
git checkout develop
cat ROADMAP.md           # Ver pending tasks
git log --oneline -5     # Ver último avance
bun run create.ts /tmp/verify -d  # Verificar que CLI sigue funcionando
```
