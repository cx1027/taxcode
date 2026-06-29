import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

const { handlers } = NextAuth({
 providers: [
 Google({
 clientId: process.env.GOOGLE_CLIENT_ID!,
 clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
 authorization: {
 params: {
 prompt: "consent",
 access_type: "offline",
 response_type: "code",
 },
 },
 }),
 ],
 session: { strategy: "jwt" },
 callbacks: {
 async jwt({ token, account, profile }) {
 if (account && profile) {
 token.accessToken = account.access_token;
 token.googleId = (profile as { sub: string }).sub;
 token.email = token.email as string;
 const nameParts = (token.name as string)?.split(" ") ?? [];
 token.firstName = nameParts[0] ?? "";
 token.lastName = nameParts.slice(1).join(" ");
 }
 return token;
 },
 async session({ session, token }) {
 if (session.user) {
 session.user.email = token.email as string;
 session.user.name = `${token.firstName ?? ""} ${token.lastName ?? ""}`.trim();
 }
 (session as { accessToken?: string }).accessToken = token.accessToken as string | undefined;
 return session;
 },
 },
 pages: {
 signIn: "/login",
 error: "/login",
 },
});

export const { GET, POST } = handlers;
