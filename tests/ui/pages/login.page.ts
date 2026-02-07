import { expect, type Locator, type Page } from '@playwright/test';
import { routes } from '../../../routes';

export class LoginPage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly clientsTitle: Locator;

  constructor(private readonly page: Page) {
    this.emailInput = page.getByPlaceholder('Your Email Address');
    this.passwordInput = page.getByPlaceholder('Password');
    this.submitButton = page.getByRole('button', { name: /^login$/i });
    this.clientsTitle = page.locator('.client-head', { hasText: /Clients/i });
  }

  async login(timeout = 60_000) {
    const email = process.env.TEST_EMAIL;
    const password = process.env.TEST_PASSWORD;
    if (!email || !password) throw new Error('Missing TEST_EMAIL or TEST_PASSWORD in .env');

    await this.page.goto(routes.login, { waitUntil: 'domcontentloaded', timeout });

    await expect(this.emailInput).toBeVisible({ timeout });
    await expect(this.passwordInput).toBeVisible({ timeout });
    await expect(this.submitButton).toBeVisible({ timeout });

    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);

    // click and wait for "client" page
    await this.submitButton.click();
    await expect(this.clientsTitle).toBeVisible({ timeout });
  }
}
