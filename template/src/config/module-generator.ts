// Generador de features (módulos)
// Uso: bun run src/config/module-generator.ts
// Genera la estructura completa de una feature

import { mkdirSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const featureName = process.argv[2];
if (!featureName) {
  console.error('Usage: bun run rsx:module <feature-name>');
  process.exit(1);
}

const basePath = join(process.cwd(), 'src', 'features', featureName);

if (existsSync(basePath)) {
  console.error(`Feature "${featureName}" already exists at ${basePath}`);
  process.exit(1);
}

const dirs = ['api', 'components', 'hooks', 'pages'];

dirs.forEach((dir) => mkdirSync(join(basePath, dir), { recursive: true }));

const featureNamePascal = featureName
  .split(/[-_]/)
  .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
  .join('');

// Types file
writeFileSync(
  join(basePath, 'types.ts'),
  `// src/features/${featureName}/types.ts

export interface ${featureNamePascal} {
  id: string;
  name: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Create${featureNamePascal}Dto {
  name: string;
}

export interface Update${featureNamePascal}Dto {
  name?: string;
}

export interface ${featureNamePascal}Filters {
  page?: number;
  limit?: number;
  search?: string;
}
`,
);

// API file
writeFileSync(
  join(basePath, 'api', `index.ts`),
  `// src/features/${featureName}/api/index.ts
import axiosInstance from '@/shared/http/axiosInstance';
import type { Create${featureNamePascal}Dto, Update${featureNamePascal}Dto, ${featureNamePascal}, ${featureNamePascal}Filters } from '../types';

export const ${featureName}Api = {
  getAll: async (params?: ${featureNamePascal}Filters) => {
    const response = await axiosInstance.get<{ data: ${featureNamePascal}[]; total: number }>('/${featureName}', { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await axiosInstance.get<${featureNamePascal}>(\`/$\{featureName}/$\{id}\`);
    return response.data;
  },

  create: async (data: Create${featureNamePascal}Dto) => {
    const response = await axiosInstance.post<${featureNamePascal}>('/${featureName}', data);
    return response.data;
  },

  update: async (id: string, data: Update${featureNamePascal}Dto) => {
    const response = await axiosInstance.patch<${featureNamePascal}>(\`/$\{featureName}/$\{id}\`, data);
    return response.data;
  },

  delete: async (id: string) => {
    await axiosInstance.delete(\`/$\{featureName}/$\{id}\`);
  },
};
`,
);

// Hooks file
writeFileSync(
  join(basePath, 'hooks', 'index.ts'),
  `// src/features/${featureName}/hooks/index.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ${featureName}Api } from '../api';
import type { ${featureNamePascal}Filters } from '../types';

export function use${featureNamePascal}List(filters: ${featureNamePascal}Filters = { page: 1, limit: 10 }) {
  return useQuery({
    queryKey: ['${featureName}', filters],
    queryFn: () => ${featureName}Api.getAll(filters),
    staleTime: 5 * 60 * 1000,
    select: (data) => ({
      items: data.data,
      total: data.total,
    }),
  });
}

export function use${featureNamePascal}(id: string) {
  return useQuery({
    queryKey: ['${featureName}', id],
    queryFn: () => ${featureName}Api.getById(id),
    enabled: !!id,
  });
}

export function useCreate${featureNamePascal}() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ${featureName}Api.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['${featureName}'] });
    },
  });
}

export function useUpdate${featureNamePascal}() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Update${featureNamePascal}Dto }) =>
      ${featureName}Api.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['${featureName}'] });
    },
  });
}

export function useDelete${featureNamePascal}() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ${featureName}Api.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['${featureName}'] });
    },
  });
}
`,
);

// Page file
writeFileSync(
  join(basePath, 'pages', `${featureNamePascal}Page.tsx`),
  `// src/features/${featureName}/pages/${featureNamePascal}Page.tsx
import { useState } from 'react';
import { use${featureNamePascal}List } from '../hooks';

export default function ${featureNamePascal}Page() {
  const [filters, setFilters] = useState({ page: 1, limit: 10 });
  const { data, isLoading } = use${featureNamePascal}List(filters);

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">${featureNamePascal}</h1>
      
      {isLoading && <p>Loading...</p>}
      
      {data && (
        <div className="grid gap-4">
          {data.items.map((item) => (
            <div key={item.id} className="p-4 border rounded">
              {item.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
`,
);

// Component placeholder
writeFileSync(
  join(basePath, 'components', `${featureNamePascal}List.tsx`),
  `// src/features/${featureName}/components/${featureNamePascal}List.tsx
export function ${featureNamePascal}List() {
  return <div>${featureNamePascal}List component</div>;
}
`,
);

console.log(`✓ Feature "${featureName}" generated at ${basePath}`);
console.log(`  Structure:`);
console.log(`    api/index.ts`);
console.log(`    components/${featureNamePascal}List.tsx`);
console.log(`    hooks/index.ts`);
console.log(`    pages/${featureNamePascal}Page.tsx`);
console.log(`    types.ts`);
