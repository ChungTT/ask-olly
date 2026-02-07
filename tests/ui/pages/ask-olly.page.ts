import { expect, type Locator, type Page } from '@playwright/test';
import { UiUtils } from '../helpers/ui-utils';

export class AskOllyPage {
  readonly page: Page;
  readonly helloHeading: Locator;

  // Draft.js editor (contenteditable)
  readonly editorInput: Locator;
  readonly sendButton: Locator;
  readonly askPlaceholder: Locator;

  // Example section + anchors (span.highlight)
  readonly tryExampleSection: Locator;
  readonly exampleAnchors: Locator;

  // Chat area (after send)
  readonly chatArea: Locator;

  // Everfit response paragraphs (stable anchor from HTML)
  readonly everfitResponseBlock: Locator;

  // Mention options (dynamic id: mention-option-xxxx-0)
  readonly mentionOptions: Locator;
  readonly mentionOptionByText: (text: string) => Locator;

  // New Chat button + popup
  readonly newChatButton: Locator;
  readonly newChatConfirmModal: Locator;
  readonly newChatOkButton: Locator;
  readonly newChatCancelButton: Locator;


  constructor(page: Page) {
    this.page = page;
    this.helloHeading = page.getByRole('heading', { name: /^Hello,/ });
    this.askPlaceholder = page.locator('#placeholder-evf-ai-mention-editor');
    this.sendButton = page.locator('#ai-chat-send-button');
    this.editorInput = page.locator('.public-DraftEditor-content[contenteditable="true"]');
    

    // Try example section
    this.tryExampleSection = page.locator('#ai-chat-try-example');
    this.exampleAnchors = this.tryExampleSection.locator('span.highlight:text("Client")');

    // Chat
    this.chatArea = page.locator('main');

    // Everfit response: newest message based on ai-chat-reaction-message
    this.everfitResponseBlock = this.chatArea
      .locator('.ai-chat-reaction-message')
      .last()
      .locator('xpath=preceding-sibling::div[1]//p');

    // Mention options: 
    this.mentionOptions = page.locator('[id^="mention-option-"]');
    this.mentionOptionByText = (text: string) =>
      page.locator('[id^="mention-option-"]').filter({ hasText: text }).first();

    // New Chat button (stable from your HTML)
    this.newChatButton = page
      .locator('div[data-ai-chat-header="true"]')
      .getByRole('button', { name: /new chat/i });

    // Confirm popup DIV only (avoid strict mode w/ IMG using same class)
    this.newChatConfirmModal = page.locator('div.confirm-popup-container.new-chat-confirm-modal');
    this.newChatOkButton = this.newChatConfirmModal.getByRole('button', { name: /^OK$/ });
    this.newChatCancelButton = this.newChatConfirmModal.getByRole('button', { name: /^Cancel$/ });
  }

  async goto(timeout = 60_000) {
    await this.page.goto('https://dev.everfit.io/home/ask-olly', {
      waitUntil: 'domcontentloaded',
      timeout,
    });
  }

  // TC-01: Verify Ask Olly initial screen
  async verifyInitialScreen(expectedName?: string, timeout = 60_000) {
    if (expectedName) {
      await expect(
        this.page.getByRole('heading', { name: new RegExp(`^Hello,\\s*${expectedName}\\.`) })
      ).toBeVisible({ timeout });
    } else {
      await expect(this.helloHeading).toBeVisible({ timeout });
    }
    await expect(this.askPlaceholder).toBeVisible({ timeout });
    await expect(this.askPlaceholder).toHaveText('Ask me anything...', { timeout });
    await expect(this.sendButton).toBeDisabled({ timeout });
    await expect(this.tryExampleSection).toBeVisible({ timeout });
    await expect(this.exampleAnchors.first()).toBeVisible({ timeout });
  }

  // TC-02 Verify sending question with selecting client
  // TC-03 Verify sending question without selecting client
  async sendQuestion(question: string, clientName?: string, timeout = 60_000) {
    await expect(this.editorInput).toBeVisible({ timeout });
    await this.editorInput.click();
    await this.page.keyboard.type(question);
    if (clientName) {
      // Trigger mention dropdown
      await this.page.keyboard.type(' @');
      await this.selectClientFromMention(clientName, timeout);
    }
    await expect(this.sendButton).toBeEnabled({ timeout });
    await this.sendButton.click();
    
  }
  async selectClientFromMention(clientName: string, timeout = 60_000) {
    // Wait dropdown mention appears (at least one option visible)
    await expect(this.mentionOptions.first()).toBeVisible({ timeout });
    const option = this.mentionOptionByText(clientName);
    await expect(option).toBeVisible({ timeout });
    await option.click();
  }
  async verifyQuestionAndResponse(question: string, timeout = 60_000) {
    // 1) Question visible in chat area
    const questionNode = this.chatArea.getByText(question, { exact: false }).last();
    await expect(questionNode).toBeVisible({ timeout });

    // 2) Có label "Everfit" xuất hiện SAU question đó
    const everfitLabel = questionNode.locator(
      'xpath=following::div[normalize-space(.)="Everfit"][1]'
    );
    await expect(everfitLabel).toBeVisible({ timeout });

    // 3) Answer block có text (div ngay sau label Everfit)
    const answerBlock = everfitLabel.locator('xpath=following-sibling::*[1]');
    await expect(answerBlock).toBeVisible({ timeout });

    // Poll cho tới khi answer có nội dung thật (tránh rỗng lúc đang streaming/render)
    await expect
      .poll(async () => (await answerBlock.innerText()).trim().length, { timeout })
      .toBeGreaterThan(0);
    
    await this.page.waitForTimeout(3000); // pause a few seconds to debug visually
  }

  // TC-04: Send Example card without selecting client
  // TC-05: Send Example card with selecting client
  private exampleCardContainerByIndex(index: number) {
    return this.exampleAnchors.nth(index).locator('xpath=ancestor::div[1]');
  }
  async getExampleCardText(index = 0, timeout = 60_000) {
    await expect(this.tryExampleSection).toBeVisible({ timeout });
    await expect(this.exampleAnchors.nth(index)).toBeVisible({ timeout });
    const card = this.exampleCardContainerByIndex(index);
    await expect(card).toBeVisible({ timeout });
    const raw = await card.innerText();
    return UiUtils.normalizeText(raw);
  }

  async clickExampleCard(index = 0, timeout = 60_000) {
    await expect(this.tryExampleSection).toBeVisible({ timeout });
    const anchor = this.exampleAnchors.nth(index);
    await expect(anchor).toBeVisible({ timeout });

    // Click fallback on ancestors (UI handler might be attached higher)
    const candidates = [
      anchor.locator('xpath=ancestor::div[1]'),
      anchor.locator('xpath=ancestor::div[2]'),
      anchor.locator('xpath=ancestor::div[3]'),
      anchor.locator('xpath=ancestor::div[4]'),
    ];

    for (const c of candidates) {
      if (await c.isVisible()) {
        try {
          await c.click({ timeout: 5_000 });
          return;
        } catch {
          // try next
        }
      }
    }

    await anchor.click({ timeout });
  }
  

async selectClientFromSearchInput(clientName: string, timeout = 60_000) {
  const name = clientName.trim();
  const searchInput = this.page.getByPlaceholder('Search client');
  await expect(searchInput).toBeVisible({ timeout });
  await searchInput.fill(name);
  const container = this.page.locator('#evf-ai-custom-entry-component');
  await expect(container).toBeVisible({ timeout });
  const optionByName = container
    .locator('.evf-mention-entry__name', { hasText: name })
    .first();
  const optionFallback = container.getByText(name, { exact: false }).first();
  if (await optionByName.count()) {
    await expect(optionByName).toBeVisible({ timeout });
    await optionByName.click();
  } else {
    await expect(optionFallback).toBeVisible({ timeout });
    await optionFallback.click();
  }
  await expect(container).toBeHidden({ timeout }).catch(() => {});
}

  async sendExampleCard(index = 0, clientName?: string, timeout = 60_000) {
    const exampleText = await this.getExampleCardText(index, timeout);
    await this.clickExampleCard(index, timeout);
    if(clientName) {
      await this.selectClientFromSearchInput(clientName, timeout);
    }
    await expect(this.sendButton).toBeEnabled({ timeout });
    await this.sendButton.click();

    return exampleText;
  }

  // TC-06: New Chat button + confirm OK
  // TC-07: New Chat button + confirm Cancel
  async clickNewChatAndConfirmOk(timeout = 60_000) {
    await expect(this.newChatButton).toBeVisible({ timeout });
    await this.newChatButton.click();
    await expect(this.newChatConfirmModal).toBeVisible({ timeout });
    await this.newChatOkButton.click();
    await expect(this.newChatConfirmModal).toBeHidden({ timeout });
  }

  async clickNewChatAndCancel(timeout = 60_000) {
    await expect(this.newChatButton).toBeVisible({ timeout });
    await this.newChatButton.click();
    await expect(this.newChatConfirmModal).toBeVisible({ timeout });
    await this.newChatCancelButton.click();
    await expect(this.newChatConfirmModal).toBeHidden({ timeout });
  }

  async verifyChatReset(previousQuestionText: string, timeout = 60_000) {
    // Old message gone
    await expect(this.chatArea.getByText(previousQuestionText, { exact: false })).toHaveCount(0);
    // Input cleared
    await expect(this.askPlaceholder).toBeVisible({ timeout });
    await expect(this.sendButton).toBeDisabled({ timeout });
    // Try example visible again
    await expect(this.tryExampleSection).toBeVisible({ timeout });
  }

  async verifyChatNotReset(previousQuestionText: string, timeout = 60_000) {
    // Old message still there
    await expect(this.chatArea.getByText(previousQuestionText, { exact: false })).toBeVisible({
      timeout,
    });
    // If UI hides try-example when chat exists (usual)
    await expect(this.tryExampleSection).toBeHidden({ timeout }).catch(async () => {
      await expect(this.sendButton).toBeVisible({ timeout });
    });
  }
}
