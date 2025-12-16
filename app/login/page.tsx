import { Suspense } from "react";
import { Metadata } from "next";
import LoginPage from "./LoginPage";

export const metadata: Metadata = {
    title: 'Login - DRIVE OGAN ILIR',
    description: 'Masuk ke akun DRIVE OGAN ILIR untuk mengakses dan mengelola file Anda.',
    openGraph: {
        title: 'Login - DRIVE OGAN ILIR',
        description: 'Masuk ke akun DRIVE OGAN ILIR untuk mengakses dan mengelola file Anda.',
        type: 'website',
    },
    // robots can index and follow
    robots: {
        index: true,
        follow: true,
    },
};

export default function Page() {
    return (
        <Suspense fallback={<div className="h-full w-full flex items-center justify-center">Loading...</div>}>
            <LoginPage />
        </Suspense>
    );
}
