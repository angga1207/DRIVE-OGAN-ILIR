"use client";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { FolderIcon, FolderOpenIcon, DocumentIcon, CalendarIcon, TrashIcon, PencilSquareIcon, ShareIcon, ArchiveBoxArrowDownIcon, EyeIcon, PhotoIcon, ArchiveBoxIcon } from '@heroicons/react/24/outline'
import { useState } from 'react';

const ModalFolder = (
    {
        data,
        isOpen,
        isCreate,
        onClose,
        onSubmit,
        isLoading,
    }: {
        data: any
        isOpen: boolean
        isCreate: boolean
        onClose: () => void
        onSubmit: (data: any) => void
        isLoading: boolean
    }
) => {
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
                        className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-xl data-closed:sm:translate-y-0 data-closed:sm:scale-95"
                    >
                        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <div className="flex items-center gap-x-2">
                                <div className="flex size-8 items-center justify-center rounded-full bg-blue-200 p-2">
                                    {/* <ExclamationTriangleIcon aria-hidden="true" className="size-6 text-red-600" /> */}
                                    <FolderIcon className="h-4 w-4 inline group-hover:h-9 group-hover:w-9 transition-all duration-300" />
                                </div>
                                <div className="">
                                    <DialogTitle as="h3" className="text-base font-semibold text-gray-900">
                                        {isCreate ? 'Buat Folder' : 'Ubah Nama'}
                                    </DialogTitle>
                                </div>
                            </div>

                            <div className="mt-2 w-full max-h-[calc(100vh-300px)]">
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        if (isLoading === false) {
                                            if (data?.name.length > 0) {
                                                onSubmit({
                                                    ...data,
                                                    name: data?.name
                                                })
                                            } else {
                                                const folderNameInput = document.getElementById('folder-name') as HTMLInputElement;
                                                folderNameInput.classList.add('border-red-500');
                                                folderNameInput.focus();
                                                setTimeout(() => {
                                                    folderNameInput.classList.remove('border-red-500');
                                                }, 2000);
                                            }
                                        }
                                    }}
                                >
                                    <div className="">
                                        <label htmlFor='folder-name'>
                                            <span className="text-sm font-semibold text-gray-900">
                                                Nama Folder
                                            </span>
                                            <span className='text-red-500'>*</span>
                                            <span className="font-normal text-gray-500 text-xs">
                                                &nbsp; (maksimal 255 karakter)
                                            </span>
                                        </label>
                                        <textarea
                                            // type="text"
                                            placeholder='Masukkan Nama Folder'
                                            id="folder-name"
                                            defaultValue={data?.name}
                                            autoComplete='off'
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                if (value.length > 255) {
                                                    e.target.value = value.slice(0, 255);
                                                }
                                                if (value.length > 0) {
                                                    e.target.classList.remove('border-red-500');
                                                }
                                                data.name = value;
                                            }}
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 ring-0 focus:ring-0 outline-0 transition-border min-h-[40px] max-h-[200px] resize-none"
                                        ></textarea>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 gap-x-1">
                            <button
                                type="button"
                                onClick={() => {
                                    if (isLoading === false) {
                                        if (data?.name.length > 0) {
                                            onSubmit({
                                                ...data,
                                                name: data?.name
                                            })
                                        } else {
                                            const folderNameInput = document.getElementById('folder-name') as HTMLInputElement;
                                            folderNameInput.classList.add('border-red-500');
                                            folderNameInput.focus();
                                            setTimeout(() => {
                                                folderNameInput.classList.remove('border-red-500');
                                            }, 2000);
                                        }
                                    }
                                }}
                                className="mt-3 inline-flex w-full justify-center rounded-md text-slate-100 bg-green-400 px-3 py-2 text-sm font-semibold hover:text-green-900 border border-slate-300 ring-0 outline-0 shadow-xs hover:bg-green-500 sm:mt-0 sm:w-auto cursor-pointer select-none whitespace-nowrap transition-all duration-300"
                            >
                                {isLoading ? 'Menyimpan...' : isCreate ? 'Tambahkan Folder' : 'Ubah Nama'}
                            </button>
                            <button
                                type="button"
                                onClick={() =>
                                    onClose()
                                }
                                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-0 border border-slate-300 hover:bg-gray-50 sm:mt-0 sm:w-auto cursor-pointer select-none whitespace-nowrap transition-all duration-300"
                            >
                                Tutup
                            </button>
                        </div>
                    </DialogPanel>
                </div>
            </div >
        </Dialog >
    );
}

export default ModalFolder;