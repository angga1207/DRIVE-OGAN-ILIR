"use client";
import { useEffect, useState } from "react";
import ItemCardSharer from "../Components/ItemCardSharer";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getAccessToFolder, getPublicPath, getSharedItems, postDownload } from "@/apis/apiResources";
import ModalDetailShared from "../Components/modalDetailShared";
import { FolderIcon } from "@heroicons/react/24/outline";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import Link from "next/link";
import { getCookie } from "cookies-next";
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

export default function SharerClient() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();

    const [globalSlug, setGlobalSlug] = useState<any>(null);
    const [user, setUser] = useState<any>(null);
    const [isEditable, setIsEditable] = useState(false);

    const [items, setItems] = useState<any>([]);
    const [arrBreadcrumbs, setArrBreadcrumbs] = useState<any>([]);
    const [currentPath, setCurrentPath] = useState<any>(null);
    const [openModal, setOpenModal] = useState(false);
    const [selectedItems, setSelectedItems] = useState<any>([]);
    const [inDetailItem, setInDetailItem] = useState<any>(null);
    const [isMounted, setIsMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isDownloading, setIsDownloading] = useState<any>([]);
    const [isLoadingBreadcrumbs, setIsLoadingBreadcrumbs] = useState(false);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    });

    useEffect(() => {
        if (isMounted) {
            const cookieUser = getCookie('user');
            if (cookieUser) {
                const user = JSON.parse(cookieUser as string);
                setUser(user);
            } else {
                // Jika tidak ada user di cookie, berarti bukan user dengan akses tambahan
                setIsEditable(false);
            }
        }
    }, [isMounted]);

    // console.log(user)

    useEffect(() => {
        if (isMounted) {
            setGlobalSlug(searchParams.get('_id'));
        }
    }, [isMounted, searchParams]);

    useEffect(() => {
        if (isMounted) {
            setItems([]);
            setIsLoading(true);
            setIsLoadingBreadcrumbs(true);
            if (globalSlug) {
                getPublicPath(globalSlug).then((res: any) => {
                    if (res.status === 'success') {
                        setArrBreadcrumbs(res.data);
                        setCurrentPath(res.data.current);
                        setIsEditable(res.data.current.publicity?.editable || false);
                    }
                    setIsLoadingBreadcrumbs(false);
                });
                getSharedItems(globalSlug).then((res: any) => {
                    if (res.status === 'success') {
                        setItems(res.data);
                    }
                    setIsLoading(false);
                });
            } else {
            }
        }
    }, [isMounted, searchParams, pathname, globalSlug]);

    const handleDownload = (data: any) => {
        setIsDownloading((prev: any) => {
            return [...prev, { id: data.id }];
        });
        postDownload([data.slug]).then((res: any) => {
            if (res.status === 'success') {
                const link = document.createElement('a');
                link.href = res.data[0].url;
                link.setAttribute('download', res.data[0].name);
                // Uncomment the next line if you want to multiply the download feature
                // link.setAttribute('target', '_blank');
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
            setIsDownloading((prev: any) => {
                return prev.filter((item: any) => item.id !== data.id);
            });
        });
    }

    const handleGoFolder = (slug: string) => {
        const url = new URL(window.location.href);
        url.searchParams.set('_id', slug);
        window.history.pushState({}, '', url.toString());
        // Trigger a re-render by updating state
        setGlobalSlug(slug);
        setItems([]);
        setIsLoading(true);
        setIsLoadingBreadcrumbs(true);
        getPublicPath(slug).then((res: any) => {
            if (res.status === 'success') {
                setArrBreadcrumbs(res.data);
                setCurrentPath(res.data.current);
            }
            setIsLoadingBreadcrumbs(false);
        });
        getSharedItems(slug).then((res: any) => {
            if (res.status === 'success') {
                setItems(res.data);
            }
            setIsLoading(false);
        });
    }

    const handleRetryFetch = () => {
        setItems([]);
        setIsLoading(true);
        setIsError(false);
        if (globalSlug) {
            getSharedItems(globalSlug).then((res: any) => {
                if (res.status === 'success') {
                    setItems(res.data);
                } else {
                    setIsError(true);
                }
                setIsLoading(false);
            }).catch((err) => {
                setIsError(true);
                setIsLoading(false);
            });
        }
    }

    useEffect(() => {
        // if (isMounted && user && currentPath && currentPath?.type == 'folder' && user.id !== currentPath?.author.id) {
        //     getAccessToFolder(globalSlug).then((res: any) => {
        //         if (res.status === 'success') {
        //             SweetAlertToast(
        //                 'success',
        //                 'Akses Berhasil Didapatkan',
        //                 'Anda sekarang memiliki akses tambahan ke folder ini.'
        //             );
        //             router.push('/shared?_id=' + globalSlug);
        //         } else {
        //             SweetAlertToast(
        //                 'success',
        //                 'Berhasil',
        //                 'Mengalihkan ke halaman akses...',
        //             );
        //             router.push('/shared?_id=' + globalSlug);
        //             return;
        //         }
        //     }).catch((err) => {
        //         SweetAlertToast(
        //             'error',
        //             'Gagal Mendapatkan Akses',
        //             'Terjadi kesalahan saat mencoba mendapatkan akses.'
        //         );
        //     });
        // }
    }, [isMounted, user, currentPath]);

    return (
        <div className="px-4 py-6 sm:px-6 lg:px-8"
            onContextMenu={(e) => e.preventDefault()}>

            {isLoadingBreadcrumbs ? (
                <div className="flex flex-wrap space-x-4 bc items-center mb-5">
                    <div className="font-semibold flex gap-x-1 items-center animate-pulse">
                        <div className="h-8 w-80 bg-slate-100 rounded-lg"></div>
                    </div>
                </div>
            ) : (
                <div className="flex flex-wrap space-x-4 bc items-center mb-5 select-none">
                    {(currentPath && currentPath?.type == 'folder') && (
                        <Breadcrumb>
                            <BreadcrumbList>
                                {arrBreadcrumbs?.paths?.map((item: any, index: number) => (
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
                                ))}

                                <BreadcrumbItem>
                                    <BreadcrumbPage className="font-semibold text-[#003a69] flex gap-x-1 items-center">
                                        <FolderIcon className="h-5 w-5 inline" />
                                        <div className='truncate max-w-[180px]'>
                                            {currentPath?.name}
                                        </div>
                                    </BreadcrumbPage>
                                </BreadcrumbItem>

                            </BreadcrumbList>
                        </Breadcrumb>
                    )}
                </div>
            )}

            <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto px-4 -mx-4 pb-4">
                {isLoading ? (([0, 1, 2, 3, 4, 5].map((item: any, index: number) => (
                    <div key={`loading-${index}`} className="animate-pulse flex items-center gap-x-2">
                        <div className="h-18 w-full card bg-slate-100"></div>
                    </div>
                )))) : (items?.length > 0 && (
                    items.map((item: any, index: number) => (
                        <ItemCardSharer
                            key={index}
                            item={item}
                            onItemClick={() => {
                                if (item.type === 'folder') {
                                    handleGoFolder(item.slug);
                                }
                            }}
                            onItemDownload={(e: any) => {
                                handleDownload(e);
                            }}
                            isDownloading={isDownloading?.find((i: any) => i.id === item.id) ? true : false}
                            onItemOpen={(e: any) => {
                                if (e.type === 'folder') {
                                    // handleGoFolder(e.slug);
                                } else if (e.type === 'file') {
                                    setOpenModal(true);
                                    setInDetailItem(e);
                                }
                            }}
                            onItemSelect={(e: any) => {
                                setSelectedItems((prev: any) => {
                                    if (prev.includes(e.id)) {
                                        return prev.filter((item: any) => item !== e.id);
                                    } else {
                                        return [...prev, e.id];
                                    }
                                });
                            }}
                            selectedItems={selectedItems}
                            isLoading={isLoading}
                            isError={isError}
                            isSelected={selectedItems.includes(item.id)}
                            isSelectedMode={false}
                        />
                    )))
                )}

                {(isLoading == false && items?.length === 0) && (
                    <div className="h-full w-full flex flex-col items-center justify-center rounded-lg px-10 py-20">
                        <div className="text-center">
                            <h3 className="mt-2 text-sm font-medium text-gray-900">
                                Berkas atau folder yang dibagikan tidak ditemukan.
                            </h3>
                            <div className="mt-6 flex justify-center">
                                <Link
                                    href={`${user ? '/dashboard' : '/login'}`}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#003a69] hover:bg-[# ebbd18] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[# ebbd18] transition-all duration-300"
                                >
                                    Kembali ke Beranda
                                </Link>
                            </div>
                        </div>
                    </div>
                )}

            </div>


            <ModalDetailShared
                data={inDetailItem}
                // isEditable={isEditable}
                isEditable={false}
                isOpen={openModal}
                onItemDownload={(e: any) => {
                    handleDownload(e);
                }}
                isDownloading={isDownloading?.find((i: any) => i.id === inDetailItem?.id) ? true : false}
                onClose={() => {
                    setOpenModal(false);
                    setInDetailItem(null);
                    setSelectedItems([]);
                    // setIsSelectedMode(false);
                    setIsLoading(false);
                    setIsError(false);
                }}
                onSubmit={() => {
                    setOpenModal(false);
                    setInDetailItem(null);
                    setSelectedItems([]);
                    // setIsSelectedMode(false);
                    setIsLoading(false);
                    setIsError(false);
                }}
            />
        </div>
    );
}