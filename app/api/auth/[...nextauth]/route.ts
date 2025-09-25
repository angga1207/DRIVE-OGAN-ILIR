import { attempLogin, autoLogin } from "@/apis/apiAuth";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
    session: {
        strategy: "jwt",
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
                        email: user.data.token,
                        // email: user.data.user.token,
                        // token: user.data.token,
                        // role: user.data.role,
                        // user: user.data.token,
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
});
export { handler as GET, handler as POST };