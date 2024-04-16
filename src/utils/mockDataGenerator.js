const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');

const prisma = new PrismaClient();

async function generateMockData() {
  try {
    // Generate 10 users
    const users = Array.from({ length: 10 }, () => ({
      name: faker.person.fullName(),
      email: faker.internet.email(),
    }));

    // Insert users into the database
    await prisma.user.createMany({
      data: users,
    });

    const createdUsers = await prisma.user.findMany();
    // Generate 100 collections
    const collections = Array.from({ length: 100 }, () => ({
      name: faker.commerce.productName(),
      description: faker.lorem.sentence(),
      stocks: faker.number.int({ min: 1, max: 100 }),
      price: faker.number.int({ min: 1, max: 1000 }),
      user_id: faker.helpers.arrayElement(createdUsers).id,
    }));

    // Insert collections into the database
    await prisma.collection.createMany({
      data: collections,
    });

    const createdCollections = await prisma.collection.findMany();

    // Generate at least 10 bids per collection
    const bids = [];
    createdCollections.forEach((collection) => {
      for (let i = 0; i < 10; i++) {
        bids.push({
          collection_id: collection.id,
          price: faker.number.int({ min: 1, max: 1000 }),
          user_id: faker.helpers.arrayElement(createdUsers).id,
          status: 'pending',
        });
      }
    });

    // Insert bids into the database
    await prisma.bid.createMany({
      data: bids,
    });

    console.log('Mock data generated successfully.');
  } catch (error) {
    console.error('Error generating mock data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

generateMockData();
