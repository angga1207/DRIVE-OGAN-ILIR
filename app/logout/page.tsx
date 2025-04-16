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
            deleteCookie('token');
            deleteCookie('user');
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