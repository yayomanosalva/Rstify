// Generador de vistas (páginas dentro de features)
// Uso: bun run src/config/view-generator.ts <feature-name> <view-name>

import { writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const featureName = process.argv[2];
const viewName = process.argv[3];

if (!featureName || !viewName) {
  console.error('Usage: bun run rsx:view <feature-name> <view-name>');
  process.exit(1);
}

const featureBasePath = join(process.cwd(), 'src', 'features', featureName);

if (!existsSync(featureBasePath)) {
  console.error(`Feature "${featureName}" not found at ${featureBasePath}`);
  process.exit(1);
}

const viewPascal = viewName
  .split(/[-_]/)
  .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
  .join('');

const pageContent = `// src/features/${featureName}/pages/${viewPascal}Page.tsx
export default function ${viewPascal}Page() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">${viewPascal}</h1>
    </div>
  );
}
`;

writeFileSync(join(featureBasePath, 'pages', `${viewPascal}Page.tsx`), pageContent);

console.log(`✓ View "${viewPascal}Page" generated in feature "${featureName}"`);
