import { db } from '../lib/db';

const CUTOFF_HOURS = 24;

async function cleanupUnverifiedUsers() {
  const cutoff = new Date(Date.now() - CUTOFF_HOURS * 60 * 60 * 1000);

  try {
    const staleUsers = await db.user.findMany({
      where: {
        emailVerified: false,
        createdAt: { lt: cutoff },
      },
      select: { id: true, email: true, createdAt: true },
    });

    if (staleUsers.length === 0) {
      console.log('No stale unverified users found.');
      return;
    }

    console.log(`Found ${staleUsers.length} stale unverified user(s):`);
    for (const u of staleUsers) {
      console.log(`  - ${u.email} (created ${u.createdAt.toISOString()})`);
    }

    const { count } = await db.user.deleteMany({
      where: {
        id: { in: staleUsers.map((u) => u.id) },
      },
    });

    console.log(`Deleted ${count} unverified user(s) older than ${CUTOFF_HOURS} hours.`);
  } catch (error: any) {
    if (error.code === 'P2003' || error.message?.includes('Foreign key')) {
      console.warn('Some users have associated records. Attempting to delete individually...');
      const staleUsers = await db.user.findMany({
        where: {
          emailVerified: false,
          createdAt: { lt: cutoff },
        },
        select: { id: true, email: true },
      });
      let deleted = 0;
      for (const u of staleUsers) {
        try {
          await db.user.delete({ where: { id: u.id } });
          deleted++;
        } catch {
          console.warn(`  Could not delete ${u.email} (has associated records)`);
        }
      }
      console.log(`Deleted ${deleted} unverified user(s) individually.`);
    } else {
      throw error;
    }
  }
}

cleanupUnverifiedUsers().catch((err) => {
  console.error('Cleanup failed:', err);
  process.exit(1);
}).finally(() => {
  db.$disconnect();
});
