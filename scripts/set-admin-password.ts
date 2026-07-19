import { db } from '../lib/db';
import { hashPassword } from '../lib/password';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error('Error: ADMIN_EMAIL and ADMIN_PASSWORD environment variables are required.');
  console.error('Set them before running: ADMIN_EMAIL=... ADMIN_PASSWORD=... pnpm admin:create');
  process.exit(1);
}

async function setAdminPassword() {
  console.log('Setting admin password...');
  
  const hashedPassword = hashPassword(ADMIN_PASSWORD);
  
  const admin = await db.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: { 
      name: 'Admin', 
      role: 'ADMIN',
      password: hashedPassword,
      emailVerified: true,
    },
    create: { 
      id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 
      email: ADMIN_EMAIL, 
      name: 'Admin', 
      role: 'ADMIN',
      password: hashedPassword,
      emailVerified: true,
    }
  });
  
  console.log('✅ Admin account ready!');
  console.log('Email:', admin.email);
  console.log('Role:', admin.role);
}

setAdminPassword()
  .catch(console.error)
  .finally(() => process.exit(0));