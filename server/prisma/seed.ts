// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create dummy users
  const hashedPassword = await bcrypt.hash('password123', 10);
  const user1 = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: hashedPassword,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      password: hashedPassword,
    },
  });

  const user3 = await prisma.user.create({
    data: {
      name: 'Bob Johnson',
      email: 'bob.johnson@example.com',
      password: hashedPassword,
    },
  });

  // Create dummy posts
  const post1 = await prisma.post.create({
    data: {
      content: 'First post by John Doe.  #coding #react',
      userId: user1.id,
    },
  });

  const post2 = await prisma.post.create({
    data: {
      content: 'Excited to learn more about data science! #datascience',
      userId: user2.id,
    },
  });
  const post3 = await prisma.post.create({
    data: {
      content: "I am learning Full Stack Development. #fullstack #javascript",
      userId: user3.id
    }
  })

  // Create dummy comments
  await prisma.comment.create({
    data: {
      content: 'Great post, John!',
      userId: user2.id,
      postId: post1.id,
    },
  });

  await prisma.comment.create({
    data: {
      content: "I agree with Jane",
      userId: user1.id,
      postId: post1.id
    }
  })

  // Create dummy followers (using the Follow model)
  await prisma.follow.create({
    data: {
      followerId: user1.id,
      followingId: user2.id,
    },
  });

  await prisma.follow.create({
    data: {
      followerId: user2.id,
      followingId: user1.id,
    },
  });

  await prisma.follow.create({
    data: {
      followerId: user3.id,
      followingId: user1.id
    }
  })

  console.log('Seed data created successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding the database:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });