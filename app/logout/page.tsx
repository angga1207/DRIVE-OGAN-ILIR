"use client";
import { useEffect, useState } from "react";
import { deleteCookie } from 'cookies-next';
import { signOut } from "next-auth/react";

const Page = () => {
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);

    const checkToken = () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
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
            // window.location.href = '/login';
        }
        // window.location.href = '/login';
    }

    useEffect(() => {
        if (isMounted) {
            checkToken();
        }
    }, [isMounted]);
    return (
        <>
        </>
    );
}
export default Page;