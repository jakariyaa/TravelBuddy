
import { prisma } from './src/lib/prisma';

async function main() {
    const email = 'admin_test@test.com'; // Using Host User as Admin for testing
    const user = await prisma.user.update({
        where: { email },
        data: { role: 'ADMIN' },
    });
    console.log(`User ${user.email} promoted to ${user.role}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
