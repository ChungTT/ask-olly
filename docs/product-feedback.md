# Product Feedback – Everfit Practice Environment

This document contains improvement suggestions based on exploring the practice environment and the **Home > Ask Olly** feature.

## 1) Ask Olly – UX Improvements

### PF-01 – Clear “selected client” UI + easy removal
- Show a clear “Selected client: <name>” chip/token near the input.
- Provide an `x` button to remove the selected client quickly.
- Benefit: reduces confusion and makes context switching fast.

### PF-02 – Better loading / response state
- While Olly is generating a response:
  - Disable Send
  - Show a small loading indicator in the chat area (or in the Send button)
- Benefit: avoids duplicate sends and makes the system feel responsive.

### PF-03 – Prevent duplicate messages on rapid clicks
- Implement client-side debouncing or disable the Send button immediately after a send.
- Benefit: avoids duplicated user messages and redundant AI calls.

### PF-04 – Keyboard shortcut hints
- Add a small hint under input:
  - `Enter` to send
  - `Shift+Enter` for newline
- Benefit: improves speed for power users.

### PF-05 – Client picker UX
- When user types `@`:
  - Show a searchable list
  - Support keyboard navigation (↑/↓ + Enter)
  - Show a clear “No results” empty state
- Benefit: better accessibility and faster selection.

---

## 2) Ask Olly – Reliability / Error Handling

### PF-06 – Handle network/API failures gracefully
- If AI request fails:
  - Show error toast/message (e.g., “Something went wrong. Please try again.”)
  - Provide a Retry button for the last prompt
- Benefit: reduces user frustration and supports recovery.

### PF-07 – Add rate limiting / guidance
- If user sends too quickly, show a friendly message or throttle.
- Benefit: protects backend and avoids confusing behavior.

---

## 3) Testability / Automation Friendliness

### PF-08 – Add stable `data-testid` attributes
- Key elements:
  - Ask Olly input
  - Send button
  - Example cards
  - Client dropdown items
  - New chat button and confirm modal
- Benefit: automation becomes more stable and less dependent on fragile text/CSS.

### PF-09 – Add deterministic test mode for Olly responses (optional)
- Provide a “mock response” mode in practice/staging (e.g., fixed response for a given prompt).
- Benefit: makes automation faster and avoids flaky tests caused by unpredictable AI output.

---

## 4) General System Improvements

### PF-10 – Reduce onboarding overlay interference
- Make onboarding checklist collapsed by default on non-onboarding pages, or allow “Don’t show again”.
- Benefit: cleaner UI and fewer distractions.

### PF-11 – Performance: speed up Ask Olly initial load
- If the icon/animation is missing or slow, load a lightweight static icon first.
- Benefit: better perceived performance and fewer UI glitches.
