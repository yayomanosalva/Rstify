import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import type { Answers } from '../prompts';

export function generateAuth(templateDir: string, targetDir: string, answers: Answers) {
  // Auth template is already in the base template
  // No additional files needed, but we could customize auth settings here
}
