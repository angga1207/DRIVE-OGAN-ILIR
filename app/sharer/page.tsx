"use client";
import { useEffect, useState } from "react";
import ItemCardSharer from "../Components/ItemCardSharer";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getCookie } from "cookies-next";
import { getPath, getSharedItems, postDownload } from "@/apis/apiResources";
import ModalDetail from "../Components/modalDetail";
import { FolderIcon } from "@heroicons/react/24/outline";

const Page = () => {
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const [user, setUser] = useState<any>(null);

    const [items, setItems] = useState<any>([]);
    const [arrBreadcrumbs, setArrBreadcrumbs] = useState<any>([]);
    const [currentPath, setCurrentPath] = useState<any>(null);
    const [openModal, setOpenModal] = useState(false);
    const [selectedItems, setSelectedItems] = useState<any>([]);
    const [inDetailItem, setInDetailItem] = useState<any>(null);
    const [isMounted, setIsMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isDownloading, setIsDownloading] = useState<any>([]);
    const [isLoadingBreadcrumbs, setIsLoadingBreadcrumbs] = useState(false);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    });

    useEffect(() => {
        if (isMounted) {
            const localUser = localStorage.getItem('user');
            if (localUser) {
                const user = JSON.parse(localUser);
                setUser(user);
            }
        }
    }, [isMounted]);

    useEffect(() => {
        if (isMounted) {
            setItems([]);
            setIsLoading(true);
            setIsLoadingBreadcrumbs(true);
            const slug = searchParams.get('_id');
            if (slug) {
                getPath(slug).then((res: any) => {
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
            } else {
            }
        }
    }, [isMounted, searchParams, pathname]);

    const handleDownload = (data: any) => {
        setIsDownloading((prev: any) => {
            return [...prev, { id: data.id }];
        });
        postDownload(data.slug).then((res: any) => {
            if (res.status === 'success') {
                const link = document.createElement('a');
                link.href = res.data;
                link.setAttribute('download', data.name);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
            setIsDownloading((prev: any) => {
                return prev.filter((item: any) => item.id !== data.id);
            });
        });
    }

    return (
        <div>
            {isLoadingBreadcrumbs ? (
                <div className="flex flex-wrap space-x-4 bc items-center mb-5">
                    <div className="font-semibold flex gap-x-1 items-center animate-pulse">
                        <div className="h-8 w-80 bg-slate-100 rounded-lg"></div>
                    </div>
                </div>
            ) : (
                <div className="flex flex-wrap space-x-4 bc items-center mb-5 select-none">
                    <div className="font-semibold flex gap-x-1 items-center transition-all duration-300 cursor-pointer">
                        <FolderIcon className="h-5 w-5 inline" />
                        {currentPath?.name}
                    </div>
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
                            onItemClick={() => { }}
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
            </div>


            <ModalDetail
                data={inDetailItem}
                isOpen={openModal}
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
export default Page;