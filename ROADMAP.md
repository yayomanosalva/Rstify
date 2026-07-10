# Rstify — Roadmap

## Fase 1: CLI + Template Base ✅ (Completada)

| Tarea | Estado |
|-------|--------|
| Repo GitHub configurado como template | ✅ |
| Scaffold base completo (86 files, configs, estructura feature-based) | ✅ |
| CLI interactivo (`create.ts` + `prompts.ts` con selector de features) | ✅ |
| Project generator (copia template + configura nombre, api url, puerto) | ✅ |
| Auth feature (context, ProtectedRoute, LoginForm, schemas, layout) | ✅ |
| Users CRUD feature (api, hooks, pages, components, types) | ✅ |
| Dashboard layout (sidebar, layout público) | ✅ |
| Routes generator (appRoutes.tsx dinámico según features) | ✅ |
| Template verificado: `bun install && bun run build` exitoso | ✅ |
| SSR server (Bun.serve con proxy, HMR, assets) | ✅ |
| Architecture prompt (`docs/ARCHITECTURE.md`) | ✅ |
| CLAUDE.md + ROADMAP.md + branching strategy | ✅ |
| Rama `develop` creada | ✅ |

---

## Fase 2: Generadores de Features

### [ ] Roles & Permissions
**Branch:** `feature/roles-generator`
- Crear `src/cli/generators/roles.ts`
- Template: `features/roles/` con api, hooks, pages, components
- Añadir a `prompts.ts` y `generateRoutes.ts`

### [ ] Market Intelligence
**Branch:** `feature/market-intelligence`
- Template con Eden Treaty client, filtros, tabla, detalle
- Hooks con React Query

### [ ] Alerts
**Branch:** `feature/alerts-generator`
- Template con create/edit modals

### [ ] Favorites
**Branch:** `feature/favorites-generator`

---

## Fase 3: CLI Avanzado

### [ ] Publicación npm (`bun create rstify`)
**Branch:** `cli/npm-publish`
- Configurar package.json para npm
- Probar `bun create rstify my-app`
- GitHub Actions para publish

### [ ] Flags CLI
**Branch:** `cli/advanced-flags`
- `--features auth,users`, `--api-url`, `--port`, `--output`

### [ ] Tests del CLI
**Branch:** `test/cli-unit-tests`
- Bun test runner para generators
- Test con proyecto generado

---

## Fase 4: Template Completo

### [ ] UI Components restantes
**Branch:** `feature/ui-components`
- Card, Badge, Avatar, Select, Dialog, DropdownMenu, Toast, Table, Skeleton

### [ ] Dashboard mejorado
**Branch:** `feature/dashboard-enhance`
- Sidebar navegable con Lucide icons
- Widgets, breadcrumbs

### [ ] E2E Tests (Playwright)
**Branch:** `test/template-e2e`
- Auth flow + Users CRUD

---

## Fase 5: DevOps y Documentación

### [ ] GitHub Actions CI
**Branch:** `ci/github-actions`
- Lint + typecheck + build template

### [ ] Contributing Guide
**Branch:** `docs/contributing`

---

## Cómo Continuar

```bash
git checkout develop
git checkout -b feature/<nombre>
# implementar...
bun run create.ts /tmp/verify -d
cd /tmp/verify && bun install && bun run build && bun run check
git add -A && git commit -m "feat: ..."
git checkout develop && git merge feature/<nombre>
```

**Prioridad recomendada:** `feature/roles-generator` → `test/cli-unit-tests` → `cli/npm-publish`
