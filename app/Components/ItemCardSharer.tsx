import { ArchiveBoxArrowDownIcon, ArchiveBoxIcon, CalendarIcon, DocumentIcon, EyeIcon, FolderIcon, LockClosedIcon, PencilSquareIcon, PhotoIcon, ShareIcon, StopCircleIcon } from "@heroicons/react/24/outline"

const ItemCardSharer = (
    {
        item,
        onItemClick,
        onItemDownload,
        onItemOpen,
        onItemSelect,
        selectedItems,
        isLoading,
        isDownloading,
        isError,
        isSelected,
        isSelectedMode,
    }: {
        item: any
        onItemClick: (item: any) => void
        onItemDownload: (item: any) => void
        onItemOpen: (item: any) => void
        onItemSelect: (item: any) => void
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
    if (!item) {
        return (
            <div className="card text-red-500 select-none">
                Item not found
            </div>
        )
    }
    return (
        <div
            className={`relative card ${item?.type == 'folder' ? ' bg-blue-50/50 hover:bg-blue-100' : 'bg-white hover:bg-slate-100'} group cursor-pointer`}>

            {isDownloading && (
                <div className="absolute top-0 left-0 h-full w-full bg-slate-200/50 z-1 select-none">
                    <div className="w-full h-full flex items-center justify-center animate-pulse bg-blue-200 text-blue-800 font-semibold text-lg">
                        <StopCircleIcon className="h-8 w-8 animate-spin" />
                        <div className="text-blue-800 font-semibold text-lg">
                            {item?.type === 'folder' ? 'Membuka Folder...' : 'Mengunduh Berkas...'}
                        </div>
                    </div>
                </div>
            )}

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-x-5">
                <div className='grow flex items-center gap-x-2'>
                    {/* <div className="">
                        <input
                            type="checkbox"
                            className="h-3.5 w-3.5 rounded-full border-0 border-gray-200 text-indigo-600 focus:ring-indigo-500"
                            checked={selectedItems?.includes(item?.id)}
                            onChange={() => onItemSelect(item)}
                        />
                    </div> */}
                    <div
                        className="text-slate-500"
                        onDoubleClick={() => onItemOpen(item)}
                        onClick={() => {
                            if (isSelectedMode) {
                                onItemSelect(item)
                            } else {
                                onItemClick(item)
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
                    <div className="self-end flex items-center gap-x-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        {item.type === 'file' && (
                            <div
                                className="p-1.5 rounded-full flex items-center justify-center cursor-pointer hover:bg-lime-200 transition-all duration-300"
                                onClick={() => {
                                    onItemOpen(item)
                                }}
                            >
                                <EyeIcon className="h-4 w-4 text-lime-600 inline transition-all duration-300" />
                            </div>
                        )}

                        {item.type !== 'folder' && (
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
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
export default ItemCardSharer;