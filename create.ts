#!/usr/bin/env bun
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'fs';
import { join, resolve } from 'path';
import { runPrompts, getDefaultAnswers, type Answers } from './src/cli/prompts';
import { generateProject } from './src/cli/generators/project';
import { generateAuth } from './src/cli/generators/auth';
import { generateUsers } from './src/cli/generators/users';
import { generateDashboard } from './src/cli/generators/dashboard';
import { generateRoutes } from './src/cli/generators/routes';

const { bold, green, cyan, dim } = (await import('kleur')).default;

function readDirRecursive(dir: string): string[] {
  const entries = readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...readDirRecursive(full));
    } else {
      files.push(full);
    }
  }
  return files;
}

import { readdirSync } from 'fs';

async function main() {
  const args = process.argv.slice(2);
  const useDefaults = args.includes('--defaults') || args.includes('-d');
  const projectNameArg = args
    .find((a) => !a.startsWith('-'))
    ?.replace(/[^a-z0-9_-]/gi, '-')
    .toLowerCase();

  console.log();
  console.log(bold().cyan('  ╭─────────────────────────────╮'));
  console.log(bold().cyan('  │        Rstify v1.0          │'));
  console.log(bold().cyan('  │  React + Rsbuild scaffold   │'));
  console.log(bold().cyan('  ╰─────────────────────────────╯'));
  console.log();

  let answers: Answers;

  if (useDefaults && projectNameArg) {
    answers = getDefaultAnswers(projectNameArg);
  } else if (!process.stdin.isTTY) {
    const name = projectNameArg || 'my-app';
    answers = getDefaultAnswers(name);
  } else {
    answers = await runPrompts(projectNameArg);
  }

  const targetDir = resolve(process.cwd(), answers.projectName);

  if (existsSync(targetDir)) {
    console.error(dim(`  ⚠ Directory "${answers.projectName}" already exists.`));
    process.exit(1);
  }

  console.log(cyan(`  Creating project: ${bold(answers.projectName)}`));
  console.log(cyan(`  Target: ${targetDir}`));
  console.log();

  mkdirSync(targetDir, { recursive: true });

  const templateDir = join(import.meta.dir, 'template');

  if (!existsSync(templateDir)) {
    console.error(dim('  ✗ Template directory not found at:', templateDir));
    process.exit(1);
  }

  // 1. Copy base template
  console.log(dim('  Copying base template...'));
  generateProject(templateDir, targetDir, answers);

  // 2. Routes generator
  console.log(dim('  Configuring routes...'));
  generateRoutes(targetDir, answers);

  // 3. Remove unselected features
  if (!answers.features.includes('auth')) {
    const authDir = join(targetDir, 'src', 'features', 'auth');
    if (existsSync(authDir)) rmSync(authDir, { recursive: true, force: true });
  }

  if (!answers.features.includes('users')) {
    const usersDir = join(targetDir, 'src', 'features', 'users');
    if (existsSync(usersDir)) rmSync(usersDir, { recursive: true, force: true });
  }

  if (!answers.features.includes('dashboard')) {
    const dashboardDir = join(targetDir, 'src', 'app', '(main)');
    if (existsSync(dashboardDir)) rmSync(dashboardDir, { recursive: true, force: true });
  }

  // 4. Remove test files if not selected
  if (!answers.tests) {
    const testsDir = join(targetDir, 'tests');
    if (existsSync(testsDir)) rmSync(testsDir, { recursive: true, force: true });
    const pwc = join(targetDir, 'playwright.config.ts');
    if (existsSync(pwc)) rmSync(pwc);
  }

  // 5. Remove Docker files if not selected
  if (!answers.docker) {
    ['Dockerfile', 'Dockerfile.dev', 'nginx.conf'].forEach((f) => {
      const p = join(targetDir, f);
      if (existsSync(p)) rmSync(p);
    });
  }

  console.log();
  console.log(green('  ✓ Project created successfully!'));
  console.log();
  console.log('  Next steps:');
  console.log(bold(`    cd ${answers.projectName}`));
  console.log('    bun install');
  console.log('    bun run dev');
  console.log();
}

main().catch((err) => {
  console.error('  ✗ Error:', err.message);
  process.exit(1);
});
