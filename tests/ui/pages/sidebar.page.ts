import { expect, type Locator, type Page } from '@playwright/test';

export type SidebarPageName =
  | 'Clients'
  | 'Library'
  | 'Inbox'
  | 'Automation'
  | 'On-demand'
  | 'Community Forums'
  | 'Payment & Packages'
  | 'BI Dashboard'
  | 'Ask Olly'
  | 'Quick Start Guide';

const sidebarHrefByName: Record<SidebarPageName, string> = {
  Clients: '/home/client',
  Library: '/home/workout',
  Inbox: '/home/inbox',
  Automation: '/home/onboarding-flow',
  'On-demand': '/home/studio-collection',
  'Community Forums': '/home/forums',
  'Payment & Packages': '/home/packages',
  'BI Dashboard': '/home/bi-dashboard',
  'Ask Olly': '/home/ask-olly',
  'Quick Start Guide': '/home/getting-started?view=quick-start-guide',
};

export class Sidebar {
  constructor(private readonly page: Page) {}

  private linkByHref(href: string): Locator {
    // selector bền: dựa vào href
    return this.page.locator(`.app-left-sidebar a[href="${href}"]`);
  }

  async navigateTo(target: SidebarPageName) {
    const href = sidebarHrefByName[target];
    const link = this.linkByHref(href);

    await expect(link).toBeVisible({ timeout: 20_000 });
    await link.click();

    // wait URL theo href (không phụ thuộc baseURL)
    await this.page.waitForURL(`**${href}**`, {
      waitUntil: 'domcontentloaded',
      timeout: 60_000,
    });
  }
}
