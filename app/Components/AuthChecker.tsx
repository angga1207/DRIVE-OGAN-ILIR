"use client";
import { serverCheck } from "@/apis/serverConfig";
import { useEffect, useState } from "react";
import { setCookie, getCookie, hasCookie, deleteCookie } from 'cookies-next';
import { signOut, useSession } from "next-auth/react";

const AuthChecker = () => {
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);

    const MySession = useSession();

    useEffect(() => {
        if (isMounted && MySession.status !== 'loading') {
            if (MySession.status === 'unauthenticated') {
                signOut({
                    callbackUrl: '/login',
                });
                return;
            }
        }
    }, [isMounted, MySession]);

    return (
        <></>
    );
}
export default AuthChecker;