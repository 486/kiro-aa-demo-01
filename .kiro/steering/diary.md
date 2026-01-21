---
inclusion: manual
---

# Development Diary

A living record of code changes, discussions, decisions, and insights.

---

## [2026-01-20] - Added Playwright E2E Tests

### Changes
- Added Playwright test framework with 26 E2E tests
- Created `playwright.config.ts` with dual webServer setup (backend + frontend)
- Created `tests/sessions.spec.ts` covering all user flows
- Updated `package.json` with test scripts (`test`, `test:ui`)
- Updated `.gitignore` to exclude test artifacts
- Changed frontend proxy port from 3000 to 3001 to avoid conflicts

### Context & Discussion
- PR review task required exploring the app and creating comprehensive tests
- Used Playwright MCP tools to explore the app interactively before writing tests
- Discovered all major user flows: browsing, filtering, auth, schedule management

### Decisions & Rationale
- Used port 3001 for backend to avoid conflicts with other services on 3000
- Configured `reuseExistingServer` for faster local development
- Used unique email per test suite to avoid schedule state conflicts between tests
- Used specific locators (`.badge`, exact text matches) to avoid strict mode violations

### Insights & Patterns
- Svelte app uses hash-based routing (`#/schedule`, `#/session/:id`)
- Auth uses browser prompt dialog - handled with `page.on('dialog')`
- Schedule state persists in SQLite - tests use unique user emails to isolate
- Multiple elements with same text require `.first()` or more specific locators

---
