import { clientDomain } from '@/apis/serverConfig';
import { FolderIcon, CalendarIcon, TrashIcon, PencilSquareIcon, ShareIcon, ArchiveBoxArrowDownIcon, EyeIcon, LockClosedIcon, StopCircleIcon, StarIcon } from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid'
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuTrigger,
} from "@/components/ui/context-menu"

import { RiCollageLine, RiFileExcel2Fill, RiFileImageFill, RiFileList3Fill, RiFilePdf2Fill, RiFilePpt2Fill, RiFileWord2Fill, RiFileZipFill, RiFilmFill, RiFinderFill } from "react-icons/ri";

import Tippy from '@tippyjs/react';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import 'tippy.js/dist/tippy.css';


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

const ItemCardList = (
    {
        item,
        onItemClick,
        onItemDelete,
        onItemEdit,
        onItemShare,
        onItemDownload,
        onItemOpen,
        onItemSelect,
        onMoveItems,
        onDragging,
        onSetFavorite,
        draggable,
        selectedItems,
        isLoading,
        isDownloading,
        isError,
        isSelected,
        isSelectedMode,
    }: {
        item: any
        onItemClick: (item: any) => void
        onItemDelete: (item: any) => void
        onItemEdit: (item: any) => void
        onItemShare: (item: any) => void
        onItemDownload: (item: any) => void
        onItemOpen: (item: any) => void
        onItemSelect: (item: any) => void
        onMoveItems: (items: any, targetFolder: any) => void
        onDragging: (isDragging: boolean) => void
        onSetFavorite: (item: any, isFavorite: boolean) => void
        draggable: boolean,
        selectedItems: Array<any>
        isLoading: boolean
        isDownloading: boolean
        isError: boolean
        isSelected: boolean
        isSelectedMode: boolean
    }
) => {
    if (isLoading) {
        return (
            <div className="animate-pulse flex items-center gap-x-2">
                <div className="h-18 w-full card bg-slate-100"></div>
            </div>
        )
    }
    if (isError) {
        return (
            <div className="card text-red-500 select-none">
                Error loading item
            </div>
        )
    }

    const [sourceIds, setSourceIds] = useState<any>(null);
    const [isMounted, setIsMounted] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (isMounted) {
            if (selectedItems.length > 0) {
                setSourceIds(selectedItems.map((i: any) => i.slug));
            }
        }
    }, [isMounted, selectedItems]);

    const onDragStart = (e: React.DragEvent<HTMLDivElement>, DragId: any) => {
        if (selectedItems.length == 0) {
            localStorage.setItem('draggedItem', DragId);
        }
        setIsDragging(true);
        onDragging(true);
    }

    const onDrop = (e: React.DragEvent<HTMLDivElement>, targetId: any) => {
        e.preventDefault();
        // e.stopPropagation();
        if (selectedItems.length == 0 && targetId) {
            const DraggedIds = localStorage.getItem('draggedItem');
            if (DraggedIds != targetId) {
                onMoveItems([DraggedIds], targetId);
                localStorage.removeItem('draggedItem');
            }
        }
        if (selectedItems.length > 0 && targetId) {
            const DraggedIds = sourceIds
            if (DraggedIds.filter((id: any) => id === targetId).length > 0) {
                SweetAlertToast('error', 'Gagal Memindahkan', 'Tidak dapat memindahkan di sini');
            } else {
                onMoveItems(selectedItems.map((i: any) => i.slug), targetId);
                setSourceIds([]);
            }
        }
        setIsDragging(false);
        onDragging(false)
    }

    return (
        <>
            <ContextMenu>
                <ContextMenuTrigger>
                    <div
                        className={`relative card ${item?.type == 'folder' ? 'bg-gradient-to-r from-[#003a69] from-50% via-60% to-100% to-[#004c8b]' : 'bg-gradient-to-r from-[#003a69] from-50% via-60% to-100% to-[#004c8b]'} group cursor-pointer ${isSelected === true ? '!bg-green-100' : ''} ${(isDragging && isSelected) ? 'opacity-50' : ''}${(isDragging) ? 'opacity-50' : ''} transition-all duration-500`}
                        id={`item-${item?.slug}`}

                        draggable={draggable}

                        onDragStart={(e) => onDragStart(e, item.slug)}

                        onDragOver={(e) => {
                            e.preventDefault();
                        }}

                        onDragEnd={(e) => {
                            // e.preventDefault();
                            setIsDragging(false);
                        }}

                        onDrop={(e) => onDrop(e, item.slug)}
                        aria-selected={isSelected}
                    >
                        {isDownloading ? (
                            <div className="absolute top-0 left-0 h-full w-full bg-[#003a69]/50 z-1 select-none">
                                <div className="w-full h-20 flex items-center justify-center animate-pulse bg-[#003a69] text-[#ebbd18] font-semibold text-lg">
                                    <StopCircleIcon className="h-8 w-8 animate-spin" />
                                    <div className="text-[#ebbd18] font-semibold text-lg">
                                        {item?.type === 'folder' ? 'Membuka Folder...' : 'Mengunduh Berkas...'}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-x-5">
                                    {/* mobile responsive */}
                                    <div className='grow flex items-center gap-x-2'>

                                        <div className="">
                                            <input
                                                type="checkbox"
                                                className="h-3.5 w-3.5 rounded-full border-0 border-gray-200 text-indigo-600 focus:ring-indigo-500"
                                                checked={selectedItems?.find((i: any) => i.id == item.id) ? true : false}
                                                onChange={() => onItemSelect(item)}
                                            />
                                        </div>
                                        <div
                                            className="text-slate-500"
                                            onDoubleClick={() => onItemOpen(item)}
                                            onClick={() => {
                                                if (isSelectedMode) {
                                                    onItemSelect(item)
                                                } else {
                                                    // onItemClick(item)
                                                }
                                            }}
                                        >
                                            {item.type === 'folder' ? (
                                                <FolderIcon className="h-8 w-8 inline group-hover:h-9 group-hover:w-9 group-hover:-rotate-3 transition-all duration-300 text-[#ebbd18] group-hover:text-white" />
                                            ) : (
                                                <>
                                                    {(['image', 'image/jpeg', 'image/png'].includes(item?.full_mime)) && (
                                                        <RiFileImageFill className="h-8 w-8 inline group-hover:h-9 group-hover:w-9 group-hover:-rotate-3 transition-all duration-300 text-purple-800 group-hover:text-white" />
                                                    )}
                                                    {(['video', 'video/mp4', 'video/mkv', 'video/avi'].includes(item?.full_mime)) && (
                                                        <RiFilmFill className="h-8 w-8 inline group-hover:h-9 group-hover:w-9 group-hover:-rotate-3 transition-all duration-300 text-red-800 group-hover:text-white" />
                                                    )}
                                                    {(['text/plain', 'text/csv'].includes(item?.full_mime)) && (
                                                        <RiFileList3Fill className="h-8 w-8 inline group-hover:h-9 group-hover:w-9 group-hover:-rotate-3 transition-all duration-300 text-green-800 group-hover:text-white" />
                                                    )}
                                                    {(['application/pdf'].includes(item?.full_mime)) && (
                                                        <RiFilePdf2Fill className="h-8 w-8 inline group-hover:h-9 group-hover:w-9 group-hover:-rotate-3 transition-all duration-300 text-red-600 group-hover:text-white" />
                                                    )}
                                                    {(['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'].includes(item?.full_mime)) && (
                                                        <RiFileExcel2Fill className="h-8 w-8 inline group-hover:h-9 group-hover:w-9 group-hover:-rotate-3 transition-all duration-300 text-green-600 group-hover:text-white" />
                                                    )}
                                                    {(['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(item?.full_mime)) && (
                                                        <RiFileWord2Fill className="h-8 w-8 inline group-hover:h-9 group-hover:w-9 group-hover:-rotate-3 transition-all duration-300 text-blue-600 group-hover:text-white" />
                                                    )}
                                                    {(['application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'].includes(item?.full_mime)) && (
                                                        <RiFilePpt2Fill className="h-8 w-8 inline group-hover:h-9 group-hover:w-9 group-hover:-rotate-3 transition-all duration-300 text-red-500 group-hover:text-white" />
                                                    )}
                                                    {(['application/vnd.oasis.opendocument.text'].includes(item?.full_mime)) && (
                                                        <RiFileWord2Fill className="h-8 w-8 inline group-hover:h-9 group-hover:w-9 group-hover:-rotate-3 transition-all duration-300 text-green-500 group-hover:text-white" />
                                                    )}
                                                    {(['application/vnd.oasis.opendocument.spreadsheet'].includes(item?.full_mime)) && (
                                                        <RiFileExcel2Fill className="h-8 w-8 inline group-hover:h-9 group-hover:w-9 group-hover:-rotate-3 transition-all duration-300 text-green-400 group-hover:text-white" />
                                                    )}
                                                    {(['application/vnd.oasis.opendocument.presentation'].includes(item?.full_mime)) && (
                                                        <RiFilePpt2Fill className="h-8 w-8 inline group-hover:h-9 group-hover:w-9 group-hover:-rotate-3 transition-all duration-300 text-red-400 group-hover:text-white" />
                                                    )}
                                                    {(['application/octet-stream'].includes(item?.full_mime)) && (
                                                        <RiFinderFill className="h-8 w-8 inline group-hover:h-9 group-hover:w-9 group-hover:-rotate-3 transition-all duration-300 text-slate-600 group-hover:text-white" />
                                                    )}
                                                    {(['application/zip', 'application/x-rar-compressed', 'application/x-7z-compressed', 'application/x-tar', 'archive'].includes(item?.full_mime)) && (
                                                        <RiFileZipFill className="h-8 w-8 inline group-hover:h-9 group-hover:w-9 group-hover:-rotate-3 transition-all duration-300 text-gray-500 group-hover:text-white" />
                                                    )}


                                                    {(!['image', 'image/jpeg', 'image/png', 'video', 'video/mp4', 'video/mkv', 'video/avi', 'application/zip', 'application/x-rar-compressed', 'application/x-7z-compressed', 'application/x-tar', 'text/plain', 'text/csv', 'application/pdf', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/octet-stream', 'archive', 'application/vnd.oasis.opendocument.text', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(item?.full_mime)) && (
                                                        <RiCollageLine className="h-8 w-8 inline group-hover:h-9 group-hover:w-9 group-hover:-rotate-3 transition-all duration-300 text-slate-600 group-hover:text-white" />
                                                    )}
                                                    {/* {item.full_mime} */}
                                                </>
                                            )}
                                        </div>
                                        <div
                                            className='grow'
                                            onDoubleClick={() => onItemOpen(item)}
                                            onClick={() => {
                                                if (isSelectedMode) {
                                                    onItemSelect(item)
                                                } else {
                                                    onItemClick(item)
                                                }
                                            }}
                                        >
                                            <div className="flex items-center gap-2 shrink">

                                                <div
                                                    className="font-semibold select-none line-clamp-1 text-[#ebbd18] transition-all duration-300">
                                                    {item?.name}
                                                    {item?.type === 'file' && (
                                                        <>
                                                            .{item?.extension}
                                                        </>
                                                    )}
                                                </div>

                                                <div className="ml-2 select-none">
                                                    {item?.publicity?.status === 'private' && (
                                                        <>
                                                            <LockClosedIcon className="h-3 w-3 inline text-white" />
                                                        </>
                                                    )}
                                                    {item?.publicity?.status === 'public' && (
                                                        <div
                                                            className='flex items-center gap-x-1 text-green-500 hover:text-white hover:bg-green-500 p-1 rounded transition-all duration-300'
                                                            onClick={() => {
                                                                navigator.clipboard.writeText(clientDomain() + '/sharer?_id=' + item?.slug);

                                                                SweetAlertToast('success', 'Tautan berhasil disalin', clientDomain() + '/sharer?_id=' + item?.slug)
                                                            }}
                                                        >
                                                            <ShareIcon className="h-3 w-3 inline" />
                                                            <div className='group-hover:opacity-100 opacity-0 transition-all duration-300'>
                                                                <div className='text-[10px]'>
                                                                    Salin Tautan
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-x-1 text-slate-50 select-none">
                                                {item.type === 'folder' && (
                                                    <div className="text-[10px]">
                                                        {item?.childs} Berkas
                                                    </div>
                                                )}
                                                {item.type === 'file' && (
                                                    <div className="text-[10px]">
                                                        {item?.size}
                                                    </div>
                                                )}

                                                <div className="flex items-center gap-x-0.5">
                                                    <CalendarIcon className="h-3 w-3 inline" />
                                                    <div className="text-[10px]">
                                                        {new Date(item?.updated_at).toLocaleDateString('id-ID', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric',
                                                        })}, &nbsp;
                                                        {/* clock only */}
                                                        {new Date(item?.updated_at).toLocaleTimeString('id-ID', {
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        })} WIB
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="self-end flex items-center gap-x-1 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-[#003a69]/70 p-1 rounded-full">
                                        {item.type === 'file' && (
                                            <Tippy
                                                content={`Buka ${item?.type === 'folder' ? 'Folder' : 'Berkas'}`}
                                            >
                                                <div
                                                    className="p-1.5 rounded-full flex items-center justify-center cursor-pointer hover:bg-lime-200 transition-all duration-300"
                                                    onClick={() => {
                                                        onItemOpen(item)
                                                    }}
                                                >
                                                    <EyeIcon className="h-4 w-4 text-lime-600 inline transition-all duration-300" />
                                                </div>
                                            </Tippy>
                                        )}

                                        <Tippy
                                            // content={item?.favorite ? 'Hapus dari Favorit' : 'Tambahkan ke Favorit'}
                                            content={`${item?.favorite ? 'Hapus dari' : 'Tambahkan ke'} Favorit`}
                                        >
                                            <div
                                                className="p-1.5 rounded-full flex items-center justify-center cursor-pointer hover:bg-pink-200 transition-all duration-300"
                                                onClick={() => {
                                                    onSetFavorite(item, !item?.favorite)
                                                }}
                                            >
                                                {item?.favorite ?
                                                    <StarIconSolid className={`h-4 w-4 text-pink-600 inline transition-all duration-300`} />
                                                    :
                                                    <StarIcon className={`h-4 w-4 text-pink-600 inline transition-all duration-300`} />
                                                }
                                            </div>
                                        </Tippy>

                                        <Tippy
                                            content="Bagikan"
                                        >
                                            <div
                                                className="p-1.5 rounded-full flex items-center justify-center cursor-pointer hover:bg-green-200 transition-all duration-300"
                                                onClick={() => {
                                                    onItemShare(item)
                                                }}
                                            >
                                                <ShareIcon className="h-4 w-4 text-green-600 inline transition-all duration-300" />
                                            </div>
                                        </Tippy>

                                        <Tippy content="Ganti Nama">
                                            <div
                                                className="p-1.5 rounded-full flex items-center justify-center cursor-pointer hover:bg-slate-600 transition-all duration-300"
                                                onClick={() => {
                                                    onItemEdit(item)
                                                }}
                                            >
                                                <PencilSquareIcon className="h-4 w-4 text-slate-100 inline transition-all duration-300" />
                                            </div>
                                        </Tippy>

                                        {item.type !== 'folder' && (
                                            <Tippy
                                                content={isDownloading ? 'Membatalkan Unduhan' : 'Unduh Berkas'}
                                            >
                                                <div
                                                    className="p-1.5 rounded-full flex items-center justify-center cursor-pointer hover:bg-cyan-200 transition-all duration-300"
                                                    onClick={() => {
                                                        isDownloading ? null : onItemDownload(item)
                                                    }}
                                                >
                                                    {isDownloading ? (
                                                        <StopCircleIcon className="animate-spin h-4 w-4 text-cyan-600 inline transition-all duration-300" />
                                                    ) : (
                                                        <ArchiveBoxArrowDownIcon className="h-4 w-4 text-cyan-600 inline transition-all duration-300" />
                                                    )}
                                                </div>
                                            </Tippy>
                                        )}

                                        <Tippy
                                            content="Hapus"
                                        >
                                            <div
                                                className="p-1.5 rounded-full flex items-center justify-center cursor-pointer hover:bg-red-200 transition-all duration-300"
                                                onClick={() => {
                                                    onItemDelete(item)
                                                }}
                                            >
                                                <TrashIcon className="h-4 w-4 text-red-600 inline transition-all duration-300" />
                                            </div>
                                        </Tippy>
                                    </div>
                                </div>
                                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
                                {/* Glow effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-[#ebbd18]/10 to-[#ebbd18]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded"></div>
                            </>
                        )}
                    </div>
                </ContextMenuTrigger>

                <ContextMenuContent className="w-52">
                    {item.type === 'file' && (
                        <ContextMenuItem>
                            <div
                                className=""
                                onClick={() => {
                                    onItemOpen(item)
                                }}
                            >
                                <EyeIcon className="h-4 w-4 text-lime-600 inline transition-all duration-300" />
                                <span className="ml-2">Buka {item?.type === 'folder' ? 'Folder' : 'Berkas'}</span>
                            </div>
                        </ContextMenuItem>
                    )}

                    <ContextMenuItem>
                        <div
                            className=""
                            onClick={() => {
                                onSetFavorite(item, !item?.favorite)
                            }}
                        >
                            {item?.favorite ?
                                <>
                                    <StarIconSolid className={`h-4 w-4 text-yellow-600 inline transition-all duration-300`} />
                                    <span className="ml-2">Hapus dari Favorit</span>
                                </>
                                :
                                <>
                                    <StarIcon className={`h-4 w-4 text-yellow-600 inline transition-all duration-300`} />
                                    <span className="ml-2">Tambahkan ke Favorit</span>
                                </>
                            }
                        </div>
                    </ContextMenuItem>

                    <ContextMenuItem>
                        <div
                            className=""
                            onClick={() => {
                                onItemShare(item)
                            }}
                        >
                            <ShareIcon className="h-4 w-4 text-green-600 inline transition-all duration-300" />
                            <span className="ml-2">Bagikan</span>
                        </div>
                    </ContextMenuItem>

                    <ContextMenuItem>
                        <div
                            className=""
                            onClick={() => {
                                onItemEdit(item)
                            }}
                        >
                            <PencilSquareIcon className="h-4 w-4 text-blue-600 inline transition-all duration-300" />
                            <span className="ml-2">Ganti Nama</span>
                        </div>
                    </ContextMenuItem>

                    {item.type !== 'folder' && (
                        <ContextMenuItem>
                            <div
                                className=""
                                onClick={() => {
                                    isDownloading ? null : onItemDownload(item)
                                }}
                            >
                                {isDownloading ? (
                                    <>
                                        <StopCircleIcon className="animate-spin h-4 w-4 text-cyan-600 inline transition-all duration-300" />
                                        <span className="ml-2">Sedang Mengunduh</span>
                                    </>
                                ) : (
                                    <>
                                        <ArchiveBoxArrowDownIcon className="h-4 w-4 text-cyan-600 inline transition-all duration-300" />
                                        <span className="ml-2">Mengunduh</span>
                                    </>
                                )}
                            </div>
                        </ContextMenuItem>
                    )}

                    <ContextMenuSeparator />

                    <ContextMenuItem>
                        <div
                            className=""
                            onClick={() => {
                                onItemDelete(item)
                            }}
                        >
                            <TrashIcon className="h-4 w-4 text-red-600 inline transition-all duration-300" />
                            <span className="ml-2">Hapus</span>
                        </div>
                    </ContextMenuItem>

                </ContextMenuContent>
            </ContextMenu >
        </>
    )
}

export default ItemCardList