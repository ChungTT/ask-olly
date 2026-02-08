import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config();

const BASE_URL = process.env.BASE_URL ?? 'https://dev.everfit.io/login';

const commonUse = {
  //headless: !!process.env.CI,
  baseURL: BASE_URL,
  trace: 'on-first-retry' as const,
  httpCredentials: process.env.BASIC_AUTH_USER
    ? {
        username: process.env.BASIC_AUTH_USER,
        password: process.env.BASIC_AUTH_PASS ?? '',
      }
    : undefined,
};

export default defineConfig({
  testDir: path.resolve('tests'),
  workers: 1,         
  fullyParallel: false,
  retries: process.env.CI ? 2 : 0,
  reporter: [['html', { open: 'never' }], ['list']],

  use: commonUse,

  projects: [
    {
      name: 'ui',
      testDir: path.resolve('tests/ui/specs'),
      use: {
        ...commonUse,
        ...devices['Desktop Chrome'],
      },
    },
    {
      name: 'api',
      testDir: path.resolve('tests/api/specs'),
      use: {
        ...commonUse,
      },
    },
  ],
});
