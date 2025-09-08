import { clientDomain } from '@/apis/serverConfig';
import { FolderIcon, DocumentIcon, CalendarIcon, TrashIcon, PencilSquareIcon, ShareIcon, ArchiveBoxArrowDownIcon, EyeIcon, PhotoIcon, ArchiveBoxIcon, LockClosedIcon, StopCircleIcon } from '@heroicons/react/24/outline'
import Tippy from '@tippyjs/react';
import { useEffect, useRef, useState } from 'react';
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
        onDragging(true)
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
            <div
                className={`relative card ${item?.type == 'folder' ? ' bg-blue-100/50 hover:bg-blue-100' : 'bg-white hover:bg-slate-100'} group cursor-pointer ${(isDragging && isSelected) ? 'opacity-50' : ''}${(isDragging) ? 'opacity-50' : ''}`}

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
                    <div className="absolute top-0 left-0 h-full w-full bg-slate-200/50 z-1 select-none">
                        <div className="w-full h-full flex items-center justify-center animate-pulse bg-blue-200 text-blue-800 font-semibold text-lg">
                            <StopCircleIcon className="h-8 w-8 animate-spin" />
                            <div className="text-blue-800 font-semibold text-lg">
                                {item?.type === 'folder' ? 'Membuka Folder...' : 'Mengunduh Berkas...'}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-x-5">
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
                                    <FolderIcon className="h-8 w-8 inline group-hover:h-9 group-hover:w-9 group-hover:-rotate-3 transition-all duration-300 text-blue-800" />
                                ) : (
                                    <>
                                        {(['image'].includes(item?.mime)) && (
                                            <PhotoIcon className="h-8 w-8 inline group-hover:h-9 group-hover:w-9 group-hover:-rotate-3 transition-all duration-300" />
                                        )}
                                        {(['archive'].includes(item?.mime)) && (
                                            <ArchiveBoxIcon className="h-8 w-8 inline group-hover:h-9 group-hover:w-9 group-hover:-rotate-3 transition-all duration-300" />
                                        )}
                                        {(['image', 'archive'].includes(item?.mime) === false) && (
                                            <DocumentIcon className="h-8 w-8 inline group-hover:h-9 group-hover:w-9 group-hover:-rotate-3 transition-all duration-300" />
                                        )}
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
                                        title={item?.name}
                                        className="font-semibold select-none line-clamp-1">
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
                                                <LockClosedIcon className="h-3 w-3 inline text-slate-500" />
                                            </>
                                        )}
                                        {item?.publicity?.status === 'public' && (
                                            <div
                                                className='flex items-center gap-x-1 text-green-500 hover:text-green-600 hover:bg-green-200 p-1 rounded transition-all duration-300'
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
                                <div className="flex items-center gap-x-1 text-slate-400 select-none">
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
                        <div className="self-end flex items-center gap-x-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
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
                                    className="p-1.5 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-200 transition-all duration-300"
                                    onClick={() => {
                                        onItemEdit(item)
                                    }}
                                >
                                    <PencilSquareIcon className="h-4 w-4 text-blue-600 inline transition-all duration-300" />
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
                )}
            </div>
        </>
    )
}

export default ItemCardList