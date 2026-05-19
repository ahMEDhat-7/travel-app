import { db } from '../lib/db';

async function createAdmin() {
  const adminEmail = 'admin@sharmcloudtours.com';
  
  const existing = await db.user.findUnique({ where: { email: adminEmail } });
  
  if (existing) {
    console.log('Admin user already exists:', existing);
    await db.user.update({
      where: { id: existing.id },
      data: { role: 'ADMIN' },
    });
    console.log('Updated to ADMIN role');
  } else {
    const admin = await db.user.create({
      data: {
        id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        email: adminEmail,
        name: 'Admin',
        role: 'ADMIN',
      },
    });
    console.log('Created admin user:', admin);
  }
}

createAdmin().catch(console.error);