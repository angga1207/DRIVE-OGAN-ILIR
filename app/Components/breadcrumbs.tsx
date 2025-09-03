import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { ChevronDownIcon, FolderIcon, FolderPlusIcon, PencilSquareIcon, ShareIcon, TrashIcon } from '@heroicons/react/24/outline'
import Link from "next/link";

const Breadcrumbs = (
    {
        items,
        onItemClick,
        onItemEdit,
        onItemShare,
        onItemDelete,
        onMakeNewFolder
    }: {
        items: any
        onItemClick: (item: any) => void
        onItemEdit: (item: any) => void
        onItemShare: (item: any) => void
        onItemDelete: (item: any, callback: any) => void
        onMakeNewFolder: () => void
    }
) => {
    const currentPath = items.current

    return (
        <div className="flex flex-wrap space-x-4 bc items-center">
            <Link href={`/`} className="font-semibold hover:text-blue-500 flex gap-x-1 items-center transition-all duration-300">
                <FolderIcon className="h-5 w-5 inline" />
                Drive Saya
            </Link>
            {items?.paths?.length > 0 && (
                <>
                    {items?.paths?.length <= 1 ? (
                        <>
                            {items?.paths?.map((item: any, index: number) => (
                                <Link key={`bc-${index}`} href={`/?_p=${item?.slug}`} className="font-semibold hover:text-blue-500 flex gap-x-1 items-center transition-all duration-300">
                                    <FolderIcon className="h-5 w-5 inline" />
                                    {item?.name}
                                </Link>
                            ))}
                        </>
                    ) : (
                        <>

                            {/* first path */}
                            {items?.paths?.slice(0, 0).map((item: any, index: number) => (
                                <Link key={`bc-${index}`} href={`/?_p=${item?.slug}`} className="font-semibold hover:text-blue-500 flex gap-x-1 items-center transition-all duration-300">
                                    <FolderIcon className="h-5 w-5 inline" />
                                    {item?.name}
                                </Link>
                            ))}

                            {/* middle path */}

                            <div className="text-slate-500">...</div>

                            {/* last path */}
                            {items?.paths?.slice(-1).map((item: any, index: number) => (
                                <Link key={`bc-${index}`} href={`/?_p=${item?.slug}`} className="font-semibold hover:text-blue-500 flex gap-x-1 items-center transition-all duration-300">
                                    <FolderIcon className="h-5 w-5 inline" />
                                    {item?.name}
                                </Link>
                            ))}

                        </>
                    )}
                </>
            )}
            {currentPath && (
                <div>
                    <Menu>
                        <MenuButton className="font-semibold text-slate-500 flex gap-x-1 items-center transition-all duration-300 cursor-pointer select-none">
                            <FolderIcon className="h-5 w-5 inline" />
                            <span>
                                {currentPath?.name}
                            </span>
                            <ChevronDownIcon className="h-4 w-4 inline ms-1" />
                        </MenuButton>

                        <MenuItems
                            transition
                            anchor="bottom start"
                            className="w-52 origin-top-right rounded-lg border border-slate-200 bg-white p-1 text-sm/6 transition duration-100 ease-out [--anchor-gap:--spacing(1)] focus:outline-none data-closed:scale-95 data-closed:opacity-0 z-10"
                        >
                            <MenuItem>
                                <div className="flex items-center gap-x-4 hover:bg-gray-100 px-4 py-2 cursor-pointer select-none"
                                    onClick={() => onMakeNewFolder()}>
                                    <FolderPlusIcon className="h-5 w-5 text-gray-700" />
                                    <span className="text-sm text-gray-700">Buat Folder</span>
                                </div>
                            </MenuItem>
                            <MenuItem>
                                <div className="flex items-center gap-x-4 hover:bg-gray-100 px-4 py-2 cursor-pointer select-none"
                                    onClick={() => onItemEdit(currentPath)}>
                                    <PencilSquareIcon className="h-5 w-5 text-gray-700" />
                                    <span className="text-sm text-gray-700">Rename</span>
                                </div>
                            </MenuItem>
                            <MenuItem>
                                <div className="flex items-center gap-x-4 hover:bg-gray-100 px-4 py-2 cursor-pointer select-none"
                                    onClick={() => onItemShare(currentPath)}>
                                    <ShareIcon className="h-5 w-5 text-gray-700" />
                                    <span className="text-sm text-gray-700">Bagikan</span>
                                </div>
                            </MenuItem>
                            <div className="my-1 h-px bg-slate-200" />
                            <MenuItem>
                                <div className="flex items-center gap-x-4 hover:bg-gray-100 px-4 py-2 cursor-pointer select-none"
                                    onClick={() => onItemDelete(currentPath, (currentPath.parent_slug === 0 ? 'root' : currentPath.parent_slug))}>
                                    <TrashIcon className="h-5 w-5 text-red-700" />
                                    <span className="text-sm text-red-700">Hapus Folder</span>
                                </div>
                            </MenuItem>
                        </MenuItems>
                    </Menu>
                </div>
            )}
        </div>
    );
}

export default Breadcrumbs;