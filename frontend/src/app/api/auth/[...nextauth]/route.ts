import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import axios from "@/lib/axios";

const handler = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: {},
        password: {}
      },
      async authorize(credentials) {
        const res = await axios.post("/auth/login", credentials);
        if (res.data) return res.data;
        return null;
      }
    })
  ],
  session: {
    strategy: "jwt"
  }
});

export { handler as GET, handler as POST };