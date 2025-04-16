"use client";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { FolderIcon, FolderOpenIcon, DocumentIcon, CalendarIcon, TrashIcon, PencilSquareIcon, ShareIcon, ArchiveBoxArrowDownIcon, EyeIcon, PhotoIcon, ArchiveBoxIcon } from '@heroicons/react/24/outline'
import { useState } from 'react';

const ModalDetail = (
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
                        className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-[calc(100vw-300px)] data-closed:sm:translate-y-0 data-closed:sm:scale-95"
                    >
                        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <div className="flex items-center gap-x-2">
                                <div className="flex size-8 items-center justify-center rounded-full bg-blue-200 p-2">
                                    {/* <ExclamationTriangleIcon aria-hidden="true" className="size-6 text-red-600" /> */}

                                    {(['image'].includes(data?.mime)) && (
                                        <PhotoIcon className="h-4 w-4 inline group-hover:h-9 group-hover:w-9 transition-all duration-300" />
                                    )}
                                    {(['archive'].includes(data?.mime)) && (
                                        <ArchiveBoxIcon className="h-4 w-4 inline group-hover:h-9 group-hover:w-9 transition-all duration-300" />
                                    )}
                                    {(['image', 'archive'].includes(data?.mime) === false) && (
                                        <DocumentIcon className="h-4 w-4 inline group-hover:h-9 group-hover:w-9 transition-all duration-300" />
                                    )}
                                </div>
                                <div className="">
                                    <DialogTitle as="h3" className="text-base font-semibold text-gray-900">
                                        {data?.name}
                                    </DialogTitle>
                                </div>
                            </div>

                            <div className="mt-2 flex items-center justify-center w-full h-[calc(100vh-300px)]">
                                {data?.sv_in == 1 && (
                                    <embed src={`https://drive.google.com/file/d/${data?.path}/preview`}
                                        className="w-full h-full" />
                                )}
                                {data?.sv_in == 2 && (
                                    <div className="w-full h-full   ">
                                        {(['image'].includes(data?.mime)) && (
                                            <img src={data?.path}
                                                className="w-full h-full object-contain" />
                                        )}
                                        {(['video'].includes(data?.mime)) && (
                                            <video src={data?.path}
                                                className="w-full h-full object-contain" controls></video>
                                        )}
                                        {(['audio'].includes(data?.mime)) && (
                                            <audio src={data?.path}
                                                className="w-full h-full" controls></audio>
                                        )}


                                        {['pdf'].includes(data?.extension) && (
                                            <iframe src={`${data?.path}`}
                                                className="w-full h-full"></iframe>
                                        )}

                                        {['ppt', 'pptx'].includes(data?.extension) && (
                                            <iframe src={`https://view.officeapps.live.com/op/embed.aspx?src=${data.path}`}
                                                className="w-full h-full"></iframe>
                                        )}

                                        {['csv', 'xls', 'xlsx'].includes(data?.extension) && (
                                            <iframe src={`https://view.officeapps.live.com/op/embed.aspx?src=${data.path}`}
                                                className="w-full h-full"></iframe>
                                        )}

                                        {['doc', 'docx'].includes(data?.extension) && (
                                            <iframe src={`https://view.officeapps.live.com/op/embed.aspx?src=${data.path}`}
                                                className="w-full h-full"></iframe>
                                        )}

                                        {['zip', 'rar', '7z', 'tar', 'gz', 'bz2', 'html', 'php', 'css', 'js', 'json'].includes(data?.extension) && (
                                            <div className="flex items-center justify-center flex-col w-full h-full">
                                                <ArchiveBoxIcon className="w-16 h-16 text-slate-400" />
                                                <div className="mt-2 text-slate-400">
                                                    Tidak dapat menampilkan berkas ini
                                                </div>
                                                {/* <button
                                                    onClick={() => {
                                                        __confirmDownload(data);
                                                    }}
                                                    className="mt-5 flex items-center rounded px-4 py-2 bg-slate-200 shadow">
                                                    <ArchiveBoxArrowDownIcon className="w-8 h-8 text-slate-700 mr-2" />
                                                    <div className="text-md text-slate-700">
                                                        Unduh Berkas
                                                    </div>
                                                </button> */}
                                            </div>
                                        )}
                                    </div>
                                )}
                                {/* {(['image'].includes(data?.mime) === false) && (
                                    <embed src={`https://drive.google.com/file/d/${data?.path}/preview`}
                                        className="w-full h-full" />
                                )} */}
                            </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                            <button
                                type="button"
                                onClick={() =>
                                    onClose()
                                }
                                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto cursor-pointer select-none whitespace-nowrap"
                            >
                                Tutup
                            </button>
                        </div>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    );
}
export default ModalDetail;