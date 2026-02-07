import type { Locator } from '@playwright/test';
import { expect } from '@playwright/test';

export class UiUtils {
    static normalizeText(text: string) {
        return text.replace(/\s+/g, ' ').trim();
    }
    static injectClientName(questionTemplate: string, clientName: string) {
      return questionTemplate.replace(/\bClient\b/g, clientName.trim());
    }

}


