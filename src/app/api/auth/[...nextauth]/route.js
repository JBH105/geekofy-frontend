import api from "@/lib/api";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { cookies } from "next/headers";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "select_account", 
          access_type: "online",
          response_type: "code",
        },
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        recaptchaToken: { label: "reCAPTCHA Token", type: "hidden" },
      },
      async authorize(credentials) {
        try {
          // Verify reCAPTCHA token first
          const recaptchaResponse = await fetch(
            `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${credentials.recaptchaToken}`,
            {
              method: "POST",
            }
          );

          const recaptchaData = await recaptchaResponse.json();

          if (!recaptchaData.success) {
            throw new Error("reCAPTCHA verification failed");
          }

          const response = await api.post("/api/auth/login", {
            email: credentials.email,
            password: credentials.password,
          });

          const userData = response.data?.data;

          if (!userData) throw new Error("Invalid credentials");

          return {
            id: userData.id,
            name: `${userData.firstName} ${userData.lastName}`,
            email: userData.email,
            role: userData.role,
            profileAvatar: userData.profileAvatar,
            isVerified: userData.isVerified,
            backendToken: userData.token,
          };
        } catch (error) {
          console.error("Login error:", error.response?.data || error.message);
          throw new Error(error.response?.data?.message || "Login failed");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        // Credentials login
        if (user.role) {
          token.id = user.id;
          token.role = user.role;
          token.email = user.email;
          token.name = user.name;
          token.profileAvatar = user.profileAvatar;
          token.isVerified = user.isVerified;
          token.backendToken = user.backendToken;
        }
        // Google login
        else {
          const cookieStore = cookies();
          const roleCookie = cookieStore.get("auth_role");
          const role = roleCookie?.value || "seller";
          if (roleCookie) cookieStore.delete("auth_role");

          const payload = {
            email: user.email,
            firstName: user.name?.split(" ")[0],
            lastName: user.name?.split(" ").slice(1).join(" "),
            role        
          };

          try {
            const response = await api.post(
              "/api/auth/google-sing-in-up",
              payload
            );

            if (response.data?.success && response.data.data) {
              const googleUser = response.data.data;
              token.id = googleUser.id;
              token.role = googleUser.role;
              token.email = googleUser.email;
              token.name = `${googleUser.firstName} ${googleUser.lastName}`;
              token.profileAvatar = googleUser.profileAvatar;
              token.isVerified = googleUser.isVerified;
              token.backendToken = googleUser.token;
            } else {
              throw new Error(
                response.data?.message || "Failed to register Google user"
              );
            }
          } catch (error) {
            console.error(
              "Google sign-in error:",
              error.response?.data || error.message
            );
            throw new Error(
              error.response?.data?.message || "Google sign-in failed"
            );
          }
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id,
        role: token.role,
        name: token.name,
        email: token.email,
        ...(token.profileAvatar && { profileAvatar: token.profileAvatar }),
        ...(token.isVerified && { isVerified: token.isVerified }),
        ...(token.backendToken && { backendToken: token.backendToken }),
      };
      if (token?.backendToken) {
        const cookieStore = await cookies(); 
        cookieStore.set("backend-token", token.backendToken, {
          secure: false,
          sameSite: "strict",
          path: "/",
        });
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) {
        const redirectUrl = `${baseUrl}${url}`;
        return redirectUrl;
      }
      if (new URL(url).origin === baseUrl) {
        return url;
      }
      return baseUrl;
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };