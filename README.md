# Everfit Playwright Starter (login once via storageState)

## Setup
```bash
npm i
npx playwright install
cp .env.example .env
```

## Generate auth state (login once)
```bash
npm run auth:setup
```

This generates `tests/auth/storageState.json` (gitignored).

## Run UI tests
```bash
npm run test:ui
```

## Run all tests
```bash
npm test
```
