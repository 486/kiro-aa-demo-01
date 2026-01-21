/**
 * E2E tests for AWS re:Invent Sessions app
 * Tests: home page, session browsing, filtering, session details, schedule management
 */
import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('displays session catalog with cards', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'AWS re:Invent Sessions' })).toBeVisible();
    await expect(page.getByText('Browse and discover sessions')).toBeVisible();
    
    // Check session cards are displayed
    const sessionCards = page.locator('[class*="session"]').filter({ hasText: 'View Details' });
    await expect(sessionCards.first()).toBeVisible();
  });

  test('shows pagination controls', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('button', { name: '← Previous' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Next →' })).toBeVisible();
  });

  test('displays session count', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText(/Showing \d+ of \d+ sessions/)).toBeVisible();
  });
});

test.describe('Navigation', () => {
  test('navigates between Sessions and My Schedule', async ({ page }) => {
    await page.goto('/');
    
    await page.getByRole('link', { name: 'My Schedule' }).click();
    await expect(page).toHaveURL(/#\/schedule/);
    await expect(page.getByRole('heading', { name: 'My Schedule' })).toBeVisible();
    
    await page.getByRole('link', { name: 'Sessions' }).click();
    await expect(page).toHaveURL(/#\//);
    await expect(page.getByRole('heading', { name: 'AWS re:Invent Sessions' })).toBeVisible();
  });

  test('logo navigates to home', async ({ page }) => {
    await page.goto('/#/schedule');
    await page.getByRole('link', { name: 'AWS re:Invent' }).click();
    await expect(page).toHaveURL(/#\//);
  });
});

test.describe('Search and Filter', () => {
  test('filters sessions by track', async ({ page }) => {
    await page.goto('/');
    
    await page.getByLabel('Track').selectOption('AI/ML');
    await page.getByRole('button', { name: '🔍 Search' }).click();
    
    // Verify filtered results - check session count changed
    await expect(page.getByText(/Showing \d+ of \d+ sessions/)).toBeVisible();
    // Verify a session card with AI/ML track is visible
    await expect(page.getByRole('link', { name: /SageMaker|Keynote/ }).first()).toBeVisible();
  });

  test('filters sessions by type', async ({ page }) => {
    await page.goto('/');
    
    await page.getByLabel('Session Type').selectOption('Workshop');
    await page.getByRole('button', { name: '🔍 Search' }).click();
    
    // Verify workshop sessions are shown
    await expect(page.getByRole('link', { name: /Data Lake|Containers/ }).first()).toBeVisible();
  });

  test('filters sessions by level', async ({ page }) => {
    await page.goto('/');
    
    await page.getByLabel('Level').selectOption('400 - Expert');
    await page.getByRole('button', { name: '🔍 Search' }).click();
    
    // Verify expert level sessions
    await expect(page.getByRole('link', { name: 'Containers from Code to Production' })).toBeVisible();
  });

  test('resets filters', async ({ page }) => {
    await page.goto('/');
    
    await page.getByLabel('Track').selectOption('AI/ML');
    await page.getByRole('button', { name: '🔍 Search' }).click();
    
    await page.getByRole('button', { name: '🔄 Reset Filters' }).click();
    
    await expect(page.getByLabel('Track')).toHaveValue('');
    await expect(page.getByText(/Showing 12 of 15 sessions/)).toBeVisible();
  });

  test('searches by keyword', async ({ page }) => {
    await page.goto('/');
    
    await page.getByLabel('Keywords').fill('SageMaker');
    await page.getByRole('button', { name: '🔍 Search' }).click();
    
    await expect(page.getByRole('link', { name: 'Building Production ML Systems with SageMaker' })).toBeVisible();
  });
});

test.describe('Session Details', () => {
  test('navigates to session detail page', async ({ page }) => {
    await page.goto('/');
    
    await page.getByRole('link', { name: 'View Details' }).first().click();
    
    await expect(page).toHaveURL(/#\/session\/.+/);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Description' })).toBeVisible();
  });

  test('displays session information', async ({ page }) => {
    await page.goto('/#/session/DAT301-W');
    
    await expect(page.getByRole('heading', { name: 'Build a Data Lake on AWS' })).toBeVisible();
    await expect(page.locator('.badge').filter({ hasText: 'Workshop' }).first()).toBeVisible();
    await expect(page.locator('.badge').filter({ hasText: '300 - Advanced' })).toBeVisible();
    await expect(page.locator('.badge').filter({ hasText: 'Databases' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Speakers' })).toBeVisible();
  });

  test('shows back to sessions link', async ({ page }) => {
    await page.goto('/#/session/DAT301-W');
    
    await page.getByRole('link', { name: '← Back to Sessions' }).click();
    await expect(page).toHaveURL(/#\//);
  });
});

test.describe('Authentication', () => {
  test('shows sign in button when not authenticated', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
  });

  test('signs in with email', async ({ page }) => {
    await page.goto('/');
    
    page.on('dialog', async dialog => {
      await dialog.accept('test@example.com');
    });
    
    await page.getByRole('button', { name: 'Sign In' }).click();
    
    await expect(page.getByText('test@example.com')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign Out' })).toBeVisible();
  });

  test('signs out', async ({ page }) => {
    await page.goto('/');
    
    page.on('dialog', async dialog => {
      await dialog.accept('test@example.com');
    });
    
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page.getByText('test@example.com')).toBeVisible();
    
    await page.getByRole('button', { name: 'Sign Out' }).click();
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
  });
});

test.describe('Schedule Management', () => {
  let testUserId: string;

  test.beforeEach(async ({ page }) => {
    // Use unique user ID per test to avoid conflicts with existing schedule entries
    testUserId = `test-${Date.now()}-${Math.random().toString(36).substring(7)}@example.com`;
    await page.goto('/');
    page.on('dialog', async dialog => {
      await dialog.accept(testUserId);
    });
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page.getByText(testUserId)).toBeVisible();
  });

  test('adds session to schedule from detail page', async ({ page }) => {
    await page.goto('/#/session/SVR201-B');
    
    await page.getByRole('button', { name: '⭐ Add to My Schedule' }).click();
    
    await expect(page.getByText('✓ In your schedule')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Remove from Schedule' })).toBeVisible();
  });

  test('removes session from schedule', async ({ page }) => {
    await page.goto('/#/session/ANT301');
    
    await page.getByRole('button', { name: '⭐ Add to My Schedule' }).click();
    await expect(page.getByText('✓ In your schedule')).toBeVisible();
    
    await page.getByRole('button', { name: 'Remove from Schedule' }).click();
    await expect(page.getByRole('button', { name: '⭐ Add to My Schedule' })).toBeVisible();
  });

  test('shows schedule badge count', async ({ page }) => {
    await page.goto('/#/session/KEY02');
    
    await page.getByRole('button', { name: '⭐ Add to My Schedule' }).click();
    
    // Check badge appears on My Schedule link
    const scheduleLink = page.getByRole('link', { name: /My Schedule/ });
    await expect(scheduleLink).toContainText(/\d+/);
  });

  test('displays sessions in My Schedule page', async ({ page }) => {
    await page.goto('/#/session/STG301');
    await page.getByRole('button', { name: '⭐ Add to My Schedule' }).click();
    
    await page.getByRole('link', { name: /My Schedule/ }).click();
    
    await expect(page.getByRole('heading', { name: 'My Schedule' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Deep Dive on Amazon S3' })).toBeVisible();
  });

  test('shows schedule statistics', async ({ page }) => {
    await page.goto('/#/session/CMP401-W');
    await page.getByRole('button', { name: '⭐ Add to My Schedule' }).click();
    
    await page.getByRole('link', { name: /My Schedule/ }).click();
    
    await expect(page.getByText('Total Sessions')).toBeVisible();
    await expect(page.getByText('Total Time')).toBeVisible();
    await expect(page.getByText('Days')).toBeVisible();
    await expect(page.getByText('Conflicts', { exact: true })).toBeVisible();
  });

  test('removes session from My Schedule page', async ({ page }) => {
    await page.goto('/#/session/HYB201-L');
    await page.getByRole('button', { name: '⭐ Add to My Schedule' }).click();
    
    await page.getByRole('link', { name: /My Schedule/ }).click();
    await expect(page.getByRole('link', { name: 'Edge Computing with AWS Outposts' })).toBeVisible();
    
    // Find the specific session's remove button
    const sessionItem = page.locator('article, [class*="schedule-item"], [class*="session"]')
      .filter({ hasText: 'Edge Computing with AWS Outposts' });
    await sessionItem.getByRole('button', { name: 'Remove' }).click();
    
    await expect(page.getByRole('link', { name: 'Edge Computing with AWS Outposts' })).not.toBeVisible();
  });
});

test.describe('Pagination', () => {
  test('navigates to next page', async ({ page }) => {
    await page.goto('/');
    
    await page.getByRole('button', { name: 'Next →' }).click();
    
    await expect(page.getByRole('button', { name: '← Previous' })).toBeEnabled();
  });

  test('navigates to previous page', async ({ page }) => {
    await page.goto('/');
    
    await page.getByRole('button', { name: 'Next →' }).click();
    await page.getByRole('button', { name: '← Previous' }).click();
    
    await expect(page.getByRole('button', { name: '← Previous' })).toBeDisabled();
  });

  test('page buttons work', async ({ page }) => {
    await page.goto('/');
    
    await page.getByRole('button', { name: '2' }).click();
    await expect(page.getByRole('button', { name: '← Previous' })).toBeEnabled();
    
    await page.getByRole('button', { name: '1' }).click();
    await expect(page.getByRole('button', { name: '← Previous' })).toBeDisabled();
  });
});

test.describe('Unauthenticated Schedule Access', () => {
  test('prompts sign in when adding to schedule without auth', async ({ page }) => {
    await page.goto('/#/session/DAT301-W');
    
    await page.getByRole('button', { name: '⭐ Add to My Schedule' }).click();
    
    await expect(page.getByText('Please sign in to manage your schedule')).toBeVisible();
  });
});
