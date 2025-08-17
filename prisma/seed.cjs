import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('password123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@sc.test' },
    update: {},
    create: {
      email: 'admin@sc.test',
      username: 'admin',
      firstName: 'Admin',
      lastName: 'User',
      passwordHash,
      role: 'ADMIN',
      emailVerified: true,
      profile: { create: { bio: 'I am admin' } }
    }
  });

  const user = await prisma.user.upsert({
    where: { email: 'user@sc.test' },
    update: {},
    create: {
      email: 'user@sc.test',
      username: 'user1',
      firstName: 'User',
      lastName: 'One',
      passwordHash,
      emailVerified: true,
      profile: { create: { bio: 'Hello world' } }
    }
  });

  await prisma.post.create({
    data: { authorId: user.id, content: "Welcome to SocialConnect!", category: "GENERAL" }
  });

  console.log({ admin: admin.email, user: user.email });
}
main().catch(e => { console.error(e); process.exit(1); }).finally(async () => prisma.$disconnect());
