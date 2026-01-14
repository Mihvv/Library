import { prisma } from '../src/prisma/client.js'
import bcrypt from 'bcrypt';

async function main() {
  console.log('Starting seeding...');

  await prisma.loan.deleteMany();
  await prisma.book.deleteMany();
  await prisma.user.deleteMany();

  console.log('Cleared existing data');

  // admin
  const hashedAdminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@library.com',
      password: hashedAdminPassword,
      role: 'ADMIN'
    }
  });
  console.log('Admin created: admin@library.com / admin123');

  // użytkownik
  const hashedUserPassword = await bcrypt.hash('user123', 10);
  const user = await prisma.user.create({
    data: {
      email: 'user@library.com',
      password: hashedUserPassword,
      role: 'USER'
    }
  });
  console.log('User created: user@library.com / user123');

  // książik
  const books = await Promise.all([
    prisma.book.create({
      data: {
        title: 'Clean Code',
        author: 'Robert C. Martin',
        isbn: '978-0132350884'
      }
    }),
    prisma.book.create({
      data: {
        title: 'The Pragmatic Programmer',
        author: 'Andrew Hunt, David Thomas',
        isbn: '978-0135957059'
      }
    }),
    prisma.book.create({
      data: {
        title: 'Design Patterns',
        author: 'Gang of Four',
        isbn: '978-0201633610'
      }
    }),
    prisma.book.create({
      data: {
        title: 'Refactoring',
        author: 'Martin Fowler',
        isbn: '978-0134757599'
      }
    })
  ]);
  console.log(`Created ${books.length} books`);

  // wypożyczenie
  const loan = await prisma.loan.create({
    data: {
      userId: user.id,
      bookId: books[0].id,
      borrowedAt: new Date()
    }
  });
  console.log('Created sample loan');

  console.log('\nSeeding completed successfully!');
  console.log('\nSummary:');
  console.log(`   Users: ${await prisma.user.count()}`);
  console.log(`   Books: ${await prisma.book.count()}`);
  console.log(`   Loans: ${await prisma.loan.count()}`);
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });