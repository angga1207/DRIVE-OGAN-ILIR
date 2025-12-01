import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { DocumentPlusIcon, FolderIcon, FolderPlusIcon } from "@heroicons/react/24/outline";
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
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

const AddMenu = ({
    isDisabled = false,
    isLoading,
    isLoadingFolder,
    isLoadingBreadcrumbs,

    onCreateFolder,
    onUploadFiles,
    onUploadFolder,
}: {
    isDisabled?: boolean;
    isLoading: boolean;
    isLoadingFolder: boolean;
    isLoadingBreadcrumbs: boolean;

    onCreateFolder: () => void;
    onUploadFiles: (value: FileList) => void;
    onUploadFolder: (value: FileList, folderName: string) => void;
}) => {
    return (
        <>
            <input type="file"
                className="hidden"
                id="upload-files"
                multiple
                onChange={(e: any) => {
                    const files = e.target.files;
                    if (files.length > 0) {
                        onUploadFiles(e);
                    }
                }}
                onClick={(e: any) => {
                    e.target.value = null;
                }}
            />

            <input type="file"
                className="hidden"
                id="upload-folder"
                // @ts-expect-error non-standard but widely supported in Chromium
                webkitdirectory=""
                directory=""
                multiple
                onChange={(e: any) => {
                    const files = e.target.files;
                    const folderName = e.target.files[0]?.webkitRelativePath.split('/')[0] || 'Folder';
                    if (files.length > 0 && folderName) {
                        onUploadFolder(files, folderName);
                    }
                }}
                onClick={(e: any) => {
                    e.target.value = null;
                }}
            />

            <div className="flex flex-col gap-2 mb-5">

                {isDisabled && (
                    <Link
                        href={`#`}
                        className="flex items-center justify-center gap-1 cursor-not-allowed rounded-xl shadow bg-gray-400 text-gray-900 px-3 py-2 select-none">
                        <PlusCircleIcon className="h-6 w-6" />
                        <div className="font-semibold">
                            TAMBAH
                        </div>
                    </Link>
                )}

                {!isDisabled && (
                    <Menu>
                        <MenuButton>

                            {(isLoading === false && isLoadingFolder === false && isLoadingBreadcrumbs === false) ? (
                                <div className="flex items-center justify-center gap-1 cursor-pointer rounded-xl shadow bg-[#ebbd18] hover:bg-[#003a69] text-[#003a69] hover:text-[#ebbd18] hover:border hover:border-[#ebbd18] px-3 py-2 transition-all duration-300 select-none">
                                    <PlusCircleIcon className="h-6 w-6" />
                                    <div className="font-semibold">
                                        TAMBAH
                                    </div>
                                </div>
                            ) : (
                                <div className="h-10 w-full inline-flex items-center justify-center gap-x-1.5 rounded-xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-900 ring-1 shadow-xs ring-slate-300 ring-inset hover:bg-slate-200 cursor-pointer select-none whitespace-nowrap animate-pulse"></div>
                            )}
                        </MenuButton>
                        <MenuItems
                            anchor="bottom end"
                            transition
                            className="absolute right-0 z-10 mt-1 bg-[#ebbd18] px-2 py-3 rounded-xl shadow w-[236px]"
                        >
                            <MenuItem>
                                {/* make folder start */}
                                {(isLoading === false && isLoadingFolder === false && isLoadingBreadcrumbs === false) ? (
                                    <div className="">
                                        <button
                                            className="inline-flex items-center w-full gap-x-1.5 rounded-md px-3 py-2 font-semibold cursor-pointer select-none whitespace-nowrap transition-all duration-500 hover:bg-slate-100 text-sm"
                                            onClick={() => {
                                                onCreateFolder();
                                            }}
                                        >
                                            <FolderIcon className="h-4.5 w-4.5 inline" />
                                            Buat Folder
                                        </button>
                                    </div>
                                ) : (
                                    <div className="h-10 w-full inline-flex items-center justify-center gap-x-1.5 rounded-md bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-900 ring-1 shadow-xs ring-slate-300 ring-inset hover:bg-slate-200 cursor-pointer select-none whitespace-nowrap animate-pulse"></div>
                                )}
                                {/* make folder end */}
                            </MenuItem>

                            {/* separate */}
                            <div className="border-t border-slate-200 my-2"></div>

                            <MenuItem>
                                {/* upload files start */}
                                {(isLoading === false && isLoadingFolder === false && isLoadingBreadcrumbs === false) ? (
                                    <div className="relative">
                                        <div
                                            className="inline-flex items-center w-full gap-x-1.5 rounded-md px-3 py-2 font-semibold cursor-pointer select-none whitespace-nowrap transition-all duration-500 hover:bg-slate-100 text-sm"
                                            onClick={(e: any) => {
                                                const uploadFiles = document.getElementById('upload-files') as HTMLInputElement;
                                                uploadFiles.click();
                                            }}
                                        >
                                            <DocumentPlusIcon className="h-4.5 w-4.5 inline" />
                                            Unggah Berkas
                                        </div>
                                    </div>
                                ) : (
                                    <div className="h-10 w-full inline-flex items-center justify-center gap-x-1.5 rounded-md bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-900 ring-1 shadow-xs ring-slate-300 ring-inset hover:bg-slate-200 cursor-pointer select-none whitespace-nowrap animate-pulse"></div>
                                )}
                                {/* upload files end */}
                            </MenuItem>

                            <MenuItem>
                                {/* upload folder start */}
                                {(isLoading === false && isLoadingFolder === false && isLoadingBreadcrumbs === false) ? (
                                    <div className="">
                                        <div
                                            className="inline-flex items-center w-full gap-x-1.5 rounded-md px-3 py-2 font-semibold cursor-pointer select-none whitespace-nowrap transition-all duration-500 hover:bg-slate-100 text-sm"
                                            // onClick={(e: any) => {
                                            //     const uploadFiles = document.getElementById('upload-folder') as HTMLInputElement;
                                            //     uploadFiles.click();
                                            // }}
                                            onClick={() => {
                                                SweetAlertToast('info', 'Fitur Unggah Folder', 'Fitur ini sedang dalam pengembangan.')
                                                return;
                                            }}
                                        >
                                            <FolderPlusIcon className="h-4.5 w-4.5 inline" />
                                            Unggah Folder
                                        </div>
                                    </div>
                                ) : (
                                    <div className="h-10 w-full inline-flex items-center justify-center gap-x-1.5 rounded-md bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-900 ring-1 shadow-xs ring-slate-300 ring-inset hover:bg-slate-200 cursor-pointer select-none whitespace-nowrap animate-pulse"></div>
                                )}
                                {/* upload folder end */}
                            </MenuItem>

                        </MenuItems>
                    </Menu>
                )}

            </div>
        </>
    )
}

export default AddMenu