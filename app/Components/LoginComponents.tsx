import { ArrowLeftEndOnRectangleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

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
                    className="mt-1 p-2 text-white w-full border border-slate-700 rounded-md focus:border-slate-100 outline-none ring-0 focus:outline-none focus:ring-gray-300 transition-colors duration-300 disabled:bg-slate-700"
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
                    className="mt-1 p-2 text-white w-full border border-slate-700 rounded-md focus:border-slate-100 outline-none ring-0 focus:outline-none focus:ring-gray-300 transition-colors duration-300 disabled:bg-slate-700"
                    autoComplete="new-password"
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
                        className="w-full bg-blue-900 text-white p-2 rounded-md hover:bg-blue-800 focus:outline-none focus:bg-blue-900 focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-300 cursor-pointer flex items-center justify-center gap-2"
                    >
                        <div>
                            {!isAuthLoading ? (
                                <ArrowLeftEndOnRectangleIcon className="w-4 h-4" />
                            ) : (
                                <ArrowPathIcon className="h-5 w-5 animate-spin" />
                            )}
                        </div>
                        <div>
                            {isAuthLoading ? 'Sedang Authentikasi...' : 'Masuk'}
                        </div>
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
        <div className="mt-4 flex flex-col lg:flex-row items-center justify-center flex-wrap gap-4">
            <div className="w-full lg:w-2/3 mb-2 lg:mb-0">
                <button
                    type="button"
                    className="w-full flex justify-center items-center gap-2 bg-blue-900 text-sm text-white p-2 rounded-md hover:bg-blue-700 border border-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-colors duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading || isAuthLoading}
                    onClick={onGoogleLogin}
                >
                    <GoogleIcon />
                    Masuk menggunakan Google
                </button>
            </div>

            <div className="w-full lg:w-2/3 mb-2 lg:mb-0">
                <button
                    type="button"
                    className="w-full flex justify-center items-center gap-2 bg-blue-900 text-sm text-white p-2 rounded-md hover:bg-blue-700 border border-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-colors duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading || isAuthLoading}
                    onClick={onSemestaLogin}
                >
                    <img
                        src="https://semesta.oganilirkab.go.id/assets_login/images/bw_icon_only@4x.png"
                        alt="Semesta"
                        className="w-5 h-5"
                    />
                    Masuk menggunakan Semesta
                </button>
            </div>
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
        <div className="fixed top-0 left-0 w-full h-screen bg-[url('/login-bg.jpg')] bg-opacity-50 bg-cover bg-center bg-no-repeat -z-2"></div>
        <div className="fixed top-0 left-0 w-full h-screen bg-radial-[at_25%_55%] to-slate-300/50 from-slate-900/70 bg-cover bg-center bg-no-repeat -z-1"></div>
    </>
);

export const LoginLeftPanel = () => (
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
    <div className="mt-10">
        <div className="text-center text-white text-sm font-semibold">
            Copyright © {new Date().getFullYear() === 2023 ? 2023 : `2023 - ${new Date().getFullYear()}`} <br />
            Diskominfo Kabupaten Ogan Ilir
        </div>
    </div>
);