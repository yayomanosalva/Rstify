import prompts from 'prompts';

const { dim } = (await import('kleur')).default;

export interface Answers {
  projectName: string;
  apiUrl: string;
  port: number;
  features: string[];
  tests: boolean;
  docker: boolean;
}

export async function runPrompts(defaultName?: string): Promise<Answers> {
  const questions: prompts.PromptObject[] = [
    {
      type: 'text',
      name: 'projectName',
      message: 'Project name:',
      initial: defaultName || 'my-app',
      validate: (value: string) =>
        /^[a-z0-9_-]+$/.test(value)
          ? true
          : 'Only lowercase letters, numbers, hyphens and underscores allowed',
    },
    {
      type: 'text',
      name: 'apiUrl',
      message: 'API URL:',
      initial: 'http://localhost:4000/api/v1',
    },
    {
      type: 'number',
      name: 'port',
      message: 'Dev server port:',
      initial: 9400,
      min: 1,
      max: 65535,
    },
    {
      type: 'multiselect',
      name: 'features',
      message: 'Select features to include:',
      choices: [
        { title: 'Auth (login, register, protected routes)', value: 'auth', selected: true },
        { title: 'Users CRUD (list, create, edit, delete)', value: 'users', selected: true },
        { title: 'Dashboard layout (sidebar + layout)', value: 'dashboard', selected: true },
      ],
      hint: 'Space to toggle, Enter to confirm',
      instructions: false,
    },
    {
      type: 'confirm',
      name: 'tests',
      message: 'Include Playwright E2E tests?',
      initial: true,
    },
    {
      type: 'confirm',
      name: 'docker',
      message: 'Include Docker configuration?',
      initial: false,
    },
  ];

  const response = await prompts(questions, {
    onCancel: () => {
      console.log(dim('\n  Cancelled.'));
      process.exit(0);
    },
  });

  return {
    projectName: response.projectName || defaultName || 'my-app',
    apiUrl: response.apiUrl || 'http://localhost:4000/api/v1',
    port: response.port || 9400,
    features: response.features || ['auth', 'users', 'dashboard'],
    tests: response.tests ?? true,
    docker: response.docker ?? false,
  } as Answers;
}

export function getDefaultAnswers(projectName: string): Answers {
  return {
    projectName,
    apiUrl: 'http://localhost:4000/api/v1',
    port: 9400,
    features: ['auth', 'users', 'dashboard'],
    tests: false,
    docker: false,
  };
}
