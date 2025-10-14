import { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { setCookie, getCookie, deleteCookie } from 'cookies-next';
import { serverCheck } from '@/apis/serverConfig';
import { attempLogin, loggedWithGoogle, atempLoginSemesta } from '@/apis/apiAuth';
import { encryptClient } from '@/lib/crypto-js';
import Swal from 'sweetalert2';

// Utility function for SweetAlert toasts
export const showToast = (icon: 'success' | 'error' | 'warning' | 'info', title: string, text: string) => {
    return Swal.fire({
        position: 'top-end',
        icon,
        title,
        text,
        showConfirmButton: false,
        timer: 5000,
        timerProgressBar: true,
        toast: true,
    });
};

// Custom hook for login form state
export const useLoginForm = () => {
    const [formLogin, setFormLogin] = useState({
        username: '',
        password: '',
        isGoogle: false,
    });

    const updateForm = (field: keyof typeof formLogin, value: string | boolean) => {
        setFormLogin(prev => ({ ...prev, [field]: value }));
    };

    return { formLogin, updateForm, setFormLogin };
};

// Custom hook for authentication state
export const useAuthState = () => {
    const [isMounted, setIsMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthLoading, setIsAuthLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const session = useSession();
    const router = useRouter();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    return {
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
        router,
    };
};

// Custom hook for auto login functionality
export const useAutoLogin = (isMounted: boolean) => {
    const params = useSearchParams();
    const typeAutoLogin = params.get("ao-semesta");
    const autoLoginNip = params.get("nip");
    const autoLoginKey = params.get("key");

    return {
        shouldAutoLogin: isMounted && typeAutoLogin === 'true' && autoLoginNip && autoLoginKey === '049976129942',
        autoLoginNip,
    };
};

// Authentication logic functions
export const handleServerCheck = async (
    setIsLoading: (loading: boolean) => void,
    isAuthenticated: boolean = false
) => {
    try {
        const res = await serverCheck();

        if (res.status === 'error') {
            showToast('info', 'Peringatan', 'Sesi Anda telah berakhir, silahkan login kembali');
        }

        if (res.status === 'success') {
            if (res.data === null) {
                localStorage.removeItem('token');
                deleteCookie('token');
                deleteCookie('user');
            } else {
                localStorage.setItem('user', JSON.stringify(res.data));
                if (isAuthenticated) {
                    setCookie('user', JSON.stringify(res.data), { maxAge: 60 * 60 * 24 * 30 });
                    window.location.href = '/';
                }
            }
        }
    } catch (error) {
        console.error('Server check error:', error);
    } finally {
        setIsLoading(false);
    }
};

export const handleGoogleLogin = async (userSession: any, setIsAuthLoading: (loading: boolean) => void) => {
    setIsAuthLoading(true);

    try {
        const res = await loggedWithGoogle({
            email: userSession.data?.user?.email,
            name: userSession.data?.user?.name,
            image: userSession.data?.user?.image,
        });

        if (res.status === 'success') {
            // Konfigurasi cookie yang konsisten
            const cookieOptions = { 
                maxAge: 60 * 60 * 24 * 30, // 30 hari
                httpOnly: false,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax' as const,
                path: '/'
            };

            // Simpan token dan user data
            setCookie('token', encryptClient(res.data.token), cookieOptions);
            setCookie('user', JSON.stringify(res.data.user), cookieOptions);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            localStorage.removeItem('logginByGoogle');

            console.log('Google login token tersimpan:', getCookie('token')); // Debug log

            // Redirect ke halaman utama
            window.location.href = '/';
        } else {
            showToast('error', 'Error', res.message);
            localStorage.removeItem('logginByGoogle');
        }
    } catch (error) {
        console.error('Google login error:', error);
        showToast('error', 'Error', 'Terjadi kesalahan saat login dengan Google');
        localStorage.removeItem('logginByGoogle');
    } finally {
        setIsAuthLoading(false);
    }
};

export const handleCredentialsLogin = async (
    formData: { username: string; password: string },
    setIsAuthLoading: (loading: boolean) => void
) => {
    setIsAuthLoading(true);

    try {
        const res = await attempLogin(formData);

        if (res.status === 'success') {
            // Simpan token dan user data dengan konfigurasi cookie yang lebih baik
            const cookieOptions = { 
                maxAge: 60 * 60 * 24 * 30, // 30 hari
                httpOnly: false, // Agar bisa diakses dari client-side
                secure: process.env.NODE_ENV === 'production', // HTTPS di production
                sameSite: 'lax' as const, // Untuk cross-origin yang lebih aman
                path: '/' // Tersedia di seluruh aplikasi
            };

            setCookie('token', encryptClient(res.data.token), cookieOptions);
            setCookie('user', JSON.stringify(res.data.user), cookieOptions);
            localStorage.setItem('user', JSON.stringify(res.data.user));

            console.log('Token tersimpan:', getCookie('token')); // Debug log

            // Sign in dengan NextAuth
            const result = await signIn('credentials', {
                username: formData.username,
                password: formData.password,
                redirect: false,
            });

            if (result?.ok) {
                // Redirect ke halaman utama setelah login berhasil
                window.location.href = '/';
            } else {
                showToast('error', 'Error', 'Gagal melakukan login');
            }
        } else if (res.status === 'error') {
            showToast('error', 'Error', res.message);
        } else if (res.status === 'error validation') {
            showToast('error', 'Error', 'Username atau Password salah');
        }
    } catch (error) {
        console.error('Credentials login error:', error);
        showToast('error', 'Error', 'Terjadi kesalahan saat login');
    } finally {
        setIsAuthLoading(false);
    }
};

export const handleSemestaLogin = async (
    data: any,
    setIsAuthLoading: (loading: boolean) => void
) => {
    setIsAuthLoading(true);

    try {
        const res = await atempLoginSemesta(data);

        if (res.status === 'success') {
            // Konfigurasi cookie yang konsisten
            const cookieOptions = { 
                maxAge: 60 * 60 * 24 * 30, // 30 hari
                httpOnly: false,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax' as const,
                path: '/'
            };

            // Simpan token dan user data
            setCookie('token', encryptClient(res.data.token), cookieOptions);
            setCookie('user', JSON.stringify(res.data.user), cookieOptions);
            localStorage.setItem('user', JSON.stringify(res.data.user));

            console.log('Semesta login token tersimpan:', getCookie('token')); // Debug log

            // Sign in dengan NextAuth
            const result = await signIn('credentials', {
                username: data.nip,
                password: data.password,
                redirect: false,
            });

            if (result?.ok) {
                // Redirect ke halaman utama setelah login berhasil
                window.location.href = '/';
            } else {
                showToast('error', 'Error', 'Gagal melakukan login');
            }
        } else if (res.status === 'error') {
            showToast('error', 'Error', res.message);
        }
    } catch (error) {
        console.error('Semesta login error:', error);
        showToast('error', 'Error', 'Terjadi kesalahan saat login dengan Semesta');
    } finally {
        setIsAuthLoading(false);
    }
};

export const handleAutoLoginSubmit = async (
    nip: string,
    password: string,
    setIsAuthLoading: (loading: boolean) => void
) => {
    setIsAuthLoading(true);

    try {
        const res = await attempLogin({
            username: nip,
            password,
            autoLogin: '1',
        });

        if (res.status === 'success') {
            console.log('Auto login success:', res);
            
            // Konfigurasi cookie yang konsisten
            const cookieOptions = { 
                maxAge: 60 * 60 * 24 * 30, // 30 hari
                httpOnly: false,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax' as const,
                path: '/'
            };

            // Simpan token dan user data dengan konfigurasi yang tepat
            setCookie('token', encryptClient(res.data.token), cookieOptions);
            setCookie('user', JSON.stringify(res.data.user), cookieOptions);
            localStorage.setItem('user', JSON.stringify(res.data.user));

            console.log('Auto login token tersimpan:', getCookie('token')); // Debug log

            // Sign in dengan NextAuth
            const result = await signIn('credentials', {
                username: nip,
                autoLogin: '1',
                redirect: false,
            });

            if (result?.ok) {
                // Redirect ke halaman utama setelah auto login berhasil
                window.location.href = '/';
            } else {
                showToast('error', 'Error', 'Gagal melakukan auto login');
            }
        } else {
            showToast('error', 'Error', res.message || 'Auto login gagal');
        }
    } catch (error) {
        console.error('Auto login error:', error);
        showToast('error', 'Error', 'Terjadi kesalahan saat auto login');
    } finally {
        setIsAuthLoading(false);
    }
};