"use client";
import { Suspense, useEffect } from "react";
import { getCookie } from 'cookies-next';
import { signIn } from "next-auth/react";
import LoginSemesta from "../Components/LoginSemesta";
import {
    useAuthState,
    useLoginForm,
    useAutoLogin,
    handleServerCheck,
    handleGoogleLogin,
    handleCredentialsLogin,
    handleSemestaLogin,
    handleAutoLoginSubmit,
    showToast,
} from "../../hooks/useAuth";
import {
    LoginBackground,
    LoginLeftPanel,
    LoginHeader,
    LoginForm,
    SocialLoginButtons,
    LoginFooter,
} from "../Components/LoginComponents";

const Login = () => {
    const {
        isMounted,
        isLoading,
        setIsLoading,
        isAuthLoading,
        setIsAuthLoading,
        showPassword,
        setShowPassword,
        isOpen,
        setIsOpen,
        session,
    } = useAuthState();

    const { formLogin, updateForm } = useLoginForm();
    const { shouldAutoLogin, autoLoginNip } = useAutoLogin(isMounted);

    // Handle initial authentication check
    useEffect(() => {
        if (!isMounted) return;

        // Jika sudah authenticated dan ada token, redirect ke halaman utama
        if (session.status === 'authenticated' && getCookie('token')) {
            window.location.href = '/';
            return;
        }

        // Jika belum authenticated, lakukan server check
        if (session.status !== 'authenticated') {
            handleServerCheck(setIsLoading);
        }
    }, [isMounted, session.status]);

    // Handle Google login flow
    useEffect(() => {
        if (
            isMounted &&
            session.status === 'authenticated' &&
            localStorage.getItem('logginByGoogle') === 'true' &&
            !getCookie('token')
        ) {
            handleGoogleLogin(session, setIsAuthLoading);
        }
    }, [isMounted, session]);

    // Handle auto login
    useEffect(() => {
        if (shouldAutoLogin && autoLoginNip) {
            handleAutoLoginSubmit(autoLoginNip, formLogin.password, setIsAuthLoading);
        }
    }, [shouldAutoLogin, autoLoginNip, formLogin.password]);

    // Event handlers
    const handleGoogleLoginClick = () => {
        if (isLoading) return;
        localStorage.setItem('logginByGoogle', 'true');
        signIn('google');
    };

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isLoading || session.status === 'authenticated') return;
        handleCredentialsLogin(formLogin, setIsAuthLoading);
    };

    const handleSemestaLoginSubmit = (data: any) => {
        handleSemestaLogin(data, setIsAuthLoading);
    };

    return (
        <div>
            <LoginBackground />

            <div className="flex w-full h-screen items-center justify-center -my-0">
                <LoginLeftPanel />

                <div className="w-full h-full overflow-y-auto lg:bg-gradient-to-b lg:from-[#003a69] lg:from-35% lg:to-[#ebbd18] lg:w-1/2 flex items-center justify-center">
                    <div className="max-w-md w-full p-6">
                        <LoginHeader />

                        <SocialLoginButtons
                            isLoading={isLoading}
                            isAuthLoading={isAuthLoading}
                            onGoogleLogin={handleGoogleLoginClick}
                            onSemestaLogin={() => setIsOpen(true)}
                        />

                        <div className="my-4 text-sm text-white text-center">
                            <p className="mb-4">Atau masuk menggunakan akun Drive Ogan Ilir</p>
                            <hr className="text-slate-700" />
                        </div>

                        <LoginForm
                            formLogin={formLogin}
                            updateForm={updateForm}
                            showPassword={showPassword}
                            setShowPassword={setShowPassword}
                            isLoading={isLoading}
                            isAuthLoading={isAuthLoading}
                            isAuthenticated={session.status === 'authenticated'}
                            onSubmit={handleFormSubmit}
                        />

                        <LoginFooter />
                    </div>
                </div>
            </div>

            <LoginSemesta
                isOpen={isOpen}
                isLoading={isAuthLoading}
                onClose={() => setIsOpen(false)}
                onSubmit={handleSemestaLoginSubmit}
            />
        </div>
    );
};

const Page = () => {
    return (
        <Suspense>
            <Login />
        </Suspense>
    );
};

export default Page;