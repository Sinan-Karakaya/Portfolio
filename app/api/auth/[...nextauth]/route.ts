import { prisma } from '@/app/lib/prisma'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { NextAuthOptions } from 'next-auth'
import NextAuth from 'next-auth/next'
import CredentialsProvider from 'next-auth/providers/credentials'
import { compare } from 'bcryptjs'

const options: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  providers: [
    CredentialsProvider({
      name: 'Sign in',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'example@example.com',
        },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await prisma.user.findUnique({
            where: { email: credentials.email },
        })

        if (!user || !(await compare(credentials.password, user.password))) return null

        return {
            id: user.id.toString(),
            email: user.email,
        }
      }
    }),
  ],
  callbacks: {
    session: ({ session, token }) => {
        return {
            ...session,
            user: {
                ...session.user,
                id: token.id,
            },
        }
    },
    jwt: ({ token, user }) => {
        if (user) token.id = user.id
        return token
    }
  }
}

const handler = NextAuth(options)

export { handler as GET, handler as POST }
