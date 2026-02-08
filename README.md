# Everfit – Ask Olly Automation (Playwright + TypeScript)

This repository contains automated UI tests for the **Home > Ask Olly** feature in the Everfit practice environment.
The implementation follows a **Page Object Model (POM)** structure for maintainability and scalability.

## Tech Stack
- **Playwright** (UI automation)
- **TypeScript**
- **Page Object Model (POM)**
- Playwright **HTML Report**

---

## Project Structure

```
everfit-playwright-starter/
  docs/                   # (Recommended) Assignment deliverables #1 and #3
    testcases-ask-olly.*   # Test case design list (sheet/doc)
    bug-report.md          # Bugs found while exploring the system
    product-feedback.md    # Product/UX improvement suggestions

  tests/
    ui/
      fixtures/            # shared fixtures (if any)
      helpers/             # reusable helpers
      pages/               # Page Objects (POM)
        ask-olly.page.ts
        login.page.ts
        sidebar.page.ts
      specs/               # Test specs
        ask-olly.spec.ts
      utils/               # utilities
        ui.utils.ts

  playwright-report/       # HTML report output
  test-results/            # raw results, screenshots, traces (if enabled)

  .env                     # local env (DO NOT COMMIT)
  .env.example             # sample env file
  playwright.config.ts
  routes.ts
  package.json
  README.md
```

> **Note:** The `docs/` folder is not required for running tests, but it helps submit a complete package:
> - Deliverable #1 (Test Case Design)
> - Deliverable #3 (Bug Report & Product Feedback)

---

## Setup

### 1) Install dependencies
```bash
npm install
```

### 2) Install Playwright browsers
```bash
npx playwright install
```

### 3) Configure environment variables
Create a `.env` file from `.env.example` and fill in the values.

Example `.env.example`:
- `BASE_URL=https://dev.everfit.io`
- `USERNAME=hanhle+test@everfit.io`
- `PASSWORD=Test2024`

> Do not commit real credentials.

---

## Running Tests

### Run all tests
```bash
npx playwright test
```

### Run Ask Olly test suite only
```bash
npx playwright test tests/ui/specs/ask-olly.spec.ts
```

### Run a specific test by title (grep)
Example: run the intentional failing test (to demonstrate FAIL in the report):
```bash
npx playwright test --grep "Intentional Fail"
```

### View HTML report
After a run:
```bash
npx playwright show-report
```

### Intentional Fail Test (Reporting Demonstration)
To satisfy the requirement of showing both PASS and FAIL results in the report, this repo includes:
- **TC-  (Intentional Fail)** – a deterministic failing assertion **for demonstration purposes only**.

## Troubleshooting
- If tests fail due to auth/session issues, re-check `.env` credentials and `BASE_URL`.
- If UI text changes, update corresponding locators in `tests/ui/pages/ask-olly.page.ts`.
