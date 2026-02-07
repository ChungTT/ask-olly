import type { Locator } from '@playwright/test';
import { expect } from '@playwright/test';

export class UiUtils {
    static normalizeText(text: string) {
        return text.replace(/\s+/g, ' ').trim();
    }

}
