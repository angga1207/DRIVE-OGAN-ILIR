import { FolderIcon } from '@heroicons/react/24/outline'
import Link from "next/link";

const Breadcrumbs = (
    {
        items,
        onItemClick,
    }: {
        items: any
        onItemClick: (item: any) => void
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
                    {items?.paths?.length <= 3 ? (
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
                            {items?.paths?.slice(0, 1).map((item: any, index: number) => (
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
                <div className="font-semibold text-slate-500 flex gap-x-1 items-center transition-all duration-300 cursor-pointer select-none">
                    <FolderIcon className="h-5 w-5 inline" />
                    {currentPath?.name}
                </div>
            )}
        </div>
    );
}

export default Breadcrumbs;