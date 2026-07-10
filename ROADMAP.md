# Rstify — Roadmap

## Fase 1: Fundación ✅ (Completada)

| Tarea | Estado | Branch |
|-------|--------|--------|
| Repo en GitHub + Template | ✅ | `main` |
| Scaffold base (86 files) | ✅ | `main` |
| CLI interactivo (`create.ts` + `prompts.ts`) | ✅ | `main` |
| Project generator (`generators/project.ts`) | ✅ | `main` |
| Auth feature generator | ✅ | `main` |
| Users CRUD generator | ✅ | `main` |
| Dashboard layout generator | ✅ | `main` |
| Routes generator | ✅ | `main` |
| Template buildea correctamente | ✅ | `main` |
| README con instrucciones | ✅ | `main` |
| CLAUDE.md + ROADMAP.md | ✅ | `main` |
| Branch `develop` creada | ✅ | `develop` |

---

## Fase 2: Generadores de Features 🚧

### [ ] Roles & Permissions generator
**Branch:** `feature/roles-generator`
- [ ] Crear `src/cli/generators/roles.ts`
- [ ] Template: `features/roles/` con api, hooks, pages, components
- [ ] Template: PermissionMatrix, RoleForm, RoleTable
- [ ] Añadir a `prompts.ts` en la multiselect de features
- [ ] Añadir a `generateRoutes.ts` rutas de roles
- [ ] Verificar build del proyecto generado con roles

### [ ] Market Intelligence generator
**Branch:** `feature/market-intelligence`
- [ ] Template: `features/market-intelligence/` con filtros, tabla, detalle
- [ ] Template: Eden Treaty client + hooks con React Query
- [ ] Template: FiltersPanel, DataGrid, StatsCards
- [ ] Registrar en prompts + routes

### [ ] Alerts feature generator
**Branch:** `feature/alerts-generator`
- [ ] Template: `features/alerts/` con create/edit modals
- [ ] Template: hooks, types, pages
- [ ] Registrar en prompts + routes

### [ ] Favorites feature generator
**Branch:** `feature/favorites-generator`
- [ ] Template: `features/favorites/` básico
- [ ] Registrar en prompts + routes

---

## Fase 3: Mejoras del CLI

### [ ] Publicación npm
**Branch:** `cli/npm-publish`
- [ ] Configurar `package.json` del CLI para npm publish
- [ ] Probar `bun create rstify my-app`
- [ ] Añadir GitHub Actions para publish automático

### [ ] Non-interactive mode avanzado
**Branch:** `cli/advanced-flags`
- [ ] `--yes` flag con defaults + features específicas
- [ ] `--features auth,users` flag para CLI
- [ ] `--api-url`, `--port` flags
- [ ] `--output` o `-o` para directorio custom

### [ ] Mejoras UX del CLI
**Branch:** `cli/ux-improvements`
- [ ] Spinners durante copy/generate (ora/CLI spinner)
- [ ] Summary final con estructura del proyecto generado
- [ ] Colores y formato consistentes
- [ ] Mostrar errores con sugerencias

### [ ] Unit tests para CLI
**Branch:** `test/cli-unit-tests`
- [ ] Setup Bun test runner
- [ ] Test: project generator
- [ ] Test: routes generator
- [ ] Test: feature removal logic
- [ ] Test: prompts (con defaults mock)

---

## Fase 4: Templates y Calidad

### [ ] Dashboard layout mejorado
**Branch:** `feature/dashboard-enhance`
- [ ] Sidebar navegable con iconos (Lucide)
- [ ] DashboardContext con datos mock
- [ ] Widgets reusable pattern
- [ ] Breadcrumb component

### [ ] UI Components completos
**Branch:** `feature/ui-components`
- [ ] Card, Badge, Avatar, Select, Dialog
- [ ] DropdownMenu, Tooltip, Toast, Sheet
- [ ] Table con sort y paginación
- [ ] Skeleton loaders

### [ ] E2E Tests para template
**Branch:** `test/template-e2e`
- [ ] Playwright tests para auth flow
- [ ] Playwright tests para users CRUD
- [ ] CI workflow con Playwright

### [ ] i18n setup
**Branch:** `feature/i18n`
- [ ] Configurar react-i18next en template
- [ ] Ejemplo de traducciones EN/ES
- [ ] Hook useTranslation wrapper

---

## Fase 5: Documentación y DevOps

### [ ] GitHub Actions CI
**Branch:** `ci/github-actions`
- [ ] CI: lint + typecheck + build template
- [ ] CI: test CLI
- [ ] Release drafter

### [ ] Contributing guide
**Branch:** `docs/contributing`
- [ ] `CONTRIBUTING.md`
- [ ] Código de conducta
- [ ] Issue templates

### [ ] Template docs generator
**Branch:** `feature/docs-generator`
- [ ] Script que genera documentación del stack
- [ ] README del proyecto generado personalizado
- [ ] Ejemplos de uso de cada feature

---

## Cómo Continuar

1. **Leer este ROADMAP** y elegir la siguiente tarea
2. **Leer CLAUDE.md** para reglas y comandos
3. **Crear branch** desde develop:
   ```bash
   git checkout develop
   git checkout -b feature/<nombre>
   ```
4. **Implementar** siguiendo las convenciones del proyecto
5. **Verificar**:
   ```bash
   bun run create.ts /tmp/verify -d
   cd /tmp/verify && bun install && bun run build && bun run check
   ```
6. **Commit + Push**
7. **Merge a develop**
8. **Actualizar ROADMAP.md** marcando tareas completadas

### Prioridades recomendadas

1. `feature/roles-generator` — Ya tienes el patrón de auth/users, roles es similar
2. `test/cli-unit-tests` — Tests dan confianza para cambios grandes
3. `cli/npm-publish` — Para que funcione `bun create rstify`
4. `feature/ui-components` — Para que el template tenga componentes completos
5. `ci/github-actions` — Automatizar verificaciones
