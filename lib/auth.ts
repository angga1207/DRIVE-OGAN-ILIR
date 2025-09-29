import { attempLogin, autoLogin } from "@/apis/apiAuth";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user }) {
            // Saat login pertama kali, user object tersedia
            if (user) {
                token.accessToken = user.accessToken; // Bearer token dari response login
                token.userId = user.id;
                token.userName = user.name || undefined;
            }
            return token;
        },
        async session({ session, token }) {
            // Mengirim token ke client session
            if (session) {
                session.accessToken = token.accessToken as string;
                if (session.user) {
                    session.user.id = token.userId as string;
                    session.user.name = token.userName as string;
                }
            }
            return session;
        },
    },
    providers: [
        CredentialsProvider({
            type: "credentials",
            credentials: {
                username: {
                    label: "Username",
                    type: "text",
                    placeholder: "username",
                },
                password: {
                    label: "Password",
                    type: "password",
                    placeholder: "password",
                },
                autoLogin: {
                    label: "",
                    type: "checkbox",
                    placeholder: "",
                    className: 'hidden',
                },
            },
            async authorize(credentials, req) {
                // const { username, password } = credentials as {
                //     username: string;
                //     password: string;
                // };

                const user = await attempLogin({
                    username: credentials?.username,
                    password: credentials?.password,
                    autoLogin: credentials?.autoLogin ?? false,
                });
                if (user.status === "error") {
                    throw new Error(user.message);
                }
                if (user.status === "success") {
                    return {
                        id: user.id,
                        name: user.data.user.name.fullname,
                        email: user.data.user.email || user.data.user.username, // Email asli user
                        accessToken: user.data.token, // Bearer token yang akan disimpan di session
                        // Additional user data bisa ditambahkan di sini
                    };
                } else {
                    throw new Error("Invalid credentials");
                }
            },
        }),

        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        })
    ],
    
    pages: {
        // signIn: "/login",
        // signOut: "/logout",
    },
};