"use client";
import { getFolders, moveItems } from '@/apis/apiResources';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { DocumentIcon, PhotoIcon, ArchiveBoxIcon, FolderIcon } from '@heroicons/react/24/outline'
import { ArrowDownIcon, ArrowLeftIcon, FolderOpenIcon } from '@heroicons/react/24/solid';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2'

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

const ModalMove = (
    {
        data,
        isOpen,
        onClose,
        onSubmit,
    }: {
        data: any
        isOpen: boolean
        onClose: () => void
        onSubmit: () => void
    }
) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (isOpen) {
            _GetFolders();
        }
    }, [isOpen])

    const [folders, setFolders] = useState<any[]>([]);
    const [currentFolder, setCurrentFolder] = useState<any>(null);

    const _GetFolders = (slug: any = '') => {
        const excludeIds = data.map((item: any) => item.slug);
        getFolders(slug, excludeIds).then((res) => {
            if (res.status === 'success') {
                const folders = res.data.folders.sort((a: any, b: any) => a.name.localeCompare(b.name));
                setFolders(folders);
                setCurrentFolder(res.data.currentPath);
            }
        });
    }

    const handleFolderClicked = (slug: any) => {
        setCurrentFolder(folders.find(folder => folder.slug === slug) || null);
        _GetFolders(slug);
    }

    const handleMoveToFolder = () => {
        moveItems(data.map((item: any) => item.slug), currentFolder?.slug ?? 0).then(res => {
            if (res.status === 'success') {
                onSubmit();
            }
            if (res.status === 'error') {
                SweetAlertToast('error', 'Gagal Memindahkan', res.message);
            }
            if (res.status === 'error validation') {
                SweetAlertToast('error', 'Error', 'Gagal Memindahkan');
            }
        });
    }

    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-10">
            <DialogBackdrop
                transition
                className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
            />

            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <DialogPanel
                        transition
                        className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 w-full sm:w-[800px] sm:max-w-[calc(100vw-300px)] data-closed:sm:translate-y-0 data-closed:sm:scale-95"
                    >
                        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <div className="font-semibold">
                                Memindahkan {data.length} item ke:
                            </div>
                            <div className="mt-4">

                                <ul>
                                    {currentFolder ? (
                                        <li className="font-semibold cursor-pointer border-b">
                                            <div className="flex items-center justify-between pb-2">
                                                <div className="">
                                                    <FolderOpenIcon className="h-5 w-5 inline mr-2" />
                                                    {currentFolder.name}
                                                </div>
                                                <div className="">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setCurrentFolder(null);
                                                            _GetFolders(currentFolder.parent_slug ?? '');
                                                        }}
                                                        className="block w-full text-left px-4 py-2 text-sm cursor-pointer"
                                                    >
                                                        <ArrowLeftIcon className="h-4 w-4 inline mr-2" />
                                                        Back
                                                    </button>
                                                </div>
                                            </div>
                                        </li>
                                    ) : (
                                        <li className="font-semibold cursor-pointer border-b">
                                            <div className="flex items-center justify-between pb-2">
                                                <div className="">
                                                    <FolderOpenIcon className="h-5 w-5 inline mr-2" />
                                                    Root
                                                </div>
                                            </div>
                                        </li>
                                    )}

                                    {folders.map((folder) => (
                                        <li key={folder.id}>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    handleFolderClicked(folder.slug);
                                                }}
                                                className={`block w-full text-left px-4 py-2 text-sm cursor-pointer ${currentFolder?.id === folder.id ? 'bg-gray-100 font-semibold' : 'hover:bg-gray-50'}`}
                                            >
                                                <FolderIcon className="h-4 w-4 inline mr-2" />
                                                {/* <FolderOpenIcon className="h-4 w-4 inline mr-2" /> */}
                                                {folder.name}
                                            </button>
                                        </li>
                                    ))}

                                    {folders.length === 0 && (
                                        <li className="text-sm text-gray-500 italic px-4 py-2">
                                            Tidak ada folder.
                                        </li>
                                    )}

                                    <li className="">
                                        <div className="flex items-center justify-center mt-5">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    handleMoveToFolder();
                                                }}
                                                className="text-center px-4 py-2 text-sm cursor-pointer font-semibold rounded-lg bg-blue-200"
                                            >
                                                <ArrowDownIcon className="h-3 w-3 inline mr-2" />
                                                Pindah ke {currentFolder?.name ?? 'Root'}
                                            </button>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        {/* <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                            <button
                                type="button"
                                onClick={() =>
                                    onClose()
                                }
                                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto cursor-pointer select-none whitespace-nowrap"
                            >
                                Tutup
                            </button>
                        </div> */}
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    );
}
export default ModalMove;