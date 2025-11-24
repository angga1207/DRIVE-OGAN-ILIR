"use client";
import { FolderPlusIcon, ArrowsUpDownIcon, DocumentPlusIcon, TrashIcon, ExclamationTriangleIcon, ArchiveBoxArrowDownIcon, ArrowsPointingOutIcon, FolderIcon, ArrowUturnLeftIcon, TableCellsIcon, ListBulletIcon, XMarkIcon, ArrowPathIcon, StarIcon } from '@heroicons/react/24/outline'
import { Suspense, useEffect, useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import ItemCardList from "../Components/ItemCardList";
import Breadcrumbs from "../Components/breadcrumbs";
import { getPublicPath, getSharedFolders, getSharedItems, postDownload, postMakeFolder, postRename } from "@/apis/apiResources";
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
import { MdOutlineFolderShared } from 'react-icons/md';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { createAxiosConfig, createAxiosConfigMultipart, getBearerTokenForApi } from '@/utils/apiHelpers';

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
    const [viewMode, setViewMode] = useState('list'); // grid or list
    const [items, setItems] = useState<any>([]);
    const [arrBreadcrumbs, setArrBreadcrumbs] = useState<any>([]);
    const [currentPath, setCurrentPath] = useState<any>(null);
    const [selectedItems, setSelectedItems] = useState<any>([]);
    const [inDetailItem, setInDetailItem] = useState<any>(null);
    const [isMounted, setIsMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingUploadFiles, setIsLoadingUploadFiles] = useState(false);
    const [isDownloading, setIsDownloading] = useState<any>([]);
    const [isMoveDragging, setIsMoveDragging] = useState(false);
    const [showQueueList, setShowQueueList] = useState(false);
    const [isLoadingBreadcrumbs, setIsLoadingBreadcrumbs] = useState(false);
    const [isLoadingFolder, setIsLoadingFolder] = useState(false);
    const [isError, setIsError] = useState(false);
    const [isSelectedMode, setIsSelectedMode] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [openModalMove, setOpenModalMove] = useState(false);
    const [openModalFolder, setOpenModalFolder] = useState(false);
    const [openModalShare, setOpenModalShare] = useState(false);

    const [queueUploadFiles, setQueueUploadFiles] = useState<any>([]);
    const [queueBatch, setQueueBatch] = useState<any>(0);
    const [isFolderCreate, setIsFolderCreate] = useState(false);

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

    const _getPath = () => {
        setIsLoadingBreadcrumbs(true);
        const _id = searchParams.get('_id') || null;

        getPublicPath(_id).then((res: any) => {
            if (res.status === 'success') {
                setCurrentPath(res.data.current);
                setArrBreadcrumbs(res.data);
            } else {
                setArrBreadcrumbs([]);
            }
            setIsLoadingBreadcrumbs(false);
        }).catch((err) => {
            setArrBreadcrumbs([]);
            setIsLoadingBreadcrumbs(false);
        });
    }

    const _getFolderItems = () => {
        setIsLoading(true);
        const _id = searchParams.get('_id') || null;

        if (_id) {
            getSharedItems(_id).then((res: any) => {
                if (res.status === 'success') {
                    setItems(res.data);
                    setIsError(false);
                } else {
                    setItems([]);
                    setIsError(true);
                }
                setIsLoading(false);
            }).catch((err) => {
                setItems([]);
                setIsLoading(false);
                setIsError(true);
            });
        } else {
            getSharedFolders().then((res: any) => {
                if (res.status === 'success') {
                    setItems(res.data);
                    setIsError(false);
                } else {
                    setItems([]);
                    setIsError(true);
                }
                setIsLoading(false);
            }).catch((err) => {
                setItems([]);
                setIsLoading(false);
                setIsError(true);
            });
        }
    }

    useEffect(() => {
        if (isMounted) {
            _getPath();
            _getFolderItems();
        }
    }, [isMounted, searchParams]);

    const handleGoFolder = (slug: any) => {
        const params = new URLSearchParams(window.location.search);
        params.set('_p', slug);
        window.history.pushState({}, '', `${pathname}?${params}`);
        router.push(`${pathname}?_id=${slug}`);
    }

    const handleRenamFolder = (slug: any, name: any, id: any) => {
        setIsLoadingFolder(true);
        if (isFolderCreate === true) {
            postMakeFolder(searchParams.get('_id'), name).then((res: any) => {
                if (res.status === 'success') {
                    _getFolderItems();
                    setOpenModalFolder(false);
                    setInDetailItem(null);
                    setSelectedItems([]);
                    setIsSelectedMode(false);
                    setIsLoading(false);
                    setIsError(false);
                }
                else {
                    SweetAlertToast('error', 'Gagal', res.message);
                }
                setIsLoadingFolder(false);
            });
        } else if (isFolderCreate === false) {
            postRename(slug, name).then((res: any) => {
                if (res.status == 'success') {
                    setItems((prev: any) => {
                        return prev.map((item: any) => {
                            if (item.id === id) {
                                return { ...item, name: name };
                            }
                            return item;
                        });
                    });

                    setOpenModalFolder(false);
                    setInDetailItem(null);
                    setSelectedItems([]);
                    setIsSelectedMode(false);
                    setIsLoading(false);
                    setIsError(false);
                }
                else {
                    SweetAlertToast('error', 'Gagal', res.message);
                }
                setIsLoadingFolder(false);
            });
        }
    }

    const handleDownload = (data: any) => {
        setIsDownloading((prev: any) => {
            return [...prev, { id: data.id }];
        });
        postDownload([data.slug]).then((res: any) => {
            if (res.status === 'success') {
                const link = document.createElement('a');
                link.href = res.data[0].url;
                link.setAttribute('download', res.data[0].name || 'download.zip');
                // target="_blank"
                link.setAttribute('rel', 'noopener noreferrer');
                link.setAttribute('target', '_blank');
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
            setIsDownloading((prev: any) => {
                return prev.filter((item: any) => item.id !== data.id);
            });
        });
    }


    const handleUploadFiles = (e: any) => {
        setIsLoadingUploadFiles(true);
        setShowQueueList(true);
        const files = e.target.files;
        if (files.length > 0) {
            setQueueBatch(queueBatch + 1);
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const fileName = file.name;
                const fileSize = file.size;
                setQueueUploadFiles((prev: any) => {
                    return [...prev, { id: (queueBatch + '-') + (i + 1), name: fileName, size: fileSize, progress: 0, status: 'uploading' }];
                });
            }
            AxiosUploadFiles(files).then((res: any) => {
                _getFolderItems();
                // getItems(searchParams.get('_p')).then((res: any) => {
                //     if (res.status === 'success') {
                //         setItems(res.data);
                //     }
                // });
                setIsLoadingUploadFiles(false);
            });
        }
        // setUploadFiles([]);
    }

    const AxiosUploadFiles = async (files: any) => {
        const globalSlug = searchParams.get('_id');
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const fileName = file.name;
            const fileSize = file.size;
            const formData = new FormData();
            formData.append('files[]', file);
            formData.append('folderId', globalSlug as string);
            try {
                // Get bearer token for authorization
                const token = await getBearerTokenForApi();

                // Use axios for upload progress tracking with Next.js API route
                const res = await axios.post(`/api/upload/${globalSlug}`, formData, {
                    headers: {
                        ...(token && { Authorization: `Bearer ${token}` }),
                        // Don't set Content-Type for FormData, let axios handle it
                    },
                    onUploadProgress: (progressEvent: any) => {
                        const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                        setQueueUploadFiles((prev: any) => {
                            return prev.map((item: any) => {
                                if (item.id === (queueBatch + '-') + (i + 1)) {
                                    return { ...item, progress: progress };
                                }
                                return item;
                            });
                        });
                        if (progress >= 100) {
                            setQueueUploadFiles((prev: any) => {
                                return prev.map((item: any) => {
                                    if (item.id === (queueBatch + '-') + (i + 1)) {
                                        return { ...item, status: 'done' };
                                    }
                                    return item;
                                });
                            });
                        }
                        if (progress < 100) {
                            setQueueUploadFiles((prev: any) => {
                                return prev.map((item: any) => {
                                    if (item.id === (queueBatch + '-') + (i + 1)) {
                                        return { ...item, status: 'uploading' };
                                    }
                                    return item;
                                });
                            });
                        }
                    }
                });
                const response = await res.data;
                if (response.status == 'error') {
                    SweetAlertToast('error', 'Gagal', response.message);
                }
            } catch (error) {
                return {
                    status: 'error',
                    message: error
                }
            }
        }
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
            <div className="grid grid-cols-12 bg-white">

                <div className="col-span-12 lg:col-span-2">
                    <div className="h-auto lg:h-[calc(100vh-64px)] flex flex-col bg-[#003a69] pt-5 pb-20 px-2">

                        <AddMenu
                            isDisabled={searchParams.get('_id') ? false : true}
                            isLoading={isLoading}
                            isLoadingFolder={isLoadingFolder}
                            isLoadingBreadcrumbs={isLoadingBreadcrumbs}

                            onUploadFiles={(e: any) => {
                                // setDragIsUpload(true);
                                handleUploadFiles(e);
                            }}

                            onCreateFolder={() => {
                                setOpenModalFolder(true);
                                setIsFolderCreate(true);
                                setInDetailItem({
                                    name: '',
                                    slug: searchParams.get('_id') || null,
                                    id: '',
                                    type: 'folder',
                                });
                                setSelectedItems([]);
                                setIsSelectedMode(false);
                                setIsLoading(false);
                                setIsError(false);
                            }}
                        />

                        <SideBar
                            userData={user}
                        />

                    </div>
                </div>

                <div className="col-span-12 lg:col-span-10 px-4 py-6 sm:px-6 lg:px-8">

                    <div className="flex flex-wrap space-x-4 bc items-center mb-5">
                        <Link href={`/shared`} className="font-semibold flex gap-x-1 items-center transition-all duration-300">
                            <MdOutlineFolderShared className="h-5 w-5 inline" />
                            Data Berbagi
                        </Link>
                    </div>


                    {isLoadingBreadcrumbs ? (
                        <div className="flex flex-wrap space-x-4 bc items-center mb-5">
                            <div className="font-semibold flex gap-x-1 items-center animate-pulse">
                                <div className="h-8 w-80 bg-slate-100 rounded-lg"></div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-wrap space-x-4 bc items-center mb-5 select-none">
                            <Breadcrumb>
                                <BreadcrumbList>

                                    <BreadcrumbItem>
                                        <BreadcrumbLink asChild>
                                            <Link href={`/shared`} className="font-semibold text-[#003a69] hover:text-[#ebbd18] flex gap-x-1 items-center transition-all duration-300">
                                                <FolderIcon className="h-5 w-5 inline" />
                                                Beranda
                                            </Link>
                                        </BreadcrumbLink>
                                    </BreadcrumbItem>

                                    {currentPath && (
                                        <BreadcrumbSeparator />
                                    )}

                                    {(currentPath && currentPath?.type == 'folder' && arrBreadcrumbs?.paths?.length > 0) && (
                                        arrBreadcrumbs?.paths?.map((item: any, index: number) => (
                                            <>
                                                <BreadcrumbItem key={`bc-${index}`}>
                                                    <BreadcrumbLink asChild>
                                                        <div
                                                            onClick={(e: any) => {
                                                                e.preventDefault();
                                                                handleGoFolder(item.slug);
                                                            }}
                                                            className="font-semibold text-[#003a69] hover:text-[#ebbd18] flex gap-x-1 items-center transition-all duration-300 cursor-pointer">
                                                            <FolderIcon className="h-5 w-5 inline" />
                                                            <div className='truncate max-w-[180px]'>
                                                                {item?.name}
                                                            </div>
                                                        </div>
                                                    </BreadcrumbLink>
                                                </BreadcrumbItem>
                                                <BreadcrumbSeparator />
                                            </>
                                        ))

                                    )}

                                    {currentPath && (
                                        <BreadcrumbItem>
                                            <BreadcrumbPage className="font-semibold text-[#003a69] flex gap-x-1 items-center">
                                                <FolderIcon className="h-5 w-5 inline" />
                                                <div className='truncate max-w-[180px]'>
                                                    {currentPath?.name}
                                                </div>
                                            </BreadcrumbPage>
                                        </BreadcrumbItem>
                                    )}

                                </BreadcrumbList>
                            </Breadcrumb>

                        </div>
                    )}

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
                                                    className="text-xs bg-indigo-100 text-slate-500 hover:text-indigo-900 cursor-pointer rounded border px-1 py-1 border-indigo-300 hover:border-indigo-400 hover:bg-indigo-200 shadow-sm flex items-center gap-x-1 whitespace-nowrap"

                                                    onClick={() => {
                                                        if (selectedItems.length === 0) {
                                                            SweetAlertToast('info', 'Peringatan', 'Tidak ada berkas yang dipilih');
                                                            return;
                                                        }
                                                        if (selectedItems.filter((item: any) => item.type === 'folder').length > 0) {
                                                            SweetAlertConfirm('Peringatan', 'Tidak dapat mengunduh folder. Silahkan pilih berkas yang ingin diunduh.', 'Tutup', null, false)
                                                            return;
                                                        }

                                                        SweetAlertConfirm('Peringatan', 'Apakah anda yakin ingin mengunduh ' + selectedItems?.length + ' berkas ini?', 'Ya, Unduh!', 'Batalkan')
                                                            .then((result) => {
                                                                if (result.isConfirmed) {
                                                                    postDownload(selectedItems.map((item: any) => item.slug)).then((res: any) => {
                                                                        if (res.status === 'success') {
                                                                            res.data.forEach((item: any) => {
                                                                                const link = document.createElement('a');
                                                                                link.href = item.url;
                                                                                link.setAttribute('download', item.name || 'download.zip');
                                                                                link.setAttribute('rel', 'noopener noreferrer');
                                                                                link.setAttribute('target', '_blank');
                                                                                document.body.appendChild(link);
                                                                                link.click();
                                                                                document.body.removeChild(link);
                                                                            });

                                                                            setSelectedItems([]);
                                                                            setIsSelectedMode(false);
                                                                            setIsLoading(false);
                                                                            setIsError(false);
                                                                            SweetAlertToast('success', 'Berhasil', 'Berkas berhasil diunduh');
                                                                        } else {
                                                                            SweetAlertToast('error', 'Gagal', res.message);
                                                                        }
                                                                    });
                                                                }
                                                            });
                                                    }}
                                                >
                                                    <ArchiveBoxArrowDownIcon className="h-4 w-4 inline" />
                                                    Unduh {selectedItems.length} Item
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
                                            <MdOutlineFolderShared className="h-20 w-20 text-slate-300" />
                                        </div>
                                        <div className="text-slate-300 text-xl font-bold">
                                            Data Berbagi Kosong
                                        </div>
                                        <div className="text-slate-300">
                                            Berkas yang dibagikan akan muncul di sini
                                        </div>
                                    </div>
                                )}

                                <div
                                    className="flex flex-col gap-y-2 max-h-[calc(100vh-200px)] overflow-y-auto px-4 -mx-4 pb-4">
                                    {items.map((item: any, index: number) => (
                                        <ItemCardList
                                            // draggable={true}
                                            draggable={false}
                                            // draggable={selectedItems.length == 0}
                                            onDragging={(data: any) => {
                                                setIsMoveDragging(data)
                                            }}

                                            key={`item-${index}`}
                                            item={item}

                                            onItemClick={() => {

                                            }}

                                            onItemShare={(e: any) => {
                                                setOpenModalShare(true);
                                                setInDetailItem(e);
                                            }}
                                            onItemEdit={(e: any) => {
                                                if (e.type === 'folder') {
                                                    setOpenModalFolder(true);
                                                    setInDetailItem(e);
                                                } else if (e.type === 'file') {
                                                    setOpenModalFolder(true);
                                                    setInDetailItem(e);
                                                }
                                            }}
                                            onItemDownload={(e: any) => {
                                                handleDownload(e);
                                            }}
                                            isDownloading={isDownloading?.find((i: any) => i.id === item.id) ? true : false}
                                            onItemOpen={(e: any) => {
                                                if (e.type === 'folder') {
                                                    handleGoFolder(e.slug);
                                                } else if (e.type === 'file') {
                                                    setOpenModal(true);
                                                    setInDetailItem(e);
                                                }
                                            }}
                                            onItemDelete={(e: any) => {
                                                SweetAlertConfirm('Peringatan', 'Apakah anda yakin ingin menghapus berkas ini?', 'Ya, Hapus!', 'Batalkan').then((result) => {
                                                    if (result.isConfirmed) {
                                                        handleDeleteFile(e);
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
                                            onMoveItems={(sourceItems: any, targetFolder: any) => {
                                                // handleMoveToFolder(sourceItems, targetFolder);
                                            }}
                                            onSetFavorite={(e: any, is_favorite: boolean) => {
                                                handleSetFavorite(e, is_favorite);
                                            }}
                                            options={{
                                                view: true,
                                                favorite: false,
                                                edit_name: true,
                                                share: false,
                                                download: true,
                                                delete: true,
                                                copy_link: false,
                                            }}
                                            isOwner={user?.id == item?.author?.id ? true : false}
                                            selectedItems={selectedItems}
                                            isLoading={false}
                                            isError={false}
                                            isSelected={selectedItems.find((i: any) => i.id === item.id) ? true : false}
                                            isSelectedMode={selectedItems.length > 0}
                                        />
                                    ))}
                                </div>

                            </div>

                        </div>
                    )}

                </div>

            </div>


            <ModalDetail
                data={inDetailItem}
                isOpen={openModal}
                onItemDownload={(e: any) => {
                    handleDownload(e);
                }}
                isDownloading={isDownloading?.find((i: any) => i.id === inDetailItem?.id) ? true : false}
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

            <ModalFolder
                isCreate={isFolderCreate}
                isLoading={isLoadingFolder}
                data={inDetailItem}
                isOpen={openModalFolder}
                onClose={() => {
                    setOpenModalFolder(false);
                    setInDetailItem(null);
                    setSelectedItems([]);
                    setIsSelectedMode(false);
                    setIsLoading(false);
                    setIsError(false);
                }}
                onSubmit={(e: any) => {
                    handleRenamFolder(e.slug, e.name, e.id);
                }}
            />


            <QueueList
                datas={queueUploadFiles}
                isShow={showQueueList}
                onClose={() => {
                    setShowQueueList(false);
                }}
                onOpen={() => {
                    setShowQueueList(true);
                }}
                onReset={() => {
                    const remainingQueue = queueUploadFiles.filter((item: any) => item.status !== 'done' && item.status !== 'failed');
                    setQueueUploadFiles([]);
                    setQueueBatch(0);
                    setShowQueueList(false);
                }}
            />

        </div>
    )
}

export default function SharedPage() {

    return (
        <Suspense fallback={<div className="h-full w-full flex items-center justify-center">Loading...</div>}>
            <Page />
        </Suspense>
    );
}
