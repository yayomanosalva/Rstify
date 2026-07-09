import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join, relative } from 'path';
import type { Answers } from '../prompts';

function copyRecursive(src: string, dest: string, baseSrc: string) {
  const entries = readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = join(src, entry.name);
    const destPath = join(dest, entry.name);

    if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === 'dist' || entry.name === '.rsbuild-cache') {
      continue;
    }

    if (entry.isDirectory()) {
      mkdirSync(destPath, { recursive: true });
      copyRecursive(srcPath, destPath, baseSrc);
    } else {
      const content = readFileSync(srcPath, 'utf-8');
      writeFileSync(destPath, content);
    }
  }
}

import { readdirSync, rmSync } from 'fs';

export function generateProject(templateDir: string, targetDir: string, answers: Answers) {
  // Copy entire template
  copyRecursive(templateDir, targetDir, templateDir);

  // Update package.json with project name
  const pkgPath = join(targetDir, 'package.json');
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
  pkg.name = answers.projectName;
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');

  // Create .env from .env.example
  const envExamplePath = join(targetDir, '.env.example');
  if (existsSync(envExamplePath)) {
    let envContent = readFileSync(envExamplePath, 'utf-8');
    envContent = envContent.replace(/ROOT_PUBLIC_API_URL=.*/, `ROOT_PUBLIC_API_URL=${answers.apiUrl}`);
    envContent = envContent.replace(/PORT=.*/, `PORT=${answers.port}`);
    const envPath = join(targetDir, '.env');
    writeFileSync(envPath, envContent);
  }

  // Update rsbuild.config.ts port
  const rsbuildPath = join(targetDir, 'rsbuild.config.ts');
  let rsbuildContent = readFileSync(rsbuildPath, 'utf-8');
  rsbuildContent = rsbuildContent.replace(/port:.*?,/, `port: ${answers.port},`);
  writeFileSync(rsbuildPath, rsbuildContent);
}
