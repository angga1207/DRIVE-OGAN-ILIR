import { clientDomain } from '@/apis/serverConfig';
import { FolderIcon, DocumentIcon, CalendarIcon, TrashIcon, PencilSquareIcon, ShareIcon, ArchiveBoxArrowDownIcon, EyeIcon, PhotoIcon, ArchiveBoxIcon, LockClosedIcon, StopCircleIcon, ChevronDownIcon, FolderPlusIcon, EllipsisVerticalIcon, CheckIcon, FilmIcon, InboxIcon, DocumentTextIcon, DocumentChartBarIcon } from '@heroicons/react/24/outline'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { useEffect, useRef, useState } from 'react';
import Swal from 'sweetalert2';
import 'tippy.js/dist/tippy.css';
import Tippy from '@tippyjs/react';


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

const ItemCardGrid = (
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
                id={`item-${item?.slug}`}
                className={`relative card ${item?.type == 'folder' ? ' bg-blue-100/50 hover:bg-blue-100' : 'bg-white hover:bg-slate-100'} group cursor-pointer ${isSelected === true ? '!bg-green-100' : ''} ${(isDragging && isSelected) ? 'opacity-50' : ''}${(isDragging) ? 'opacity-50' : ''}`}

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

                // on right click
                onContextMenu={(e) => {
                    e.preventDefault();
                    const menu = document.getElementById(`context-menu-${item.slug}`);
                    if (menu) {
                        menu.click();
                    }
                }}
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
                    <>
                        <div className="flex items-center justify-between gap w-full">
                            <div
                                onDoubleClick={() => {
                                    if (!isSelectedMode) {
                                        onItemOpen(item)
                                    }
                                }}
                                onClick={() => {
                                    if (isSelectedMode) {
                                        onItemSelect(item)
                                    } else {
                                        // onItemOpen(item)
                                    }
                                }}
                                className="shrink w-[calc(100%-20px)] flex items-center gap-2">
                                {isSelectedMode && (
                                    <div className="">
                                        <input
                                            type="checkbox"
                                            className="h-3.5 w-3.5 rounded-full border-0 border-gray-200 text-indigo-600 focus:ring-indigo-500"
                                            checked={selectedItems?.find((i: any) => i.id == item.id) ? true : false}
                                            readOnly={true}
                                        // onChange={() => onItemSelect(item)}
                                        />
                                    </div>
                                )}

                                <div
                                    className="flex-none"
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

                                <Tippy
                                    content={item?.name + (item?.type === 'file' ? `.${item?.extension}` : '')}
                                >
                                    <div
                                        title={item?.name}
                                        className="font-semibold select-none truncate">
                                        {item?.name}
                                        {item?.type === 'file' && (
                                            <>
                                                .{item?.extension}
                                            </>
                                        )}
                                    </div>
                                </Tippy>
                            </div>
                            <div className="flex-none !w-[20px] relative">
                                <Menu>
                                    <MenuButton
                                        id={`context-menu-${item.slug}`}
                                        className="rounded-full p-1 cursor-pointer group hover:bg-slate-700 text-slate-900 hover:text-white transition-all duration-300 ring-0 outline-none focus:ring-0">
                                        <EllipsisVerticalIcon className="size-5" />
                                    </MenuButton>

                                    <MenuItems
                                        transition
                                        anchor="bottom end"
                                        // anchor on mouse position
                                        // position="mouse"

                                        className="w-52 origin-top-right rounded-lg border border-slate-200 bg-white p-1 text-sm/6 transition duration-100 ease-out [--anchor-gap:--spacing(1)] focus:outline-none data-closed:scale-95 data-closed:opacity-0 z-10"
                                    >
                                        <MenuItem>
                                            <div
                                                onClick={() => {
                                                    onItemSelect(item)
                                                }}
                                                className="flex items-center gap-x-4 hover:bg-gray-100 px-4 py-2 cursor-pointer select-none">
                                                <CheckIcon className="h-5 w-5 text-gray-700" />
                                                <span className="text-sm text-gray-700">Pilih</span>
                                            </div>
                                        </MenuItem>

                                        {item.type === 'file' && (
                                            <MenuItem>
                                                <div
                                                    onClick={() => {
                                                        onItemOpen(item)
                                                    }}
                                                    className="flex items-center gap-x-4 hover:bg-gray-100 px-4 py-2 cursor-pointer select-none">
                                                    <EyeIcon className="h-5 w-5 text-gray-700" />
                                                    <span className="text-sm text-gray-700">Buka {item?.type == 'folder' ? 'Folder' : 'Berkas'}</span>
                                                </div>
                                            </MenuItem>
                                        )}
                                        <MenuItem>
                                            <div
                                                onClick={() => {
                                                    onItemEdit(item)
                                                }}
                                                className="flex items-center gap-x-4 hover:bg-gray-100 px-4 py-2 cursor-pointer select-none">
                                                <PencilSquareIcon className="h-5 w-5 text-gray-700" />
                                                <span className="text-sm text-gray-700">Ganti Nama</span>
                                            </div>
                                        </MenuItem>
                                        <MenuItem>
                                            <div
                                                onClick={() => {
                                                    onItemShare(item)
                                                }}
                                                className="flex items-center gap-x-4 hover:bg-gray-100 px-4 py-2 cursor-pointer select-none">
                                                <ShareIcon className="h-5 w-5 text-gray-700" />
                                                <span className="text-sm text-gray-700">Bagikan</span>
                                            </div>
                                        </MenuItem>

                                        {item.type === 'file' && (
                                            <MenuItem>
                                                <div
                                                    onClick={() => {
                                                        isDownloading ? null : onItemDownload(item)
                                                    }}
                                                    className="flex items-center gap-x-4 hover:bg-gray-100 px-4 py-2 cursor-pointer select-none">

                                                    {isDownloading ? (
                                                        <StopCircleIcon className="animate-spin h-4 w-4 text-gray-600 inline transition-all duration-300" />
                                                    ) : (
                                                        <>
                                                            <ArchiveBoxArrowDownIcon className="h-5 w-5 text-gray-700" />
                                                            <span className="text-sm text-gray-700">Unduh</span>
                                                        </>
                                                    )}
                                                </div>
                                            </MenuItem>
                                        )}

                                        <div className="my-1 h-px bg-slate-200" />
                                        <MenuItem>
                                            <div
                                                onClick={() => {
                                                    onItemDelete(item)
                                                }}
                                                className="flex items-center gap-x-4 hover:bg-gray-100 px-4 py-2 cursor-pointer select-none">
                                                <TrashIcon className="h-5 w-5 text-red-700" />
                                                <span className="text-sm text-red-700">Hapus</span>
                                            </div>
                                        </MenuItem>
                                    </MenuItems>
                                </Menu>
                            </div>
                        </div>

                        {item.type === 'file' && (
                            <div
                                onDoubleClick={() => {
                                    if (!isSelectedMode) {
                                        onItemOpen(item)
                                    }
                                }}
                                onClick={() => {
                                    if (isSelectedMode) {
                                        onItemSelect(item)
                                    } else {
                                        // onItemOpen(item)
                                    }
                                }}
                                className='bg-white w-full h-[200px] rounded mt-2'>

                                {item?.sv_in == 1 && (
                                    <embed src={`https://drive.google.com/file/d/${item?.path}/preview?toolbar=0&navpanes=0&scrollbar=0`}
                                        className="w-full h-full" />
                                )}


                                {item?.sv_in == 2 && (
                                    <div className="w-full h-full">
                                        {(['image'].includes(item?.mime)) && (
                                            <img src={item?.path}
                                                className="w-full h-full object-contain" />
                                        )}
                                        {(['video'].includes(item?.mime)) && (
                                            <video src={item?.path}
                                                className="w-full h-full object-contain" controls></video>
                                        )}
                                        {(['audio'].includes(item?.mime)) && (
                                            <audio src={item?.path}
                                                className="w-full h-full" controls></audio>
                                        )}


                                        {['pdf'].includes(item?.extension) && (
                                            <iframe src={`${item?.path}`}
                                                className="w-full h-full"></iframe>
                                        )}

                                        {['ppt', 'pptx'].includes(item?.extension) && (
                                            <iframe src={`https://view.officeapps.live.com/op/embed.aspx?src=${item.path}`}
                                                className="w-full h-full"></iframe>
                                        )}

                                        {['csv', 'xls', 'xlsx'].includes(item?.extension) && (
                                            <iframe src={`https://view.officeapps.live.com/op/embed.aspx?src=${item.path}`}
                                                className="w-full h-full"></iframe>
                                        )}

                                        {['doc', 'docx'].includes(item?.extension) && (
                                            <iframe src={`https://view.officeapps.live.com/op/embed.aspx?src=${item.path}`}
                                                className="w-full h-full"></iframe>
                                        )}

                                        {['zip', 'rar', '7z', 'tar', 'gz', 'bz2', 'html', 'php', 'css', 'js', 'json'].includes(item?.extension) && (
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
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    )
}

export default ItemCardGrid