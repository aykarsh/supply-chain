import NextAuth from "next-auth"

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    // Add authentication providers here, e.g., Google, GitHub, etc.
    // Example:
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    // }),
  ],
  // Add a secret for JWT encryption
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
