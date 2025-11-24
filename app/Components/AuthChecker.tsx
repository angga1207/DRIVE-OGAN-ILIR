"use client";
import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";

const AuthChecker = () => {
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);

    const MySession = useSession();

    useEffect(() => {
        setTimeout(() => {
            if (isMounted && MySession.status !== 'loading') {
                // Jika session expired atau tidak ada session, lakukan sign out dan redirect ke login page, lakukan dalam timeout agar tidak bentrok dengan proses lainnya
                if (MySession.status === 'unauthenticated') {
                    signOut({
                        callbackUrl: '/login',
                    });
                }
                // if (MySession.status === 'unauthenticated') {
                //     signOut({
                //         callbackUrl: '/login',
                //     });
                //     return;
                // }
            }
        }, 2000);
    }, [isMounted, MySession]);

    return (
        <></>
    );
}
export default AuthChecker;