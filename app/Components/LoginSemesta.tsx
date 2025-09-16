"use client";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { ArrowPathIcon, ArrowRightCircleIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react';


const LoginSemesta = (
    {
        isOpen,
        isLoading,
        onClose,
        onSubmit,
    }: {
        isOpen: boolean,
        isLoading: boolean,
        onClose: () => void,
        onSubmit: (data: any) => void,
    }
) => {
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);

    const [showPassword, setShowPassword] = useState(false);

    const [loginForm, setLoginForm] = useState({
        nip: '',
        password: '',
    });

    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-10">
            <DialogBackdrop
                transition
                className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
            />

            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
                    <DialogPanel
                        transition
                        className="relative transform overflow-hidden rounded-[50px] border-2 border-white bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-5xl data-closed:sm:translate-y-0 data-closed:sm:scale-95"
                    >
                        <div className="">

                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    if (isLoading === false) {
                                        onSubmit(loginForm);
                                    }
                                }}
                                className="grid grid-cols-12 gap-4 font-normal">

                                <div className="hidden col-span-12 lg:col-span-6 md:flex flex-col items-center justify-center bg-[linear-gradient(135deg,#0a1f44,#092744)] p-[60px]">
                                    <img src="https://semesta.oganilirkab.go.id/assets/media/logos/Logo_Semesta_Putih.png" alt="Logo Semesta" className="m-4" width="120" />
                                    <p className="mt-3 text-white text-center">
                                        Aplikasi Semesta tersedia dalam versi mobile <br />
                                        yang dapat di download melalui.
                                    </p>
                                    <div className="flex items-center justify-center gap-3 mt-10">
                                        <a href="https://play.google.com/store/apps/details?id=id.go.oganilirkab.semesta&amp;pcampaignid=web_share" target="_blank" type="button" className="flex items-center bg-white py-2 px-4 rounded hover:shadow-lg transition-all duration-200">
                                            <img alt="Logo" src="https://semesta.oganilirkab.go.id/assets/media/svg/brand-logos/google-play-store.svg" className="h-[20px] me-3" />
                                            Playstore
                                        </a>
                                        <a href="https://apps.apple.com/us/app/semesta-ogan-ilir/id6478474367" target="_blank" type="button" className="flex items-center bg-white py-2 px-4 rounded hover:shadow-lg transition-all duration-200">
                                            <img alt="Logo" src="https://semesta.oganilirkab.go.id/assets/media/svg/brand-logos/apple-black.svg" className="h-[20px] me-3" />App Store</a>
                                    </div>
                                </div>

                                <div className="col-span-12 lg:col-span-6 flex flex-col gap-4 p-[60px]">

                                    <div className="font-semibold text-lg text-center text-slate-600">
                                        Login Drive Ogan Ilir <br /> menggunakan akun Semesta
                                    </div>

                                    <div className="">
                                        <label className="font-semibold text-sm mb-1 text-slate-400 select-none">
                                            NIP
                                        </label>
                                        <input className="w-full p-2 border border-slate-400 rounded ring-0 focus:ring-0 outline-0 disabled:bg-slate-200"
                                            defaultValue={loginForm?.nip}
                                            disabled={isLoading}
                                            autoComplete="new-password"
                                            onChange={(e) => {
                                                setLoginForm({
                                                    ...loginForm,
                                                    nip: e.target.value
                                                });
                                            }}
                                            placeholder='Masukkan NIP' />
                                        <div id="error-users-firstname" className="text-xs text-red-500"></div>
                                    </div>

                                    <div className="">
                                        <label className="font-semibold text-sm mb-1 text-slate-400 select-none">
                                            Password
                                        </label>
                                        <div className="relative">
                                            <input className="w-full p-2 border border-slate-400 rounded ring-0 focus:ring-0 outline-0 disabled:bg-slate-200"
                                                defaultValue={loginForm?.password}
                                                disabled={isLoading}
                                                autoComplete="new-password"
                                                onChange={(e) => {
                                                    setLoginForm({
                                                        ...loginForm,
                                                        password: e.target.value
                                                    });
                                                }}
                                                type={showPassword ? 'text' : 'password'}
                                                placeholder='Masukkan Password' />
                                            <div className="absolute w-10 h-full right-0 top-0 cursor-pointer flex items-center justify-center bg-slate-100 border border-slate-400 rounded-r"
                                                onClick={() => setShowPassword(!showPassword)}>
                                                {showPassword ? <EyeIcon className="h-4 w-4 text-green-500" /> : <EyeSlashIcon className="h-4 w-4 text-slate-400" />}
                                            </div>
                                        </div>
                                        <div id="error-users-password" className="text-xs text-red-500"></div>
                                    </div>

                                    <div className="">
                                        <button
                                            disabled={isLoading}
                                            type="submit"
                                            className="w-full flex items-center justify-center gap-2 bg-[#009ef7] hover:bg-[#007acc] text-white font-semibold py-2 px-4 rounded disabled:opacity-50 select-none transition-all duration-200">
                                            <div className="">
                                                {isLoading ? 'Sedang Authentikasi...' : 'Masuk menggunakan Semesta'}
                                            </div>

                                            {!isLoading ? (
                                                <ArrowRightCircleIcon className="h-5 w-5" />
                                            ) : (
                                                <ArrowPathIcon className="h-5 w-5 animate-spin" />
                                            )}

                                        </button>
                                    </div>

                                    <div className="text-center mt-3">
                                        <span className='text-xs text-slate-500'>Copyright © 2025 Diskominfo Kab. Ogan Ilir</span>
                                    </div>

                                </div>

                            </form>
                        </div>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    )
}

export default LoginSemesta