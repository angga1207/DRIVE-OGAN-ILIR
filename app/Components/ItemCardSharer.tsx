import { ArchiveBoxArrowDownIcon, CalendarIcon, EyeIcon, FolderIcon, StopCircleIcon } from "@heroicons/react/24/outline"
import Tippy from "@tippyjs/react"
import 'tippy.js/dist/tippy.css';
import { RiCollageLine, RiFileExcel2Fill, RiFileImageFill, RiFileList3Fill, RiFilePdf2Fill, RiFilePpt2Fill, RiFileWord2Fill, RiFileZipFill, RiFilmFill, RiFinderFill } from "react-icons/ri";

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
                <div className='grow flex items-center gap-x-2 max-w-full'>
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
                                {(['image', 'image/jpeg', 'image/png'].includes(item?.full_mime)) && (
                                    <RiFileImageFill className="h-8 w-8 inline group-hover:h-9 group-hover:w-9 group-hover:-rotate-3 transition-all duration-300 text-purple-800" />
                                )}
                                {(['video', 'video/mp4', 'video/mkv', 'video/avi'].includes(item?.full_mime)) && (
                                    <RiFilmFill className="h-8 w-8 inline group-hover:h-9 group-hover:w-9 group-hover:-rotate-3 transition-all duration-300 text-red-800" />
                                )}
                                {(['text/plain', 'text/csv'].includes(item?.full_mime)) && (
                                    <RiFileList3Fill className="h-8 w-8 inline group-hover:h-9 group-hover:w-9 group-hover:-rotate-3 transition-all duration-300 text-green-800" />
                                )}
                                {(['application/pdf'].includes(item?.full_mime)) && (
                                    <RiFilePdf2Fill className="h-8 w-8 inline group-hover:h-9 group-hover:w-9 group-hover:-rotate-3 transition-all duration-300 text-red-600" />
                                )}
                                {(['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'].includes(item?.full_mime)) && (
                                    <RiFileExcel2Fill className="h-8 w-8 inline group-hover:h-9 group-hover:w-9 group-hover:-rotate-3 transition-all duration-300 text-green-600" />
                                )}
                                {(['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(item?.full_mime)) && (
                                    <RiFileWord2Fill className="h-8 w-8 inline group-hover:h-9 group-hover:w-9 group-hover:-rotate-3 transition-all duration-300 text-blue-600" />
                                )}
                                {(['application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'].includes(item?.full_mime)) && (
                                    <RiFilePpt2Fill className="h-8 w-8 inline group-hover:h-9 group-hover:w-9 group-hover:-rotate-3 transition-all duration-300 text-red-500" />
                                )}
                                {(['application/vnd.oasis.opendocument.text'].includes(item?.full_mime)) && (
                                    <RiFileWord2Fill className="h-8 w-8 inline group-hover:h-9 group-hover:w-9 group-hover:-rotate-3 transition-all duration-300 text-green-500" />
                                )}
                                {(['application/vnd.oasis.opendocument.spreadsheet'].includes(item?.full_mime)) && (
                                    <RiFileExcel2Fill className="h-8 w-8 inline group-hover:h-9 group-hover:w-9 group-hover:-rotate-3 transition-all duration-300 text-green-400" />
                                )}
                                {(['application/vnd.oasis.opendocument.presentation'].includes(item?.full_mime)) && (
                                    <RiFilePpt2Fill className="h-8 w-8 inline group-hover:h-9 group-hover:w-9 group-hover:-rotate-3 transition-all duration-300 text-red-400" />
                                )}
                                {(['application/octet-stream'].includes(item?.full_mime)) && (
                                    <RiFinderFill className="h-8 w-8 inline group-hover:h-9 group-hover:w-9 group-hover:-rotate-3 transition-all duration-300 text-slate-600" />
                                )}
                                {(['application/zip', 'application/x-rar-compressed', 'application/x-7z-compressed', 'application/x-tar', 'archive'].includes(item?.full_mime)) && (
                                    <RiFileZipFill className="h-8 w-8 inline group-hover:h-9 group-hover:w-9 group-hover:-rotate-3 transition-all duration-300 text-gray-500" />
                                )}


                                {(!['image', 'image/jpeg', 'image/png', 'video', 'video/mp4', 'video/mkv', 'video/avi', 'application/zip', 'application/x-rar-compressed', 'application/x-7z-compressed', 'application/x-tar', 'text/plain', 'text/csv', 'application/pdf', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/octet-stream', 'archive', 'application/vnd.oasis.opendocument.text', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(item?.full_mime)) && (
                                    <RiCollageLine className="h-8 w-8 inline group-hover:h-9 group-hover:w-9 group-hover:-rotate-3 transition-all duration-300 text-slate-600" />
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
                                className="font-semibold select-none line-clamp-1 text-[#003a69] transition-all duration-300">
                                <div className='w-full line-clamp-1'>
                                    {item?.name}
                                    {item?.type === 'file' && (
                                        <>
                                            .{item?.extension}
                                        </>
                                    )}
                                </div>
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
                <div className="self-center xl:self-end flex items-center gap-x-1 xl:opacity-0 group-hover:opacity-100 transition-all duration-300 bg-[#fff]/70 p-1 rounded-full mt-4 xl:mt-0">

                    <Tippy
                        content={item?.author?.fullname}
                    >
                        <div
                            className="p-1.5 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-all duration-300"
                            title={item?.author?.fullname}
                        >
                            <div className="h-4 w-4 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center font-semibold text-xs select-none">
                                <img src={item?.author?.photo ? item?.author?.photo : '/favicon.png'} alt={item?.author?.fullname} className="h-4 w-4 rounded-full" />
                            </div>
                        </div>
                    </Tippy>

                    {item.type === 'file' && (
                        <>
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
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
export default ItemCardSharer;