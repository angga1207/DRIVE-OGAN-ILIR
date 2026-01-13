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
                    // remove local storage
                    localStorage.clear();
                    const cookies = document.cookie.split("; ");
                    for (let c of cookies) {
                        const d = window.location.hostname.split(".");
                        while (d.length > 0) {
                            const cookieBase = encodeURIComponent(c.split(";")[0].split("=")[0]) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; domain=" + d.join('.') + " ;path=";
                            const paths = location.pathname.split('/');
                            document.cookie = cookieBase + '/';
                            for (let i = 0; i < paths.length; i++) {
                                document.cookie = cookieBase + paths.slice(0, i + 1).join('/');
                            }
                            d.shift();
                        }
                    }
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