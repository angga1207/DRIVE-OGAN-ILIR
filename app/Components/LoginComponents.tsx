import { ArrowLeftEndOnRectangleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { FaGooglePlay, FaApple } from "react-icons/fa6";
import { GiExitDoor } from "react-icons/gi";


interface LoginFormProps {
    formLogin: {
        username: string;
        password: string;
        isGoogle: boolean;
    };
    updateForm: (field: 'username' | 'password' | 'isGoogle', value: string | boolean) => void;
    showPassword: boolean;
    setShowPassword: (show: boolean) => void;
    isLoading: boolean;
    isAuthLoading: boolean;
    isAuthenticated: boolean;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export const LoginForm = ({
    formLogin,
    updateForm,
    showPassword,
    setShowPassword,
    isLoading,
    isAuthLoading,
    isAuthenticated,
    onSubmit,
}: LoginFormProps) => {
    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-white">
                    Username
                </label>
                <input
                    type="text"
                    className="mt-1 p-2 text-white w-full border border-white rounded-md focus:border-slate-100 outline-none ring-0 focus:outline-none focus:ring-gray-300 transition-colors duration-300 disabled:bg-slate-500/50"
                    autoComplete="new-username"
                    placeholder="Masukkan username"
                    value={formLogin.username}
                    disabled={isLoading || isAuthLoading}
                    onChange={(e) => updateForm('username', e.target.value)}
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-white">Password</label>
                <input
                    type={showPassword ? 'text' : 'password'}
                    className="mt-1 p-2 text-white w-full border border-white rounded-md focus:border-slate-100 outline-none ring-0 focus:outline-none focus:ring-gray-300 transition-colors duration-300 disabled:bg-slate-500/50"
                    autoComplete="new-password"
                    autoSave='off'
                    placeholder="Masukkan password"
                    value={formLogin.password}
                    disabled={isLoading || isAuthLoading}
                    onChange={(e) => updateForm('password', e.target.value)}
                />
                <div className="mt-1">
                    <input
                        type="checkbox"
                        id="showPasswordCheckbox"
                        checked={showPassword}
                        disabled={isLoading || isAuthLoading}
                        className="mt-1 mr-2"
                        onChange={() => setShowPassword(!showPassword)}
                    />
                    <label
                        htmlFor="showPasswordCheckbox"
                        className="text-sm text-white cursor-pointer select-none"
                    >
                        Tampilkan password
                    </label>
                </div>
            </div>

            <div>
                {!isAuthenticated && (
                    <button
                        disabled={isLoading || isAuthLoading}
                        type="submit"
                        className="w-full relative flex items-center justify-center gap-2 group overflow-hidden bg-gradient-to-r from-slate-100 to-slate-200 py-2 px-3 rounded-lg border border-slate-400 shadow-lg hover:shadow-xl transition-all duration-500 cursor-pointer"
                    >
                        {/* Scan Animation Overlay */}
                        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>

                        <div>
                            {!isAuthLoading ? (
                                <GiExitDoor className="w-5 h-5" />
                            ) : (
                                <ArrowPathIcon className="h-5 w-5 animate-spin" />
                            )}
                        </div>
                        <div>
                            {isAuthLoading ? 'Sedang Authentikasi...' : 'Masuk'}
                        </div>

                        {/* Glow effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-200/20 to-indigo-300/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg"></div>
                    </button>
                )}
            </div>
        </form>
    );
};

interface SocialLoginButtonsProps {
    isLoading: boolean;
    isAuthLoading: boolean;
    onGoogleLogin: () => void;
    onSemestaLogin: () => void;
}

export const SocialLoginButtons = ({
    isLoading,
    isAuthLoading,
    onGoogleLogin,
    onSemestaLogin,
}: SocialLoginButtonsProps) => {
    return (
        <div className="mt-4 flex flex-col items-center justify-center gap-4">
            <button
                type="button"
                className="w-full relative flex items-center justify-center gap-2 group overflow-hidden bg-gradient-to-r from-slate-100 to-slate-200 py-2 px-3 rounded-lg border border-slate-400 shadow-lg hover:shadow-xl transition-all duration-500 cursor-pointer"
                disabled={isLoading || isAuthLoading}
                onClick={onGoogleLogin}
            >
                {/* Scan Animation Overlay */}
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>

                <GoogleIcon />
                <div className='font-semibold whitespace-nowrap'>
                    Masuk menggunakan Google
                </div>

                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-200/20 to-indigo-300/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg"></div>
            </button>

            <button
                type="button"
                className="w-full relative flex items-center justify-center gap-2 group overflow-hidden bg-gradient-to-r from-slate-100 to-slate-200 py-2 px-3 rounded-lg border border-slate-400 shadow-lg hover:shadow-xl transition-all duration-500 cursor-pointer"
                disabled={isLoading || isAuthLoading}
                onClick={onSemestaLogin}
            >
                {/* Scan Animation Overlay */}
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
                <img
                    src="/logo-semesta.png"
                    alt="Semesta"
                    className="w-5 h-5"
                />
                <div className='font-semibold whitespace-nowrap'>
                    Masuk menggunakan Semesta
                </div>

                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-200/20 to-indigo-300/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg"></div>
            </button>
        </div>
    );
};

const GoogleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-4" id="google">
        <path fill="#fbbb00" d="M113.47 309.408 95.648 375.94l-65.139 1.378C11.042 341.211 0 299.9 0 256c0-42.451 10.324-82.483 28.624-117.732h.014L86.63 148.9l25.404 57.644c-5.317 15.501-8.215 32.141-8.215 49.456.002 18.792 3.406 36.797 9.651 53.408z"></path>
        <path fill="#518ef8" d="M507.527 208.176C510.467 223.662 512 239.655 512 256c0 18.328-1.927 36.206-5.598 53.451-12.462 58.683-45.025 109.925-90.134 146.187l-.014-.014-73.044-3.727-10.338-64.535c29.932-17.554 53.324-45.025 65.646-77.911h-136.89V208.176h245.899z"></path>
        <path fill="#28b446" d="m416.253 455.624.014.014C372.396 490.901 316.666 512 256 512c-97.491 0-182.252-54.491-225.491-134.681l82.961-67.91c21.619 57.698 77.278 98.771 142.53 98.771 28.047 0 54.323-7.582 76.87-20.818l83.383 68.262z"></path>
        <path fill="#f14336" d="m419.404 58.936-82.933 67.896C313.136 112.246 285.552 103.82 256 103.82c-66.729 0-123.429 42.957-143.965 102.724l-83.397-68.276h-.014C71.23 56.123 157.06 0 256 0c62.115 0 119.068 22.126 163.404 58.936z"></path>
    </svg>
);

export const LoginBackground = () => (
    <>
        <div className="fixed top-0 left-0 w-full lg:w-1/2 h-full bg-[url('/login-bg.png')] bg-center bg-opacity-50 bg-cover bg-no-repeat -z-2"></div>
        {/* <div className="fixed top-0 left-0 w-full h-screen bg-radial-[at_25%_55%] to-slate-800/50 from-slate-500/70 bg-cover bg-center bg-no-repeat -z-1"></div> */}
    </>
);

export const LoginLeftPanel = () => (
    <div className="hidden lg:flex items-center justify-center flex-1 text-black">
        <div className="max-w-md text-center">
            <Link
                href={'/filosofi.pdf'}
                download={true}
                target="_blank"
                rel="noopener noreferrer"
                className="mb-6 flex items-center justify-center gap-x-4 select-none">
                <img
                    alt="Drive Ogan Ilir"
                    // src="/logo.png"
                    src="/favicon.png"
                    className="h-40 w-full object-contain"
                />
                <img
                    alt="Drive Ogan Ilir"
                    src="/word.png"
                    className="h-32 w-full object-contain"
                />
            </Link>
            <p className="text-sm font-semibold mb-6 text-center text-white select-none">
                {/* Drive Ogan Ilir adalah aplikasi berbasis web yang memudahkan masyarakat Kabupaten Ogan Ilir dalam menyimpan dan berbagi file secara online. */}
                Drive Ogan Ilir hadir sebagai solusi digital yang memudahkan dalam menyimpan dan berbagi file secara daring. Lebih praktis, aman, dan dapat diakses kapan saja.
            </p>

            <div className="flex justify-center gap-4 mt-4">
                <a
                    href="https://play.google.com/store/apps/details?id=id.go.oganilirkab.drive"
                    className="relative flex items-center gap-2 text-white group overflow-hidden bg-gradient-to-r from-green-600 to-green-500 px-4 py-2 rounded-lg border border-green-400 shadow-lg hover:shadow-xl transition-all duration-500"
                    target='_blank'
                    rel='noopener noreferrer'
                >
                    {/* Scan Animation Overlay */}
                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>

                    <FaGooglePlay className="h-5 w-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 relative z-10" />
                    <div className='text-xl font-semibold group-hover:text-green-100 transition-all duration-500 relative z-10'>
                        <span className="sr-only">Download di</span> Google Play
                    </div>

                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-green-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg"></div>
                </a>

                {/* <a
                    href="https://apps.apple.com/id/app/drive-ogan-ilir/id6444251234"
                    className="relative flex items-center gap-2 text-white group overflow-hidden bg-gradient-to-r from-gray-800 to-gray-700 px-4 py-2 rounded-lg border border-gray-600 shadow-lg hover:shadow-xl transition-all duration-500"
                    target='_blank'
                    rel='noopener noreferrer'
                >
                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>

                    <FaApple className="h-5 w-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 relative z-10" />
                    <div className='text-xl font-semibold group-hover:text-gray-100 transition-all duration-500 relative z-10'>
                        <span className="sr-only">Download di</span> App Store
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-r from-gray-600/20 to-gray-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg"></div>
                </a> */}

            </div>

        </div>
    </div>
);

export const LoginHeader = () => (
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
);

export const LoginFooter = () => (
    <div className="mt-10 text-center text-white text-sm font-semibold hover:underline hover:text-[#003a69] transition-all duration-300 select-none">
        <Link
            href={`https://hakcipta.dgip.go.id/legal/c/OTc1NGQxNGQ4MGFlNjExZDY0ZGI5MGU0YmZjOTI0Yzg=`}
            target='_blank'
            className="">
            Copyright © {new Date().getFullYear() === 2023 ? 2023 : `2023 - ${new Date().getFullYear()}`} <br />
            Diskominfo Kabupaten Ogan Ilir
        </Link>
    </div>
);