# Bug Report – Everfit Practice Environment

This document lists issues observed while exploring the Everfit practice environment (including **Home > Ask Olly**).

## Environment
- URL: `https://dev.everfit.io`
- Feature: `Home > Ask Olly`
- Browser: Chrome (Playwright Chromium)

---

## BUG-01 – Ask Olly icon shows warning symbol (⚠️) instead of the intended animation/icon

**Type:** UI/UX (visual)  
**Severity:** Low (cosmetic), but may indicate a missing asset/error in the UI bundle.

### Preconditions
- User is logged in.
- Navigate to **Home > Ask Olly**.

### Steps to Reproduce
1. Open sidebar and locate the **Ask Olly** navigation item.
2. Navigate to **Home > Ask Olly**.
3. Observe the hero/icon at the top of the Ask Olly page.

### Actual Result
- The Ask Olly icon/animation renders as a **warning symbol (⚠️)** in:
  - Sidebar navigation item
  - Ask Olly page hero/icon

### Expected Result
- Ask Olly icon/animation should render correctly (no warning symbol / fallback icon).

### Notes / Evidence
- In the captured UI snapshot, the element labeled `lottie-animation-container` contains a `⚠️` indicator in both the sidebar item and the page header area.

---

## BUG-02 – Onboarding checklist overlay appears on Ask Olly page and may distract / overlap content

**Type:** UI/UX  
**Severity:** Low (depends on screen size)

### Preconditions
- User is logged in.
- Navigate to **Home > Ask Olly**.

### Steps to Reproduce
1. Go to Ask Olly.
2. Observe the right side of the screen.

### Actual Result
- An onboarding/checklist widget appears (e.g., “Customize metrics”, progress “3 of 6 completed”), even when user is focusing on Ask Olly.

### Expected Result
- The Ask Olly page should be distraction-free, or the checklist should be collapsible by default / not overlap primary tasks.

### Notes
- This may be intended onboarding behavior, but it can reduce focus and may cause layout issues on smaller viewports.
