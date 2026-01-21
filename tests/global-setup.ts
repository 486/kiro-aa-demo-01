/**
 * Playwright Global Setup
 * Resets the database to seed state before running tests.
 * 
 * Note: We reset via CLI before servers start to avoid SQLite file locking issues.
 */
import { execSync } from 'child_process';

async function globalSetup() {
  console.log('\n🔄 Resetting database before tests...');
  try {
    execSync('npm run db:reset', { stdio: 'inherit' });
  } catch (error) {
    console.error('Failed to reset database:', error);
    throw error;
  }
  console.log('');
}

export default globalSetup;
