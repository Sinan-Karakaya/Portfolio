import { hash } from 'bcryptjs'
import { prisma } from '../app/lib/prisma'

async function main() {
    const password = await hash(process.env.ADMIN_PASSWORD ?? 'Something went wrong', 12)
    const admin = await prisma.user.upsert({
        where: { email: process.env.ADMIN_EMAIL },
        update: {},
        create: {
            email: process.env.ADMIN_EMAIL ?? 'Something@went.wrong',
            password: password,
        }
    })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })