import { db } from '../lib/db';
import { hashPassword } from '../lib/password';

const ADMIN_EMAIL = 'admin@sharmcloudtours.com';
const ADMIN_PASSWORD = 'Admin123!';

async function setAdminPassword() {
  console.log('Setting admin password...');
  
  const hashedPassword = hashPassword(ADMIN_PASSWORD);
  
  const admin = await db.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: { 
      name: 'Admin', 
      role: 'ADMIN',
      password: hashedPassword
    },
    create: { 
      id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 
      email: ADMIN_EMAIL, 
      name: 'Admin', 
      role: 'ADMIN',
      password: hashedPassword
    }
  });
  
  console.log('✅ Admin account ready!');
  console.log('Email:', ADMIN_EMAIL);
  console.log('Password:', ADMIN_PASSWORD);
  console.log('Role:', admin.role);
}

setAdminPassword()
  .catch(console.error)
  .finally(() => process.exit(0));