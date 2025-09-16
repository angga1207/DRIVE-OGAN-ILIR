"use client";
import { syncWithGoogle, syncWithSemesta } from "@/apis/apiAuth";
import { getActivities, updateProfile } from "@/apis/apiProfile";
import { ArrowLeftOnRectangleIcon } from "@heroicons/react/20/solid";
import { ArrowDownTrayIcon, ArrowLeftEndOnRectangleIcon, ArrowPathRoundedSquareIcon, ArrowsPointingOutIcon, ArrowUpTrayIcon, CalendarDaysIcon, CheckBadgeIcon, ExclamationCircleIcon, EyeIcon, EyeSlashIcon, FolderPlusIcon, PencilSquareIcon, PresentationChartLineIcon, ShareIcon, TrashIcon, UserIcon } from "@heroicons/react/24/outline";
import { getCookie, setCookie } from "cookies-next";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import LoginSemesta from "../Components/LoginSemesta";

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

const Profile = () => {
    const [isMounted, setIsMounted] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [showPassword, setShowPassword] = useState(false);

    const [activities, setActivities] = useState<any>(null);
    const [isLoadingActivities, setIsLoadingActivities] = useState(false);
    const [actCurrentPage, setActCurrentPage] = useState(1);
    const [actTotalPage, setActTotalPage] = useState(1);
    const [actTotalData, setActTotalData] = useState(0);
    const [isLoadingSave, setIsLoadingSave] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (isMounted) {
            const cookieUser = getCookie('user');
            if (cookieUser) {
                const user = JSON.parse(cookieUser as string);
                setUser({
                    ...user,
                    password: '',
                    password_confirmation: '',
                    new_photo: '',
                });

                setIsLoadingActivities(true);
                getActivities().then((res: any) => {
                    if (res.status === 'success') {
                        setActivities(res.data.data);
                        setActCurrentPage(res.data.current_page);
                        setActTotalPage(res.data.last_page);
                        setActTotalData(res.data.total);
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Gagal',
                            text: res.message,
                            showConfirmButton: false,
                            timer: 5000,
                            position: 'center',
                        });
                    }
                    setIsLoadingActivities(false);
                })
            }
        }
    }, [isMounted]);

    useEffect(() => {
        if (isMounted) {
            setIsLoadingActivities(true);
            getActivities(actCurrentPage).then((res: any) => {
                if (res.status === 'success') {
                    setActivities(res.data.data);
                    setActCurrentPage(res.data.current_page);
                    setActTotalPage(res.data.last_page);
                    setActTotalData(res.data.total);
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Gagal',
                        text: res.message,
                        showConfirmButton: false,
                        timer: 5000,
                        position: 'center',
                    });
                }
                setIsLoadingActivities(false);
            })
        }
    }, [actCurrentPage]);

    const handleSaveProfile = async (user: any) => {
        setIsLoadingSave(true);
        const firstname = document.getElementById('error-profile-firstname') as HTMLInputElement;
        const lastname = document.getElementById('error-profile-lastname') as HTMLInputElement;
        const username = document.getElementById('error-profile-username') as HTMLInputElement;
        const email = document.getElementById('error-profile-email') as HTMLInputElement;
        const password = document.getElementById('error-profile-password') as HTMLInputElement;
        const password_confirmation = document.getElementById('error-profile-password_confirmation') as HTMLInputElement;

        if (user.name.firstname === '') {
            firstname.innerHTML = 'Nama depan tidak boleh kosong';
            setIsLoadingSave(false);
            return;
        }
        if (user.name.lastname === '') {
            lastname.innerHTML = 'Nama belakang tidak boleh kosong';
            setIsLoadingSave(false);
            return;
        }
        if (user.username === '') {
            username.innerHTML = 'Nama pengguna tidak boleh kosong';
            setIsLoadingSave(false);
            return;
        }
        if (user.email === '') {
            email.innerHTML = 'Email tidak boleh kosong';
            setIsLoadingSave(false);
            return;
        }
        // if (user.password === '') {
        //     password.innerHTML = 'Password tidak boleh kosong';
        //     return;
        // }
        if (user.password !== user.password_confirmation) {
            password_confirmation.innerHTML = 'Password tidak sama';
            setIsLoadingSave(false);
            return;
        }

        const formData = new FormData();
        formData.append('firstname', user.name.firstname);
        formData.append('lastname', user.name.lastname);
        formData.append('username', user.username);
        formData.append('email', user.email);
        formData.append('password', user.password);
        formData.append('password_confirmation', user.password_confirmation);
        formData.append('photo', user.new_photo);


        updateProfile(formData).then((res: any) => {
            if (res.status === 'success') {
                const userLocal = localStorage.getItem('user');
                if (userLocal) {
                    const parsedUser = JSON.parse(userLocal);
                    setUser({
                        ...parsedUser,
                        ...res.data,
                        password: '',
                        password_confirmation: '',
                        new_photo: '',
                    });
                    localStorage.setItem('user', JSON.stringify({
                        ...parsedUser,
                        ...res.data,
                        password: '',
                        password_confirmation: '',
                        new_photo: '',
                    }));

                    Swal.fire({
                        icon: 'success',
                        title: 'Berhasil',
                        text: 'Profil berhasil diperbarui',
                        showConfirmButton: false,
                        timer: 5000,
                        // toast: true,
                        position: 'center',
                    });
                }
            } else if (res.status === 'error validation') {
                Swal.fire({
                    icon: 'error',
                    title: 'Validasi Gagal',
                    text: res.message,
                    showConfirmButton: false,
                    timer: 5000,
                    position: 'center',
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal',
                    text: res.message,
                    showConfirmButton: false,
                    timer: 5000,
                    position: 'center',
                });
            }
            setIsLoadingSave(false);
        })
    }


    const handleSyncWithGoogle = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        localStorage.setItem('logginByGoogle', 'true');
        signIn('google');
    }

    const MySession = useSession();
    // console.log(MySession);
    useEffect(() => {
        if (localStorage.getItem('logginByGoogle') === 'true') {
            syncWithGoogle({
                email: MySession.data?.user?.email,
                name: MySession.data?.user?.name,
                image: MySession.data?.user?.image,
            }).then((res) => {
                if (res.status === 'success') {
                    localStorage.setItem('user', JSON.stringify(res.data.user));
                    setCookie('user', JSON.stringify(res.data.user));
                    localStorage.removeItem('logginByGoogle');
                    SweetAlertToast('success', 'Berhasil', res.message);
                } else {
                    SweetAlertToast('error', 'Error', res.message);
                    localStorage.removeItem('logginByGoogle');
                }
            });

        }
    }, [MySession]);

    const [isOpen, setIsOpen] = useState(false);

    const handleSyncSemesta = (data: any) => {
        syncWithSemesta(data).then((res) => {
            if (res.status === 'success') {
                localStorage.setItem('user', JSON.stringify(res.data.user));
                setCookie('user', JSON.stringify(res.data.user));
                SweetAlertToast('success', 'Berhasil', res.message);
                setIsOpen(false);

            } else {
                SweetAlertToast('error', 'Error', res.message);
            }
        });
    }

    return (
        <>
            <div className="w-full grid grid-cols-12 gap-4 place-items-stretch">
                <div className="col-span-12 lg:col-span-5">
                    <div className="card">
                        <div className="w-full flex items-center justify-start gap-x-2 select-none mb-4 pb-2 border-b border-slate-200">
                            <div className="w-16 shrink-0">
                                <div className="relative cursor-pointer group">
                                    <img
                                        src={user?.photo}
                                        alt="Profile Photo"
                                        className="w-16 h-16 rounded-full object-cover"
                                    />
                                    <div className="absolute top-0 left-0 w-full h-full bg-slate-200 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300">
                                        <div className="w-full h-full flex items-center justify-center">
                                            <div className="text-[7px] text-slate-500 text-center">
                                                Klik untuk mengubah foto profil
                                            </div>
                                        </div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            title="Klik untuk mengubah foto profil"
                                            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                                            onChange={(e: any) => {
                                                const file = e.target.files[0];
                                                const reader = new FileReader();
                                                reader.onloadend = () => {
                                                    setUser({
                                                        ...user,
                                                        new_photo: file,
                                                        photo: reader.result
                                                    });
                                                    const errorElement = document.getElementById('error-profile-photo');
                                                    if (errorElement) {
                                                        errorElement.innerHTML = '';
                                                    }
                                                }
                                                reader.readAsDataURL(file);
                                            }} />
                                    </div>
                                </div>
                            </div>
                            <div className="grow">
                                <div className="text-lg font-semibold text-slate-900 line-clamp-1">
                                    {user?.name?.fullname}
                                </div>

                                <div className="flex items-center gap-x-2">
                                    <div className="text-sm text-slate-500">
                                        {user?.email}
                                    </div>
                                    <div className="group/info1 flex items-center gap-x-1">
                                        <ExclamationCircleIcon className="h-4 w-4 text-slate-500 cursor-pointer" />
                                        <div className="text-[10px] whitespace-nowrap text-slate-500 opacity-0 !w-[0px] group-hover/info1:w-auto group-hover/info1:opacity-100 transition-all duration-300">
                                            Diperbarui {' '}
                                            {new Date(user?.updated_at).toLocaleDateString('id-ID', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center flex-wrap gap-2">
                                    {user?.googleIntegated === true && (
                                        <div className="text-slate-500 flex items-center mt-0.5">
                                            <img src="/assets/images/google.png" alt="Google" className="w-3 h-3 mr-0.5" />
                                            <span className="whitespace-nowrap text-xs text-green-600">
                                                oogle Integrated
                                            </span>
                                        </div>
                                    )}
                                    {user?.semestaIntegrated === true && (
                                        <div className="text-slate-500 flex items-center mt-0.5">
                                            <img src="https://aptika.oganilirkab.go.id/storage/images/thumbnail/original/semesta-ogan-ilir.png" alt="Semesta" className="w-3 h-3 mr-0.5" />
                                            <span className="whitespace-nowrap text-xs font-semibold text-[#0a1f44]">
                                                Semesta Integrated
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center flex-wrap gap-4 mt-2">
                                    {user?.googleIntegated === false && (
                                        <div>
                                            <button
                                                type="button"
                                                className="w-full flex justify-center items-center gap-2 bg-blue-900 text-sm text-white px-2 py-1 font-semibold rounded-md hover:bg-blue-700 border border-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-colors duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                                onClick={(e) => {
                                                    handleSyncWithGoogle(e);
                                                }}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-4" id="google">
                                                    <path fill="#fbbb00" d="M113.47 309.408 95.648 375.94l-65.139 1.378C11.042 341.211 0 299.9 0 256c0-42.451 10.324-82.483 28.624-117.732h.014L86.63 148.9l25.404 57.644c-5.317 15.501-8.215 32.141-8.215 49.456.002 18.792 3.406 36.797 9.651 53.408z"></path>
                                                    <path fill="#518ef8" d="M507.527 208.176C510.467 223.662 512 239.655 512 256c0 18.328-1.927 36.206-5.598 53.451-12.462 58.683-45.025 109.925-90.134 146.187l-.014-.014-73.044-3.727-10.338-64.535c29.932-17.554 53.324-45.025 65.646-77.911h-136.89V208.176h245.899z"></path>
                                                    <path fill="#28b446" d="m416.253 455.624.014.014C372.396 490.901 316.666 512 256 512c-97.491 0-182.252-54.491-225.491-134.681l82.961-67.91c21.619 57.698 77.278 98.771 142.53 98.771 28.047 0 54.323-7.582 76.87-20.818l83.383 68.262z"></path>
                                                    <path fill="#f14336" d="m419.404 58.936-82.933 67.896C313.136 112.246 285.552 103.82 256 103.82c-66.729 0-123.429 42.957-143.965 102.724l-83.397-68.276h-.014C71.23 56.123 157.06 0 256 0c62.115 0 119.068 22.126 163.404 58.936z"></path>
                                                </svg>
                                                Integrasi Google
                                            </button>
                                        </div>
                                    )}
                                    {user?.semestaIntegrated === false && (
                                        <div>
                                            <button
                                                type="button"
                                                className="w-full flex justify-center items-center gap-2 bg-blue-900 text-sm text-white px-2 py-1 font-semibold rounded-md hover:bg-blue-700 border border-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-colors duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                                onClick={(e) => {
                                                    setIsOpen(true);
                                                }}
                                            >
                                                <img src="https://semesta.oganilirkab.go.id/assets_login/images/bw_icon_only@4x.png" alt="Semesta" className="w-5 h-5" />
                                                Integrasi Semesta
                                            </button>
                                        </div>
                                    )}

                                </div>
                            </div>
                        </div>

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSaveProfile(user);
                            }}
                            className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-slate-200">

                            <div className="col-span-2 lg:col-span-1">
                                <label className="text-xs font-semibold text-slate-600">
                                    Nama Depan
                                </label>
                                <input
                                    defaultValue={user?.name?.firstname}
                                    onChange={(e) => {
                                        setUser({ ...user, name: { ...user.name, firstname: e.target.value } });
                                        const errorElement = document.getElementById('error-profile-firstname');
                                        if (errorElement) {
                                            errorElement.innerHTML = '';
                                        }
                                    }}
                                    type="text"
                                    placeholder="Nama Depan"
                                    className="w-full p-2 border border-slate-300 rounded ring-0 focus:ring-0 outline-0" />
                                <div id="error-profile-firstname" className="text-xs text-red-500"></div>
                            </div>

                            <div className="col-span-2 lg:col-span-1">
                                <label className="text-xs font-semibold text-slate-600">
                                    Nama Belakang
                                </label>
                                <input
                                    defaultValue={user?.name?.lastname}
                                    onChange={(e) => {
                                        setUser({ ...user, name: { ...user.name, lastname: e.target.value } });
                                        const errorElement = document.getElementById('error-profile-lastname');
                                        if (errorElement) {
                                            errorElement.innerHTML = '';
                                        }
                                    }}
                                    type="text"
                                    placeholder="Nama Belakang"
                                    className="w-full p-2 border border-slate-300 rounded ring-0 focus:ring-0 outline-0" />
                                <div id="error-profile-lastname" className="text-xs text-red-500"></div>
                            </div>

                            <div className="col-span-2">
                                <label className="text-xs font-semibold text-slate-600">
                                    Nama Pengguna
                                </label>
                                <input
                                    defaultValue={user?.username}
                                    disabled={user?.semestaIntegrated === true}
                                    onChange={(e) => {
                                        setUser({ ...user, username: e.target.value });
                                        const errorElement = document.getElementById('error-profile-username');
                                        if (errorElement) {
                                            errorElement.innerHTML = '';
                                        }
                                    }}
                                    type="text"
                                    placeholder="Nama Pengguna"
                                    className="w-full p-2 border border-slate-300 rounded ring-0 focus:ring-0 outline-0 disabled:bg-slate-200" />
                                <div id="error-profile-username" className="text-xs text-red-500"></div>
                            </div>

                            <div className="col-span-2">
                                <label className="text-xs font-semibold text-slate-600">
                                    Email
                                </label>
                                <input
                                    defaultValue={user?.email}
                                    disabled={user?.googleIntegated === true}
                                    onChange={(e) => {
                                        setUser({ ...user, email: e.target.value });
                                        const errorElement = document.getElementById('error-profile-email');
                                        if (errorElement) {
                                            errorElement.innerHTML = '';
                                        }
                                    }}
                                    type="email"
                                    placeholder="email"
                                    className="w-full p-2 border border-slate-300 rounded ring-0 focus:ring-0 outline-0 disabled:bg-slate-200" />
                                <div id="error-profile-email" className="text-xs text-red-500"></div>
                            </div>

                            <div className="col-span-2">
                                <hr />
                            </div>

                            <div className="col-span-2">
                                <label className="text-xs font-semibold text-slate-600">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        defaultValue={''}
                                        onChange={(e) => {
                                            setUser({ ...user, password: e.target.value });
                                            const errorElement = document.getElementById('error-profile-password');
                                            if (errorElement) {
                                                errorElement.innerHTML = '';
                                            }
                                        }}
                                        autoComplete="new-password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Password"
                                        className="w-full p-2 border border-slate-300 rounded ring-0 focus:ring-0 outline-0" />

                                    <div className="absolute top-0 right-0 w-10 h-full flex items-center justify-center bg-slate-100 rounded-r">
                                        <div
                                            className=""
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ?
                                                <EyeIcon className="h-4 w-4 cursor-pointer" />
                                                :
                                                <EyeSlashIcon className="h-4 w-4 cursor-pointer" />
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div id="error-profile-password" className="text-xs text-red-500"></div>
                            </div>

                            <div className="col-span-2">
                                <label className="text-xs font-semibold text-slate-600">
                                    Konfirmasi Password
                                </label>
                                <div className="relative">
                                    <input
                                        defaultValue={''}
                                        onChange={(e) => {
                                            setUser({ ...user, password_confirmation: e.target.value });
                                            const errorElement = document.getElementById('error-profile-password_confirmation');
                                            if (errorElement) {
                                                errorElement.innerHTML = '';
                                            }
                                        }}
                                        autoComplete="new-password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Password"
                                        className="w-full p-2 border border-slate-300 rounded ring-0 focus:ring-0 outline-0" />

                                    <div className="absolute top-0 right-0 w-10 h-full flex items-center justify-center bg-slate-100 rounded-r">
                                        <div
                                            className=""
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ?
                                                <EyeIcon className="h-4 w-4 cursor-pointer" />
                                                :
                                                <EyeSlashIcon className="h-4 w-4 cursor-pointer" />
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div id="error-profile-password_confirmation" className="text-xs text-red-500"></div>
                            </div>

                            <div className="col-span-2">
                                <div className="flex items-center justify-center mt-5">
                                    <button
                                        type="submit"
                                        // onClick={() => handleSaveProfile(user)}
                                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center transition-all duration-500 cursor-pointer">
                                        <CheckBadgeIcon className="w-4 h-4 mr-1" />
                                        {/* Simpan */}
                                        {isLoadingSave ? 'Menyimpan...' : 'Simpan'}
                                    </button>
                                </div>
                            </div>

                        </form>

                        <div className="text-center">
                            <div className="text-xs text-slate-500">
                                © 2023 - {new Date().getFullYear()} Diskominfo Ogan Ilir. All rights reserved.
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-span-12 lg:col-span-7">
                    <div className="card">

                        <div className="relative w-full text-xs !h-[587px] overflow-auto">
                            <table className="w-full">
                                <thead className="sticky top-0 left-0 w-full">
                                    <tr>
                                        <th className="p-4 bg-slate-500 text-white rounded-tl w-[250px]">
                                            <div className="flex items-center">
                                                <CalendarDaysIcon className="w-4 h-4 mr-2" />
                                                <span>
                                                    Tanggal
                                                </span>
                                            </div>
                                        </th>
                                        <th className="p-4 bg-slate-500 text-white rounded-tr">
                                            <div className="flex items-center">
                                                <PresentationChartLineIcon className="w-4 h-4 mr-2" />
                                                <span>
                                                    Aktivitas
                                                </span>
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoadingActivities && (
                                        <tr>
                                            <td colSpan={2} className="p-4 text-slate-500">
                                                <div className="flex items-center justify-center">
                                                    <div className="w-5 h-5 border-4 border-slate-300 border-t-slate-500 rounded-full animate-spin"></div>
                                                    <div className="text-xs text-slate-500 ml-2">
                                                        Memuat aktivitas...
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}

                                    {activities?.map((activity: any, index: number) => (
                                        <tr key={`ac-${index}`} className="border-b">
                                            <td className="p-4 text-slate-500">
                                                <span className="mr-1">
                                                    {new Date(activity.created_at).toLocaleString('id-ID', {
                                                        dateStyle: 'medium',
                                                    })}
                                                </span>
                                                <span>
                                                    - {new Date(activity.created_at).toLocaleTimeString('id-ID', {
                                                        timeStyle: 'short',
                                                    })} WIB
                                                </span>
                                            </td>
                                            <td>
                                                <div className="flex items-center gap-2">
                                                    <div>

                                                        {activity.event == 'update-profile' && (
                                                            <UserIcon className="w-4 h-4 text-purple-500" />
                                                        )}

                                                        {['login', 'google-login', 'login-google', 'login-semesta', 'original-login'].includes(activity.event) && (
                                                            <ArrowLeftEndOnRectangleIcon className="w-4 h-4 text-purple-500" />
                                                        )}

                                                        {['sync-google'].includes(activity.event) && (
                                                            <img src="/assets/images/google.png" alt="Google" className="w-4 h-4" />
                                                        )}

                                                        {['sync-semesta'].includes(activity.event) && (
                                                            <img src="https://aptika.oganilirkab.go.id/storage/images/thumbnail/original/semesta-ogan-ilir.png" alt="Semesta" className="w-4 h-4" />
                                                        )}

                                                        {['share-file/folder', 'share-file/file', 'publicity-file', 'publicity-folder'].includes(activity.event) && (
                                                            <ShareIcon className="w-4 h-4 text-pink-500" />
                                                        )}

                                                        {['make-folder', 'create-folder-folder'].includes(activity.event) && (
                                                            <FolderPlusIcon className="w-4 h-4 text-indigo-500" />
                                                        )}

                                                        {['rename-folder', 'rename-file'].includes(activity.event) && (
                                                            <PencilSquareIcon className="w-4 h-4 text-sky-400" />
                                                        )}

                                                        {['upload-file'].includes(activity.event) && (
                                                            <ArrowUpTrayIcon className="w-4 h-4 text-green-500" />
                                                        )}

                                                        {['move-item'].includes(activity.event) && (
                                                            <ArrowsPointingOutIcon className="w-4 h-4 text-orange-500" />
                                                        )}

                                                        {['delete-item'].includes(activity.event) && (
                                                            <TrashIcon className="w-4 h-4 text-red-500" />
                                                        )}

                                                        {['download-file'].includes(activity.event) && (
                                                            <ArrowDownTrayIcon className="w-4 h-4 text-green-500" />
                                                        )}

                                                    </div>
                                                    <div
                                                        title={activity.description}
                                                        className="line-clamp-2 text-slate-500">
                                                        {activity.description}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}

                                </tbody>
                            </table>
                        </div>
                        <div className="flex items-center justify-between mt-4 text-xs">
                            <div className="text-xs text-slate-500">
                                Menampilkan {activities?.length} dari {actTotalData} aktivitas
                            </div>
                            <div className="flex items-center gap-x-2">
                                <button
                                    disabled={actCurrentPage === 1}
                                    onClick={() => {
                                        if (isLoadingActivities) return;
                                        setActivities(null);
                                        setActCurrentPage(actCurrentPage - 1);
                                    }}
                                    className={`px-2 py-1 rounded ${actCurrentPage === 1 ? 'bg-slate-300' : 'bg-slate-500 text-white'}`}>
                                    Sebelumnya
                                </button>
                                <div className="">
                                    {actCurrentPage} / {actTotalPage}
                                </div>
                                <button
                                    disabled={actCurrentPage === actTotalPage}
                                    onClick={() => {
                                        if (isLoadingActivities) return;
                                        setActivities(null);
                                        setActCurrentPage(actCurrentPage + 1);
                                    }}
                                    className={`px-2 py-1 rounded ${actCurrentPage === actTotalPage ? 'bg-slate-300' : 'bg-slate-500 text-white'}`}>
                                    Selanjutnya
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* modal */}
            <LoginSemesta
                isOpen={isOpen}
                isLoading={false}
                onClose={() => setIsOpen(false)}
                onSubmit={(data) => {
                    handleSyncSemesta(data);
                }}
            />
        </>
    );
}
export default Profile;