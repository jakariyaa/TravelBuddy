import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma/client';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcryptjs';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('Seeding database...');

    // Hash password
    const passwordHash = await bcrypt.hash('pass1234', 10);

    const users = [];
    const travelInterestsOptions = ['Hiking', 'Food', 'Photography', 'History', 'Beach', 'Nightlife', 'Nature', 'Art', 'Adventure', 'Relaxation'];

    // Create 20 new female users
    console.log('Creating 20 new female users...');
    for (let i = 0; i < 20; i++) {
        const firstName = faker.person.firstName('female');
        const lastName = faker.person.lastName();
        const name = `${firstName} ${lastName}`;
        const email = faker.internet.email({ firstName, lastName }).toLowerCase();

        // Random interests (3-5)
        const interests = faker.helpers.arrayElements(travelInterestsOptions, { min: 3, max: 5 });

        // Use randomuser.me for high quality female portraits
        const image = `https://randomuser.me/api/portraits/women/${faker.number.int({ min: 0, max: 99 })}.jpg`;

        const user = await prisma.user.create({
            data: {
                name,
                email,
                image,
                bio: faker.person.bio(),
                role: 'USER',
                travelInterests: interests,
                visitedCountries: [faker.location.country(), faker.location.country(), faker.location.country()],
                currentLocation: `${faker.location.city()}, ${faker.location.country()}`,
                isVerified: faker.datatype.boolean(),
                subscriptionStatus: faker.helpers.arrayElement(['ACTIVE', 'INACTIVE']),
                accounts: {
                    create: {
                        providerId: 'credential',
                        accountId: email,
                        password: passwordHash,
                        scope: 'read:user',
                    }
                }
            }
        });
        users.push(user);
        console.log(`Created user: ${name}`);
    }

    // Create 40 travel plans
    console.log('Creating 40 travel plans...');
    const travelTypes = ['Solo', 'Friends', 'Couple', 'Family', 'Group', 'Adventure'];
    const statusOptions = ['UPCOMING', 'UPCOMING', 'UPCOMING', 'ONGOING', 'COMPLETED']; // Weighted towards UPCOMING

    // Unsplash collections appropriate for travel
    const travelImages = [
        'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1488085061387-422e29b40080?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1499856871940-a09627c6d7db?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?auto=format&fit=crop&w=800&q=80'
    ];

    const plans = [];

    for (let i = 0; i < 40; i++) {
        const randomUser = users[Math.floor(Math.random() * users.length)];
        const startDate = faker.date.future();
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + faker.number.int({ min: 3, max: 14 }));

        const plan = await prisma.travelPlan.create({
            data: {
                userId: randomUser.id,
                destination: `${faker.location.city()}, ${faker.location.country()}`,
                startDate,
                endDate,
                budget: faker.number.int({ min: 500, max: 5000 }),
                budgetRange: '$1000 - $2000', // You might want to make this dynamic based on budget
                travelType: faker.helpers.arrayElement(travelTypes),
                description: faker.lorem.paragraph(),
                images: faker.helpers.arrayElements(travelImages, { min: 1, max: 3 }),
                interests: faker.helpers.arrayElements(travelInterestsOptions, { min: 2, max: 4 }),
                status: faker.helpers.arrayElement(statusOptions) as any
            }
        });
        plans.push(plan);
    }
    console.log('Created 40 travel plans.');

    // Create 60 reviews
    console.log('Creating 60 reviews...');
    for (let i = 0; i < 60; i++) {
        // Pick random reviewer and reviewee (ensure they are different)
        const reviewer = users[Math.floor(Math.random() * users.length)];
        let reviewee = users[Math.floor(Math.random() * users.length)];

        while (reviewee.id === reviewer.id) {
            reviewee = users[Math.floor(Math.random() * users.length)];
        }

        // 50% chance to link to a plan, but strictly speaking reviewee must be related to plan? 
        // Schema: travelPlanId is optional.
        // For simplicity, we'll link to a plan if the reviewee has one, or just a general user review.
        // Let's just create generic reviews for now or random plan link
        const linkedPlan = plans.find(p => p.userId === reviewee.id);

        await prisma.review.create({
            data: {
                rating: faker.number.int({ min: 3, max: 5 }), // Skew towards positive
                comment: faker.lorem.sentence(),
                reviewerId: reviewer.id,
                revieweeId: reviewee.id,
                travelPlanId: linkedPlan ? linkedPlan.id : undefined,
            }
        });
    }
    console.log('Created 60 reviews.');

    console.log('Seeding completed.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
