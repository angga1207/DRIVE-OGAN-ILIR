"use client"
import { FolderIcon, HomeIcon, StarIcon, TrashIcon } from "@heroicons/react/24/outline";
import { FolderIcon as FolderIconSolid } from "@heroicons/react/24/solid";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import { HomeIcon as HomeIconSolid } from "@heroicons/react/24/solid";
import { TrashIcon as TrashIconSolid } from "@heroicons/react/24/solid";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from 'sweetalert2'

const SweetAlertConfirm = (title: any, text: any, confirmButtonText: any, cancelButtonText: any, showCancelButton: boolean = true) => {
    return Swal.fire({
        title: title,
        text: text,
        icon: 'warning',
        showCancelButton: showCancelButton,
        // green confirm button
        confirmButtonColor: '#00a63e',
        cancelButtonColor: '#d33',
        confirmButtonText: confirmButtonText,
        cancelButtonText: cancelButtonText,
        // confirm button on right
        reverseButtons: true,
    })
}

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

const SideBar = ({
    userData
}: {
    userData: any
}) => {
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);

    const pathname = usePathname();
    const [activeMenu, setActiveMenu] = useState('home');

    useEffect(() => {
        if (isMounted) {
            if (pathname === '/') {
                setActiveMenu('home');
            }

            if (pathname === '/favorite') {
                setActiveMenu('favorite');
            }

            if (pathname === '/trash') {
                setActiveMenu('trash');
            }
        }
    }, [pathname, isMounted]);


    if (!isMounted) {
        return null;
    }

    return (
        <>
            <div className="grow flex-none">
                <ul role="list" className="space-y-1">

                    <li className={`px-3 py-2 rounded-xl cursor-pointer transition-all duration-300 ${activeMenu === 'home' ? 'bg-[#ebbd18] hover:bg-[#ebbd18] font-semibold' : 'hover:bg-[#ebbd18]'} group`}>
                        <Link
                            href={'/'}
                            className="flex items-center justify-between">
                            <div
                                className="w-full">
                                <p className={`text-sm ${activeMenu === 'home' ? 'text-[#003a69]' : 'text-[#ebbd18] group-hover:text-[#003a69]'}`}>
                                    {activeMenu === 'home' ? (
                                        <FolderIconSolid className="h-4 w-4 inline mb-0.5 mr-1" />
                                    ) : (
                                        <FolderIcon className="h-4 w-4 inline mb-0.5 mr-1" />
                                    )}
                                    Drive Saya
                                </p>
                            </div>
                        </Link>
                    </li>

                    <li className={`px-3 py-2 rounded-xl cursor-pointer transition-all duration-300 ${activeMenu === 'favorite' ? 'bg-[#ebbd18] hover:bg-[#ebbd18] font-semibold' : 'hover:bg-[#ebbd18]'} group`}>
                        <Link
                            href={'/favorite'}
                            className="flex items-center justify-between">
                            <div
                                className="w-full">
                                <p className={`text-sm ${activeMenu === 'favorite' ? 'text-[#003a69]' : 'text-[#ebbd18] group-hover:text-[#003a69]'}`}>
                                    {activeMenu === 'favorite' ? (
                                        <StarIconSolid className="h-4 w-4 inline mb-0.5 mr-1" />
                                    ) : (
                                        <StarIcon className="h-4 w-4 inline mb-0.5 mr-1" />
                                    )}
                                    Favorit
                                </p>
                            </div>
                        </Link>
                    </li>

                    <div className="border-t border-slate-200 my-2"></div>

                    <li className={`px-3 py-2 rounded-xl cursor-pointer transition-all duration-300 ${activeMenu === 'trash' ? 'bg-[#ebbd18] hover:bg-[#ebbd18] font-semibold' : 'hover:bg-[#ebbd18]'} group`}>
                        <Link
                            href={'/trash'}
                            className="flex items-center justify-between">
                            <div
                                className="w-full">
                                <p className={`text-sm ${activeMenu === 'trash' ? 'text-[#003a69]' : 'text-[#ebbd18] group-hover:text-[#003a69]'}`}>
                                    {activeMenu === 'trash' ? (
                                        <TrashIconSolid className="h-4 w-4 inline mb-0.5 mr-1" />
                                    ) : (
                                        <TrashIcon className="h-4 w-4 inline mb-0.5 mr-1" />
                                    )}
                                    Kotak Sampah
                                </p>
                            </div>
                        </Link>
                    </li>

                </ul>
            </div>

            <div className="w-full select-none mt-5">
                <div className="">
                    <div className="w-full flex align-middle justify-between text-[10px] font-semibold px-1.5 text-[#ebbd18]">
                        <div className="">
                            {userData?.storage?.used} / {userData?.storage?.total}
                        </div>
                        <div className="">
                            {userData?.storage?.rest}
                        </div>
                    </div>
                    <div className="w-full h-4 border border-slate-200 bg-slate-100 rounded-xl">
                        <div
                            className="h-full px-1 flex items-center bg-[#ebbd18] text-[10px] text-[#003a69] text-center leading-none rounded-xl whitespace-nowrap font-bold"
                            style={{
                                width: `${userData?.storage?.percent}%`,
                                minWidth: '30px',
                            }}>
                            <div>
                                {new Intl.NumberFormat('id-ID', {
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 2,
                                }).format(userData?.storage?.percent)} %
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SideBar