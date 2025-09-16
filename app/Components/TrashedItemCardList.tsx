import { clientDomain } from '@/apis/serverConfig';
import { FolderIcon, DocumentIcon, CalendarIcon, TrashIcon, PencilSquareIcon, ShareIcon, ArchiveBoxArrowDownIcon, EyeIcon, PhotoIcon, ArchiveBoxIcon, LockClosedIcon, StopCircleIcon, InboxIcon, FilmIcon, DocumentTextIcon, DocumentChartBarIcon, ArrowPathIcon } from '@heroicons/react/24/outline'
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

const TrashedItemCardList = (
    {
        item,
        onItemClick,
        onItemDelete,
        onItemOpen,
        onItemSelect,
        onItemRestore,
        selectedItems,
        isLoading,
        isError,
        isSelected,
        isSelectedMode,
    }: {
        item: any
        onItemClick: (item: any) => void
        onItemDelete: (item: any) => void
        onItemOpen: (item: any) => void
        onItemSelect: (item: any) => void
        onItemRestore: (item: any) => void
        selectedItems: Array<any>
        isLoading: boolean
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

    return (
        <>
            <div
                id={`item-${item?.slug}`}
                className={`relative card ${item?.type == 'folder' ? ' bg-blue-100/50 hover:bg-blue-100' : 'bg-white hover:bg-slate-100'} group cursor-pointer ${isSelected === true ? '!bg-green-100' : ''}`}

                aria-selected={isSelected}
            >
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
                                    {(['video'].includes(item?.mime)) && (
                                        <FilmIcon className="h-8 w-8 inline group-hover:h-9 group-hover:w-9 group-hover:-rotate-3 transition-all duration-300" />
                                    )}
                                    {(['archive'].includes(item?.mime)) && (
                                        <ArchiveBoxIcon className="h-8 w-8 inline group-hover:h-9 group-hover:w-9 group-hover:-rotate-3 transition-all duration-300" />
                                    )}
                                    {(['application'].includes(item?.mime)) && (
                                        <InboxIcon className="h-8 w-8 inline group-hover:h-9 group-hover:w-9 group-hover:-rotate-3 transition-all duration-300" />
                                    )}
                                    {(['text'].includes(item?.mime)) && (
                                        <DocumentTextIcon className="h-8 w-8 inline group-hover:h-9 group-hover:w-9 group-hover:-rotate-3 transition-all duration-300" />
                                    )}
                                    {(['document'].includes(item?.mime)) && (
                                        <DocumentChartBarIcon className="h-8 w-8 inline group-hover:h-9 group-hover:w-9 group-hover:-rotate-3 transition-all duration-300" />
                                    )}
                                    {(['image', 'video', 'archive', 'application', 'text', 'document'].includes(item?.mime) === false) && (
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
                            </div>
                            <div className="flex items-center gap-x-1 text-slate-400 select-none">
                                {/* {item.type === 'folder' && (
                                    <div className="text-[10px]">
                                        {item?.childs} Berkas
                                    </div>
                                )} */}
                                {item.type === 'file' && (
                                    <div className="text-[10px]">
                                        {item?.size}
                                    </div>
                                )}

                                <div className="flex items-center gap-x-0.5">
                                    <CalendarIcon className="h-3 w-3 inline" />
                                    <div className="text-[10px]">
                                        {new Date(item?.deleted_at).toLocaleDateString('id-ID', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}, &nbsp;
                                        {/* clock only */}
                                        {new Date(item?.deleted_at).toLocaleTimeString('id-ID', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })} WIB
                                    </div>
                                </div>

                                <div className="flex items-center gap-x-0.5">
                                    <FolderIcon className="h-3 w-3 inline" />
                                    <div className="text-[10px]">
                                        {item?.parent_name}
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
                            content="Pulihkan"
                        >
                            <div
                                className="p-1.5 rounded-full flex items-center justify-center cursor-pointer hover:bg-yellow-200 transition-all duration-300"
                                onClick={() => {
                                    onItemRestore(item)
                                }}
                            >
                                <ArrowPathIcon className="h-4 w-4 text-yellow-600 inline transition-all duration-300" />
                            </div>
                        </Tippy>

                        <Tippy
                            content="Hapus Permanen"
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
            </div>
        </>
    )
}

export default TrashedItemCardList