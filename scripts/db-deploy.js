const { execSync } = require('child_process');

const dbUrl =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_PRISMA_URL ||
  process.env.POSTGRES_URL ||
  process.env.STORAGE_URL ||
  process.env.STORAGE_POSTGRES_URL ||
  process.env.STORAGE_DATABASE_URL;

if (dbUrl) {
  console.log('🔄 Cloud database connection detected.');
  process.env.DATABASE_URL = dbUrl;

  try {
    console.log('📦 Syncing Prisma schema to cloud database (prisma db push)...');
    execSync('npx prisma db push --accept-data-loss', {
      stdio: 'inherit',
      env: { ...process.env, DATABASE_URL: dbUrl },
    });
    console.log('✅ Cloud database schema synced successfully.');
  } catch (err) {
    console.warn('⚠️ Warning: prisma db push error:', err.message);
  }

  try {
    console.log('🌱 Checking seed data (seed.ts)...');
    execSync('npx tsx prisma/seed.ts', {
      stdio: 'inherit',
      env: { ...process.env, DATABASE_URL: dbUrl },
    });
    console.log('✅ Database seed check finished.');
  } catch (err) {
    console.warn('⚠️ Seed notice:', err.message);
  }
} else {
  console.log('ℹ️ No cloud database connection string detected at build time.');
}
