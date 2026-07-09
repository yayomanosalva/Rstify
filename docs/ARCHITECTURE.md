# Prompt de Arquitectura Frontend - Bidilink

## Stack Tecnológico

### Core
- **Runtime:** Bun (>1.3.x) - package manager y runtime SSR
- **Framework:** React 19 con JSX automático (`react-jsx`)
- **Lenguaje:** TypeScript 5.8+ en modo strict
- **Build:** Rsbuild 1.3.x (ByteDance, sucesor de Rspack)
  - Plugin: `@rsbuild/plugin-react` con fastRefresh
  - Dual target: `web` (SPA) + `server` (SSR Node con Bun)

### UI y Estilos
- **Tailwind CSS v4** con `@tailwindcss/postcss` (PostCSS)
- **Radix Themes** (`@radix-ui/themes`) para theming global
- **Radix UI Primitives** para componentes accesibles (Dialog, DropdownMenu, Select, Popover, Tooltip, Toast, Sheet, Avatar, etc.)
- **shadcn/ui** estilo de componentes con `class-variance-authority` (CVA)
- **Lucide React** + **Heroicons** + **Radix Icons** para iconos
- **Framer Motion** para animaciones
- **Sonner** para toasts
- **Recharts** para gráficos
- **CSS Modules** (SCSS) para estilos específicos

### Estado y Data Fetching
- **TanStack React Query 5** para estado de servidor (con devtools en dev)
- **React Context** para estado de cliente (auth, theme, dashboard)
- **Zustand 5** disponible para estado global complejo
- **TanStack React Table** para tablas avanzadas

### Routing
- **React Router DOM 6.20.1** con `createBrowserRouter` y `useRoutes`
- Lazy loading con `React.lazy()` + `Suspense` en TODAS las páginas
- Breadcrumbs via `handle: { breadcrumb: string | function }`
- Rutas protegidas con guard `ProtectedRoute` por roles

### Formularios y Validación
- **TanStack React Form** (`@tanstack/react-form`) para formularios
- **Zod** para validación de schemas (forms + config)
- Input OTP para códigos

### API
- **Axios** con interceptores (auth token + refresh automático en 401)
- **Elysia Eden Treaty** (`@elysiajs/eden`) para API type-safe (SECOP)
- Patrón de retry queue para refresh token concurrente

### Testing
- **Playwright** para E2E (único framework de testing)

### Code Quality
- **Biome** (linter + formatter principal) - single quotes, spaces
- **ESLint 9** con React + Hooks rules
- **Prettier** como respaldo

---

## Arquitectura: Feature-based Modular

```
src/
  app/                    # Páginas de aplicación
    (main)/               # Layout con sidebar para rutas protegidas
      dashboard/          # Páginas internas del layout dashboard
    layout.tsx            # Layout principal (Helmet + ThemeWrapper)
    page.tsx              # Home page pública
    error/                # ErrorBoundary fallback
    not-found/            # 404
    unauthorized/         # Acceso denegado
    ErrorBoundary.tsx     # Class component ErrorBoundary
  config/                 # Configuración global
    appRoutes.tsx         # Definición de rutas (RouteObject[])
    constants.ts          # Assets paths, nav items
    index.ts              # Config validada con Zod, env vars
    module-generator.ts   # Generador de features
    view-generator.ts     # Generador de vistas
  features/               # Módulos feature-based
    <feature>/
      api/                # Llamadas API (Axios/Eden)
      components/         # Componentes específicos del feature
      context/            # Contexto React del feature
      hooks/              # Hooks personalizados (React Query wrappers)
      pages/              # Componentes de página
      schemas/            # Schemas Zod
      types/              # Tipos TypeScript
      layout/             # Layouts específicos
      constants/          # Constantes del feature
  shared/                 # Capa compartida
    api/                  # Clientes API compartidos
      clients/            # Instancias Axios por dominio
    components/           # Componentes compartidos
      ui-ux/              # Primitivas UI (Button, Input, Modal, Table, etc.)
      layout/             # Layouts (MainLayout, Sidebar, Breadcrumbs)
      common/             # Componentes comunes (NavBar, PageMeta)
      home/               # Secciones de landing page
    context/              # Contextos compartidos (Theme)
    hooks/                # Hooks compartidos (useDebounce, useBreadcrumb)
    http/                 # Capa HTTP con interceptors
    lib/                  # Utilidades (cn(), router helpers)
    providers/            # AppProviders wrapper
    styles/               # Estilos globales
      globals.css         # Tailwind base + design tokens HSL
    types/                # Tipos globales (Window, API responses)
    utils/                # Utilidades (format, logger)
```

---

## Patrones Clave

### 1. Estructura de Feature

Cada feature sigue esta estructura consistente:

```
features/<nombre>/
  api/           # Llamadas API (opcional, si tiene API propia)
  components/    # Componentes del feature
  hooks/         # Hooks (React Query wrappers)
  pages/         # Páginas (una por ruta)
  types.ts       # Tipos del feature
  schemas/       # Schemas Zod (opcional)
```

### 2. Data Flow Pattern

```
Page Component
  -> Hook personalizado (useUsers, useRoles, etc.)
    -> TanStack Query (useQuery/useMutation)
      -> API Client (Axios instance o Eden Treaty)
        -> HTTP Request (con Bearer token)
          -> Backend API
```

### 3. API Client Pattern

**Axios:**
```typescript
// shared/api/clients/restClient.ts
export const restClient = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
})
// Interceptor request: attach Bearer token del localStorage
// Interceptor response: on 401 -> refresh token queue
```

**Feature API Layer:**
```typescript
// features/users/api/usersApi.ts
export const usersApi = {
  getAll: async (params?: UserFilters) => {
    const response = await axiosInstance.get<{data: User[], total: number}>('/users', { params })
    return response.data
  },
  getById: async (id: string) => { ... },
  create: async (data: CreateUserDto) => { ... },
  update: async (id: string, data: UpdateUserDto) => { ... },
  delete: async (id: string) => { ... },
}
```

### 4. React Query Hook Pattern

```typescript
// features/users/hooks/useUsers.ts
export function useUsers(filters: UserFilters) {
  return useQuery({
    queryKey: ['users', filters],
    queryFn: () => usersApi.getAll(filters),
    staleTime: 5 * 60 * 1000,
    select: (data) => ({
      users: data.data,
      total: data.total,
    }),
  })
}
```

### 5. Auth Pattern

```typescript
// AuthContext.tsx - Provider que envuelve la app
type User = {
  id: string
  name: string
  email: string
  roles: string[]
  status: 'active' | 'inactive' | 'pending'
}

type AuthContextType = {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>
  logout: () => Promise<void>
  register: (data: RegisterData) => Promise<void>
  isLoading: boolean
  error: string | null
}
// Almacena: auth_token, refresh_token, user_role, user_data en localStorage
// Restaura sesión en useEffect al montar
```

### 6. Protected Route Pattern

```typescript
<ProtectedRoute roles={['admin']}>
  <DashboardLayout />
</ProtectedRoute>
// Verifica: autenticado? -> activo? -> rol permitido? -> render
// Redirige a /unauthorized o /login?redirect=... según el caso
```

### 7. Route Definition Pattern

```typescript
// config/appRoutes.tsx
const routes: RouteObject[] = [
  { path: '/', element: <HomePage />, handle: { breadcrumb: 'Inicio' } },
  {
    element: <ProtectedRoute roles={['admin']}><DashboardLayout /></ProtectedRoute>,
    children: [
      { path: 'dashboard', element: <DashboardPage />, handle: { breadcrumb: 'Dashboard' } },
      {
        path: 'users',
        children: [
          { index: true, element: <UsersPage /> },
          { path: ':id', element: <UserDetailPage /> },
        ],
      },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
]
```

### 8. Form Pattern (TanStack React Form + Zod)

```typescript
const form = useForm<LoginInput>({
  defaultValues: { email: '', password: '' },
  onSubmit: async ({ value }) => {
    const validated = loginSchema.parse(value)
    await login(validated)
  },
})

<form.Field name="email">
  {(field) => (
    <div>
      <label>Email</label>
      <input
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
      />
    </div>
  )}
</form.Field>
```

### 9. UI Component Pattern (CVA + Radix Slot)

```typescript
const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium ...',
  {
    variants: {
      variant: { default: 'bg-primary ...', destructive: '...', outline: '...', ghost: '...' },
      size: { default: 'h-10 px-4', sm: 'h-9 px-3', lg: 'h-11 px-8', icon: 'h-10 w-10' },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
)

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  },
)
```

### 10. Estilos y Convenciones

**Nombres:**
- Directorios: kebab-case (`market-intelligence/`)
- Componentes: PascalCase (`LoginForm.tsx`)
- Hooks/utils: camelCase (`useUsers.ts`, `format.ts`)
- Tipos: PascalCase (`UserFilters`)
- Constantes: UPPER_SNAKE o PascalCase (`ASSETS`, `NAV_ITEMS`)

**CSS:**
- Tailwind utility classes directamente en className
- Design tokens HSL en `globals.css` (variables CSS)
- `cn()` utility con clsx + tailwind-merge para merges
- CVA para variantes de componentes

**Imports:**
- Path aliases: `@/` -> `src/`, `@features/` -> `src/features/`, `@shared/` -> `src/shared/`
- Barrel exports en `ui-ux/index.tsx`
- `import type` para type-only imports
- Named exports para hooks/utils
- Default exports para pages/layouts

**Error Handling:**
- try/catch en mutations con mensajes de error del backend
- Axios interceptor para 401 global (auto-refresh)
- ErrorBoundary class component wrapping Routes
- Páginas de error: 404, unauthorized

---

## Instrucciones para Generar Código

Cuando generes código para este proyecto:

1. **Siempre usa TypeScript strict** con los path aliases configurados (`@/`, `@features/`, `@shared/`, etc.)
2. **No agregues comentarios** a menos que sea estrictamente necesario
3. **Usa Tailwind CSS v4** para estilos (no SCSS modules a menos que sea necesario)
4. **Usa `cn()` utility** para combinar clases condicionalmente
5. **Usa CVA** para componentes con variantes
6. **Sigue la estructura feature-based**: cada feature en `src/features/<name>/`
7. **React Query** para toda comunicación con API
8. **Lazy loading** con `React.lazy()` para todas las páginas
9. **Zod** para validación de schemas
10. **Sigue los patrones de exportación**: named exports para hooks y utils, default exports para pages
11. **Convención de imports**: `import type` para tipos, barrel imports para UI components
12. **Formatea con Biome**: single quotes, spaces
