"use client";
import { serverCheck } from "@/apis/serverConfig";
import { Suspense, useEffect, useState } from "react";
import { setCookie, getCookie, deleteCookie } from 'cookies-next';
import { signIn, useSession } from "next-auth/react";
import { atempLoginSemesta, attempLogin, loggedWithGoogle } from "@/apis/apiAuth";
import Swal from "sweetalert2";
import { ArrowLeftEndOnRectangleIcon } from "@heroicons/react/24/outline";
import LoginSemesta from "../Components/LoginSemesta";
import { useSearchParams } from "next/navigation";

const SweetAlertToast = (icon: any, title: any, text: any) => {
    return Swal.fire({
        position: 'top-end',
        icon: icon,
        title: title,
        text: text,
        showConfirmButton: false,
        timer: 5000,
        timerProgressBar: true,
        toast: true,
    })
}

const Page = () => {
    const [isMounted, setIsMounted] = useState(false);
    const MySession = useSession();
    useEffect(() => {
        setIsMounted(true);
    }, []);

    const [isLoading, setIsLoading] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    // const [loginType, setLoginType] = useState('local');
    const [isOpen, setIsOpen] = useState(false);
    const [formLogin, setFormLogin] = useState({
        username: '',
        password: '',
        isGoogle: false,
    });

    const handleLoginWithGoogle = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (isLoading) {
            return;
        }
        localStorage.setItem('logginByGoogle', 'true');
        signIn('google');
    }

    useEffect(() => {
        if (isMounted && MySession.status !== 'authenticated') {
            serverCheck().then((res) => {
                if (res.status == 'error') {
                    SweetAlertToast('info', 'Peringatan', 'Sesi Anda telah berakhir, silahkan login kembali');
                }

                if (res.status == 'success') {
                    if (res.data === null) {
                        localStorage.removeItem('token');
                        deleteCookie('token');
                        deleteCookie('user');
                    } else {
                        localStorage.setItem('user', JSON.stringify(res.data));
                    }
                }
                setIsLoading(false);
            });
        }

        if (isMounted && MySession.status === 'authenticated') {
            if (getCookie('token')) {
                // Server Check start
                serverCheck().then((res) => {
                    if (res.status == 'error') {
                        SweetAlertToast('info', 'Peringatan', 'Sesi Anda telah berakhir, silahkan login kembali');
                    }

                    if (res.status == 'success') {
                        if (res.data === null) {
                            localStorage.removeItem('token');
                            deleteCookie('token');
                            deleteCookie('user');
                        } else {
                            localStorage.setItem('user', JSON.stringify(res.data));
                            setCookie('user', JSON.stringify(res.data), { maxAge: 60 * 60 * 24 * 30 });
                            window.location.href = '/';
                        }
                    }
                    setIsLoading(false);
                });
                // Server Check end
            }

            if (localStorage.getItem('logginByGoogle') === 'true') {
                if (!getCookie('token')) {
                    loggedWithGoogle({
                        email: MySession.data?.user?.email,
                        name: MySession.data?.user?.name,
                        image: MySession.data?.user?.image,
                    }).then((res) => {
                        if (res.status === 'success') {
                            localStorage.setItem('token', res.data.token);
                            localStorage.setItem('user', JSON.stringify(res.data.user));
                            setCookie('token', res.data.token);
                            setCookie('user', JSON.stringify(res.data.user));
                            localStorage.removeItem('logginByGoogle');
                            signIn('google', {
                                callbackUrl: '/',
                            });
                            window.location.href = '/';
                        } else {
                            SweetAlertToast('error', 'Error', res.message);
                        }
                    });
                }
            }
        }
    }, [isMounted, MySession]);

    const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isLoading) {
            return;
        }
        if (MySession.status === 'authenticated') {
            return;
        }
        setIsLoading(true);
        // if (formLogin.username === '' || formLogin.password === '') {
        //     SweetAlertToast('warning', 'Peringatan', 'Username dan Password tidak boleh kosong');
        //     setIsLoading(false);
        //     return;
        // }


        attempLogin(formLogin).then((res) => {
            if (res.status === 'success') {
                setCookie('token', res.data.token);
                setCookie('user', JSON.stringify(res.data.user));
                localStorage.setItem('user', JSON.stringify(res.data.user));
                signIn('credentials', {
                    username: formLogin.username,
                    password: formLogin.password,
                    redirect: false,
                });
                // window.location.href = '/';
            } else {
            }
            setIsLoading(false);
        })
    }

    const handleLoginSemesta = (data: any) => {
        atempLoginSemesta(data).then((res) => {
            if (res.status === 'success') {
                setCookie('token', res.data.token);
                setCookie('user', JSON.stringify(res.data.user));
                localStorage.setItem('user', JSON.stringify(res.data.user));
                signIn('credentials', {
                    username: data.nip,
                    password: data.password,
                    redirect: false,
                });
                // window.location.href = '/';
            } else {
            }
            setIsLoading(false);
        });
    }

    const Params = useSearchParams();
    const typeAutoLogin = Params.get("ao-semesta");
    const autoLoginNip = Params.get("nip");
    const autoLoginKey = Params.get("key");

    useEffect(() => {
        if (isMounted && typeAutoLogin === 'true' && autoLoginNip && autoLoginKey == '049976129942') {
            autoLogin();
        }
    }, [isMounted && Params])

    const autoLogin = () => {
        attempLogin({
            username: autoLoginNip,
            password: formLogin.password,
            autoLogin: '1',
        }).then((res) => {
            if (res.status === 'success') {
                console.log(res)
                setCookie('token', res.data.token);
                setCookie('user', JSON.stringify(res.data.user));
                localStorage.setItem('user', JSON.stringify(res.data.user));
                signIn('credentials', {
                    username: autoLoginNip,
                    // password: formLogin.password,
                    autoLogin: '1',
                    redirect: false,
                });
                // reloadPage();
            } else {
            }
            setIsLoading(false);
        })
    }

    const reloadPage = () => {
        setTimeout(() => {
            // window.location.reload();
            window.location.href = '/login';
        }, 1000);
    }

    // console.log({ MySession });


    return (
        <Suspense fallback={<div></div>}>
            <div className="">
                <div className="fixed top-0 left-0 w-full h-screen bg-[url('/login-bg.jpg')] bg-opacity-50 bg-cover bg-center bg-no-repeat -z-2"></div>
                <div className="fixed top-0 left-0 w-full h-screen bg-radial-[at_25%_55%] to-slate-300/50 from-slate-900/70 bg-cover bg-center bg-no-repeat -z-1"></div>
                <div className="flex w-full h-screen items-center justify-center -my-6">
                    <div className="hidden lg:flex items-center justify-center flex-1 text-black">
                        <div className="max-w-md text-center">
                            <div className="mb-6">
                                <img
                                    alt="Drive Ogan Ilir"
                                    src="/logo.png"
                                    className="h-40 w-full object-contain"
                                />
                            </div>
                            <p className="text-sm font-normal mb-6 text-white text-center">
                                Drive Ogan Ilir adalah aplikasi berbasis web yang memudahkan masyarakat Kabupaten Ogan Ilir dalam menyimpan dan berbagi file secara online.
                            </p>
                        </div>
                    </div>
                    <div className="w-full h-full overflow-y-auto bg-[#243158] lg:w-1/2 flex items-center justify-center">
                        <div className="max-w-md w-full p-6">
                            <div className="mb-20 flex items-center justify-center gap-x-2">
                                <img
                                    alt="Drive Ogan Ilir"
                                    src="/logo-oi.webp"
                                    className="h-28 w-full object-contain"
                                />
                                <img
                                    alt="Drive Ogan Ilir"
                                    src="/favicon.png"
                                    className="h-25 w-full object-contain"
                                />
                            </div>
                            <div className="mt-4 flex flex-col lg:flex-row items-center justify-center flex-wrap gap-4">
                                <div className="w-full lg:w-2/3 mb-2 lg:mb-0">
                                    <button
                                        type="button"
                                        className="w-full flex justify-center items-center gap-2 bg-blue-900 text-sm text-white p-2 rounded-md hover:bg-blue-700 border border-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-colors duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={isLoading}
                                        onClick={(e) => {
                                            handleLoginWithGoogle(e);
                                        }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-4" id="google">
                                            <path fill="#fbbb00" d="M113.47 309.408 95.648 375.94l-65.139 1.378C11.042 341.211 0 299.9 0 256c0-42.451 10.324-82.483 28.624-117.732h.014L86.63 148.9l25.404 57.644c-5.317 15.501-8.215 32.141-8.215 49.456.002 18.792 3.406 36.797 9.651 53.408z"></path>
                                            <path fill="#518ef8" d="M507.527 208.176C510.467 223.662 512 239.655 512 256c0 18.328-1.927 36.206-5.598 53.451-12.462 58.683-45.025 109.925-90.134 146.187l-.014-.014-73.044-3.727-10.338-64.535c29.932-17.554 53.324-45.025 65.646-77.911h-136.89V208.176h245.899z"></path>
                                            <path fill="#28b446" d="m416.253 455.624.014.014C372.396 490.901 316.666 512 256 512c-97.491 0-182.252-54.491-225.491-134.681l82.961-67.91c21.619 57.698 77.278 98.771 142.53 98.771 28.047 0 54.323-7.582 76.87-20.818l83.383 68.262z"></path>
                                            <path fill="#f14336" d="m419.404 58.936-82.933 67.896C313.136 112.246 285.552 103.82 256 103.82c-66.729 0-123.429 42.957-143.965 102.724l-83.397-68.276h-.014C71.23 56.123 157.06 0 256 0c62.115 0 119.068 22.126 163.404 58.936z"></path>
                                        </svg> Masuk menggunakan Google </button>
                                </div>
                                <div className="w-full lg:w-2/3 mb-2 lg:mb-0">
                                    <button
                                        type="button"
                                        className="w-full flex justify-center items-center gap-2 bg-blue-900 text-sm text-white p-2 rounded-md hover:bg-blue-700 border border-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-colors duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={isLoading}
                                        onClick={(e) => {
                                            setIsOpen(true);
                                        }}
                                    >
                                        <img src="https://semesta.oganilirkab.go.id/assets_login/images/bw_icon_only@4x.png" alt="Semesta" className="w-5 h-5" />
                                        Masuk menggunakan Semesta
                                    </button>
                                </div>
                            </div>
                            <div className="my-4 text-sm text-white text-center">
                                <p className="mb-4">
                                    Atau masuk menggunakan akun Drive Ogan Ilir
                                </p>
                                <hr className="text-slate-700" />
                            </div>
                            <form
                                onSubmit={(e) => {
                                    handleLogin(e);
                                }}
                                className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-white">
                                        Username
                                    </label>
                                    <input
                                        type="text"
                                        className="mt-1 p-2 text-white w-full border border-slate-700 rounded-md focus:border-slate-100 outline-none ring-0 focus:outline-none focus:ring-gray-300 transition-colors duration-300"
                                        autoComplete="new-username"
                                        placeholder="Masukkan username"
                                        defaultValue={formLogin.username}
                                        onChange={(e) => {
                                            setFormLogin({
                                                ...formLogin,
                                                username: e.target.value,
                                            });
                                        }}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-white">Password</label>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        className="mt-1 p-2 text-white w-full border border-slate-700 rounded-md focus:border-slate-100 outline-none ring-0 focus:outline-none focus:ring-gray-300 transition-colors duration-300"
                                        autoComplete="new-password"
                                        placeholder="Masukkan password"
                                        defaultValue={formLogin.password}
                                        onChange={(e) => {
                                            setFormLogin({
                                                ...formLogin,
                                                password: e.target.value,
                                            });
                                        }}

                                    />
                                    <div className="mt-1">
                                        <input
                                            type="checkbox"
                                            id="showPasswordCheckbox"
                                            value='true'
                                            checked={showPassword}
                                            className="mt-1 mr-2"
                                            onChange={(e) => {
                                                setShowPassword(!showPassword);
                                            }}
                                        />
                                        <label
                                            htmlFor="showPasswordCheckbox"
                                            className="text-sm text-white cursor-pointer select-none">
                                            Tampilkan password
                                        </label>
                                    </div>
                                </div>
                                <div>
                                    {MySession.status === 'loading' && (
                                        <div className="w-full bg-blue-900 text-white p-2 rounded-md hover:bg-blue-800 focus:outline-none focus:bg-blue-900 focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-300 cursor-pointer flex items-center justify-center gap-2">
                                            <div className="animate-spin">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6 text-white animate-spin">
                                                    <path fill="currentColor" d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8.009,8.009,0,0,1,12,20Z" />
                                                    <path fill="currentColor" d="M16.95,7.05a1.5,1.5,0,1,1-2.121-2.121l2.121-2.121a1.5,1.5,0,1,1,.707.707Z" />
                                                </svg>
                                            </div>
                                        </div>
                                    )}
                                    {MySession.status !== 'authenticated' && (
                                        <button
                                            disabled={isLoading}
                                            type="submit"
                                            className="w-full bg-blue-900 text-white p-2 rounded-md hover:bg-blue-800 focus:outline-none focus:bg-blue-900 focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-300 cursor-pointer flex items-center justify-center gap-2">
                                            <div className="">
                                                <ArrowLeftEndOnRectangleIcon className="w-4 h-4" />
                                            </div>
                                            <div className="">
                                                {isLoading ? 'Sedang Authentikasi...' : 'Masuk'}
                                            </div>
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>

                    </div>
                </div>

                {/* modal */}
                <LoginSemesta
                    isOpen={isOpen}
                    isLoading={isLoading}
                    onClose={() => setIsOpen(false)}
                    onSubmit={(data) => {
                        handleLoginSemesta(data);
                    }}
                />
            </div>
        </Suspense>
    );
}

export default Page;