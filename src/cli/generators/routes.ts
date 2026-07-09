import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import type { Answers } from '../prompts';

export function generateRoutes(targetDir: string, answers: Answers) {
  const routesPath = join(targetDir, 'src', 'config', 'appRoutes.tsx');

  if (!existsSync(routesPath)) return;

  const hasAuth = answers.features.includes('auth');
  const hasUsers = answers.features.includes('users');
  const hasDashboard = answers.features.includes('dashboard');

  let content = readFileSync(routesPath, 'utf-8');

  // The base template has all routes defined. We need to remove the ones
  // for unselected features by replacing the route blocks with empty strings.

  if (!hasAuth) {
    // Remove auth-related imports and route definitions for login/register
    content = content.replace(
      /\/\/ Auth routes[\s\S]*?\/\/ .*?Public routes|/, 
      ''
    );
  }

  if (!hasUsers) {
    // Remove users page import and route definition
    content = content.replace(
      /import UsersPage[\s\S]*?from.*?\n/, 
      ''
    );
    content = content.replace(
      /const UserDetailPage[\s\S]*?from.*?\n/, 
      ''
    );
    content = content.replace(
      /{\s*path: 'users',[\s\S]*?},\s*/, 
      ''
    );
  }

  writeFileSync(routesPath, content);
}
