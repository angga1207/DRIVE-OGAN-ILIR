"use client";
import { FolderPlusIcon, ArrowsUpDownIcon, DocumentPlusIcon, TrashIcon, ExclamationTriangleIcon, ArchiveBoxArrowDownIcon, ArrowsPointingOutIcon, FolderIcon, ArrowUturnLeftIcon, TableCellsIcon, ListBulletIcon, XMarkIcon, ArrowPathIcon } from '@heroicons/react/24/outline'
import { Suspense, useEffect, useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import ItemCardList from "../Components/ItemCardList";
import Breadcrumbs from "../Components/breadcrumbs";
import { getItems, getPath, getTrashItems, moveItems, postDelete, postDownload, postForceDelete, postMakeFolder, postPublicity, postRename, postRestore } from "@/apis/apiResources";
import { getCookie } from "cookies-next";
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import ModalDetail from "../Components/modalDetail";
import ModalFolder from "../Components/modalFolder";
import axios from "axios";
import Swal from 'sweetalert2'
import { serverDomain } from "@/apis/serverConfig";
import QueueList from "../Components/queueList";
import ModalShare from "../Components/modalShare";
import ModalMove from '../Components/modalMove';
import Tippy from '@tippyjs/react';
import ItemCardGrid from '../Components/ItemCardGrid';
import SideBar from '../Components/SideBar';
import Link from 'next/link';
import TrashedItemCardList from '../Components/TrashedItemCardList';
import AddMenu from '../Components/addMenu';

const ServerDomain = serverDomain();

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

const Page = () => {

    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();

    var CurrentToken = getCookie('token');

    const [user, setUser] = useState<any>(null);

    const [sorts, setSorts] = useState<any>([
        { name: 'Nama ↑', value: 'name', direction: 'asc' },
        { name: 'Nama ↓', value: 'name', direction: 'desc' },
        { name: 'Tanggal ↑', value: 'date', direction: 'asc' },
        { name: 'Tanggal ↓', value: 'date', direction: 'desc' },
        { name: 'Ukuran ↑', value: 'size', direction: 'asc' },
        { name: 'Ukuran ↓', value: 'size', direction: 'desc' },
    ]);

    const [sort, setSort] = useState(sorts[0]);
    const [items, setItems] = useState<any>([]);
    const [selectedItems, setSelectedItems] = useState<any>([]);
    const [inDetailItem, setInDetailItem] = useState<any>(null);
    const [isMounted, setIsMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [isSelectedMode, setIsSelectedMode] = useState(false);
    const [openModal, setOpenModal] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (isMounted) {
            const cookieUser = getCookie('user');
            if (cookieUser) {
                const user = JSON.parse(cookieUser as string);
                setUser(user);
            }
        }
    }, [isMounted]);

    useEffect(() => {
        if (isMounted) {
            setItems([]);
            setIsLoading(true);
            getTrashItems().then((res: any) => {
                if (res.status === 'success') {
                    setItems(res.data);
                } else if (res.message.status == 401 && CurrentToken) {
                    window.location.href = '/logout';
                }
                setIsLoading(false);
            });
            setSort(sorts[0]);
            setSelectedItems([]);
        }
    }, [isMounted, searchParams, pathname]);


    const handleSort = (data: any) => {
        const sortedItems = [...items].sort((a: any, b: any) => {
            if (data.value === 'name') {

                // item type folder first 
                if (a.type === 'folder' && b.type !== 'folder') {
                    return -1;
                }
                if (a.type !== 'folder' && b.type === 'folder') {
                    return 1;
                }
                if (a.type === 'folder' && b.type === 'folder') {
                    return data.direction === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
                }
                if (a.type !== 'folder' && b.type !== 'folder') {
                    return data.direction === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
                }

            } else if (data.value === 'date') {
                // item type folder first
                if (a.type === 'folder' && b.type !== 'folder') {
                    return -1;
                }
                if (a.type !== 'folder' && b.type === 'folder') {
                    return 1;
                }
                if (a.type === 'folder' && b.type === 'folder') {
                    return data.direction === 'desc' ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime() : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                }
                if (a.type !== 'folder' && b.type !== 'folder') {
                    return data.direction === 'desc' ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime() : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                }
            } else if (data.value === 'size') {
                // item type folder first
                if (a.type === 'folder' && b.type !== 'folder') {
                    return -1;
                }
                if (a.type !== 'folder' && b.type === 'folder') {
                    return 1;
                }
                if (a.type === 'folder' && b.type === 'folder') {
                    return 0;
                }
                if (a.type !== 'folder' && b.type !== 'folder') {
                    return data.direction === 'desc' ? a.size_bytes - b.size_bytes : b.size_bytes - a.size_bytes;
                }
            }
        });
        setItems(sortedItems);
        setSort(data);
    }

    const handleRestoreFile = (item: any) => {
        postRestore([item.slug]).then((res: any) => {
            if (res.status === 'success') {
                setItems((prev: any) => {
                    return prev.filter((i: any) => i.slug !== item.slug);
                });
                setSelectedItems([]);
                setIsSelectedMode(false);
                setIsLoading(false);
                setIsError(false);
                SweetAlertToast('success', 'Berhasil', 'Berkas berhasil dipulihkan');
            }
        });
    }

    const handleDeleteFile = (item: any) => {
        postForceDelete([item.slug]).then((res: any) => {
            if (res.status === 'success') {
                setItems((prev: any) => {
                    return prev.filter((i: any) => i.slug !== item.slug);
                });
                setSelectedItems([]);
                setIsSelectedMode(false);
                setIsLoading(false);
                setIsError(false);
                SweetAlertToast('success', 'Berhasil', 'Berkas berhasil dihapus selamanya');
            }
        });
    }

    if (user?.access === false) {
        return (
            <div>
                <div className="flex flex-col items-center justify-center w-full h-[calc(100vh-150px)] border border-dashed border-slate-300 rounded-lg">
                    <div className="">
                        <ExclamationTriangleIcon className="h-20 w-20 text-red-500" />
                    </div>
                    <div className="text-red-500 text-xl font-bold">
                        Anda tidak memiliki akses di Aplikasi Drive Ogan Ilir
                    </div>
                    <div className="">
                        Silahkan hubungi admin untuk mendapatkan akses di {` `}
                        <a
                            className="text-blue-500 font-semibold cursor-pointer hover:underline"
                            target="_blank"
                            rel="noopener noreferrer"
                            href="https://wa.me/6281255332004">
                            <span className="text-green-600 font-semibold cursor-pointer hover:underline">
                                WhatsApp Center
                            </span>
                        </a>
                        {``} kami.
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div
            onContextMenu={(e) => e.preventDefault()}>
            <div className="grid grid-cols-12 bg-gray-200">

                <div className="col-span-12 lg:col-span-2">
                    <div className="h-auto lg:h-[calc(100vh-64px)] flex flex-col bg-[#003a69] pt-5 pb-20 px-2">

                        <AddMenu
                            isDisabled={true}
                            isLoading={isLoading}
                            isLoadingFolder={false}
                            isLoadingBreadcrumbs={false}

                            onUploadFiles={(e: any) => {
                                // setDragIsUpload(true);
                                // handleUploadFiles(e);
                            }}

                            onCreateFolder={() => {
                                // setOpenModalFolder(true);
                                // setIsFolderCreate(true);
                                // setInDetailItem({
                                //     name: '',
                                //     slug: '',
                                //     id: '',
                                //     type: 'folder',
                                // });
                                // setSelectedItems([]);
                                // setIsSelectedMode(false);
                                // setIsLoading(false);
                                // setIsError(false);
                            }}
                        />

                        <SideBar
                            userData={user}
                        />

                    </div>
                </div>

                <div className="col-span-12 lg:col-span-10 px-4 py-6 sm:px-6 lg:px-8">

                    <div className="flex flex-wrap space-x-4 bc items-center">
                        <Link href={`/trash`} className="font-semibold text-red-500 hover:text-red-400 flex gap-x-1 items-center transition-all duration-300">
                            <TrashIcon className="h-5 w-5 inline" />
                            Kotak Sampah
                        </Link>
                    </div>

                    {isLoading == false && (
                        <div className="mt-5">

                            {items.length > 0 && (
                                <div className="mb-2 flex items-center justify-between flex-wrap gap-y-4">
                                    <div className="flex flex-col lg:flex-row lg:items-center gap-2">
                                        {/* select all */}
                                        <div className="flex items-center gap-x-1 select-none">
                                            <div className="flex items-center gap-x-1 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    id="select-all-checkbox"
                                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                    checked={(selectedItems.length === items.length) && items.length > 0 ? true : false}
                                                    disabled={items.length === 0 ? true : false}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setSelectedItems(items.map((item: any) => item));
                                                        } else {
                                                            setSelectedItems([]);
                                                        }
                                                    }}
                                                />
                                                <label
                                                    htmlFor="select-all-checkbox"
                                                    className="text-xs text-slate-500 cursor-pointer">
                                                    Pilih Semua
                                                </label>
                                            </div>
                                        </div>
                                        {/* select all end */}

                                        {selectedItems.length > 0 && (
                                            <div className='flex items-center gap-x-2'>


                                                <button
                                                    className="text-xs bg-blue-100 text-slate-500 hover:text-blue-900 cursor-pointer rounded border px-1 py-1 border-blue-300 hover:border-blue-400 hover:bg-blue-200 shadow-sm flex items-center gap-x-1 whitespace-nowrap"
                                                    onClick={() => {
                                                        SweetAlertConfirm('Peringatan', 'Apakah anda yakin ingin memulihkan ' + selectedItems?.length + ' berkas ini?', 'Ya, Hapus!', 'Batalkan')
                                                            .then((result) => {
                                                                if (result.isConfirmed) {
                                                                    postRestore(selectedItems.map((item: any) => item.slug)).then((res: any) => {
                                                                        if (res.status === 'success') {
                                                                            setItems((prev: any) => {
                                                                                return prev.filter((item: any) => !selectedItems.map((item: any) => item.slug).includes(item.slug));
                                                                            });
                                                                            setSelectedItems([]);
                                                                            setIsSelectedMode(false);
                                                                            setIsLoading(false);
                                                                            setIsError(false);
                                                                            SweetAlertToast('success', 'Berhasil', 'Berkas berhasil dipulihkan');
                                                                        }
                                                                    });
                                                                }
                                                            });
                                                    }}
                                                >
                                                    <ArrowPathIcon className="h-4 w-4 inline" />
                                                    Pulihkan Semua
                                                </button>

                                                <button
                                                    className="text-xs bg-red-100 text-slate-500 hover:text-red-900 cursor-pointer rounded border px-1 py-1 border-red-300 hover:border-red-400 hover:bg-red-200 shadow-sm flex items-center gap-x-1 whitespace-nowrap"
                                                    onClick={() => {
                                                        SweetAlertConfirm('Peringatan', 'Apakah anda yakin ingin menghapus ' + selectedItems?.length + ' berkas ini selamanya?', 'Hapus Selamanya!', 'Batalkan')
                                                            .then((result) => {
                                                                if (result.isConfirmed) {
                                                                    postForceDelete(selectedItems.map((item: any) => item.slug)).then((res: any) => {
                                                                        if (res.status === 'success') {
                                                                            setItems((prev: any) => {
                                                                                return prev.filter((item: any) => !selectedItems.map((item: any) => item.slug).includes(item.slug));
                                                                            });
                                                                            setSelectedItems([]);
                                                                            setIsSelectedMode(false);
                                                                            setIsLoading(false);
                                                                            setIsError(false);
                                                                            SweetAlertToast('success', 'Berhasil', 'Berkas berhasil dihapus');
                                                                        }
                                                                    });
                                                                }
                                                            });
                                                    }}
                                                >
                                                    <TrashIcon className="h-4 w-4 inline" />
                                                    Hapus Permanen Semua
                                                </button>

                                                {/* reset button */}
                                                <button
                                                    className="text-xs bg-slate-100 text-slate-500 hover:text-slate-900 cursor-pointer rounded border px-1 py-1 border-slate-300 hover:border-slate-400 hover:bg-slate-200 shadow-sm flex items-center gap-x-1 whitespace-nowrap"
                                                    onClick={() => {
                                                        setSelectedItems([]);
                                                        setIsSelectedMode(false);
                                                    }}
                                                >
                                                    <XMarkIcon className="h-4 w-4 inline" />
                                                    Batalkan
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto px-4 -mx-4 pb-4">

                                {!isLoading && items.length === 0 && (
                                    <div className="flex flex-col items-center justify-center w-full h-[calc(100vh-300px)] border border-dashed border-slate-300 rounded-lg">
                                        <div className="">
                                            <TrashIcon className="h-20 w-20 text-slate-300" />
                                        </div>
                                        <div className="text-slate-300 text-xl font-bold">
                                            Kotak Sampah Kosong
                                        </div>
                                        <div className="text-slate-300">
                                            Berkas yang dihapus akan muncul di sini
                                        </div>
                                    </div>
                                )}

                                {items.map((item: any, index: number) => (
                                    <TrashedItemCardList

                                        key={`item-${index}`}
                                        item={item}

                                        onItemClick={() => {

                                        }}
                                        onItemOpen={(e: any) => {
                                            if (e.type === 'folder') {
                                                SweetAlertToast('info', 'Info', 'Untuk membuka folder, silahkan pulihkan folder tersebut terlebih dahulu');
                                                return;
                                            } else if (e.type === 'file') {
                                                setOpenModal(true);
                                                setInDetailItem(e);
                                            }
                                        }}
                                        onItemDelete={(e: any) => {
                                            SweetAlertConfirm('Peringatan', 'Apakah anda yakin ingin menghapus berkas ini selamanya?', 'Hapus Permanen!', 'Batalkan').then((result) => {
                                                if (result.isConfirmed) {
                                                    handleDeleteFile(e);
                                                }
                                            });
                                        }}
                                        onItemRestore={(e: any) => {
                                            SweetAlertConfirm('Peringatan', 'Apakah anda yakin ingin memulihkan berkas ini?', 'Ya, Pulihkan!', 'Batalkan').then((result) => {
                                                if (result.isConfirmed) {
                                                    handleRestoreFile(e);
                                                }
                                            });
                                        }}

                                        onItemSelect={(e: any) => {
                                            setSelectedItems((prev: any) => {
                                                if (prev.find((i: any) => i.id === e.id)) {
                                                    return prev.filter((item: any) => item.id !== e.id);
                                                } else {
                                                    return [...prev, e];
                                                }

                                            });
                                        }}
                                        selectedItems={selectedItems}
                                        isLoading={false}
                                        isError={false}
                                        isSelected={selectedItems.find((i: any) => i.id === item.id) ? true : false}
                                        isSelectedMode={selectedItems.length > 0}
                                    />
                                ))}

                            </div>

                        </div>
                    )}

                </div>

            </div>


            <ModalDetail
                data={inDetailItem}
                isOpen={openModal}
                onClose={() => {
                    setOpenModal(false);
                    setInDetailItem(null);
                    setSelectedItems([]);
                    setIsSelectedMode(false);
                    setIsLoading(false);
                    setIsError(false);
                }}
                onSubmit={() => {
                    setOpenModal(false);
                    setInDetailItem(null);
                    setSelectedItems([]);
                    setIsSelectedMode(false);
                    setIsLoading(false);
                    setIsError(false);
                }}
            />
        </div>
    )
}


export default function TrashPage() {

    return (
        <Suspense fallback={<div className="h-full w-full flex items-center justify-center">Loading...</div>}>
            <Page />
        </Suspense>
    );
}