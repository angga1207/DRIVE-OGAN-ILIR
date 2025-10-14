"use client";
import { getSearch } from "@/apis/apiResources";
import { Input } from "@headlessui/react"
import { ArchiveBoxIcon, CalendarIcon, DocumentChartBarIcon, DocumentIcon, DocumentTextIcon, FilmIcon, FolderIcon, InboxIcon, PhotoIcon } from "@heroicons/react/24/outline"
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import Tippy from "@tippyjs/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const SearchEngine = () => {
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);

    const Ref = useRef<any>(null);
    const router = useRouter();

    const [datas, setDatas] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event: any) => {
            if (Ref.current && !Ref.current.contains(event.target)) {
                setSearchOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [Ref]);

    const handleSearch = (e: any) => {
        setSearchLoading(true);
        setDatas([]);
        e.preventDefault();
        const query = e.target.value;

        getSearch(query).then((res) => {
            if (res.status === 'success') {
                setDatas(res.data);
                setSearchOpen(true);
            }

        }).finally(() => {
            setSearchLoading(false);
        });
    }

    return (
        <div className="relative w-full">
            <div className="relative flex items-center group">
                <div className="absolute w-8 h-full flex items-center justify-center pointer-events-none">
                    <MagnifyingGlassIcon className="w-5 h-5 text-white group-focus-within:text-[#003a69]" />
                </div>
                <Input
                    type="search"
                    name="query"
                    placeholder='Pencarian...'
                    autoComplete='off'
                    onKeyUp={(e) => {
                        if (e.key === 'Enter') {
                            handleSearch(e);
                        }
                    }}
                    onFocus={(e) => {
                        e.target.select();
                        if (e.target.value !== '') {
                            setSearchOpen(true);
                        }
                        if(e.target.value === ''){
                            setDatas([]);
                            setSearchOpen(false);
                        }
                    }}
                    className="border border-white focus:border-slate-400 rounded-xl text-white placeholder:text-white focus:bg-white focus:text-slate-800 px-2 py-1 pl-8 w-full outline-0 ring-0" />
            </div>

            {searchOpen && (
                <div
                    ref={Ref}
                    className="absolute w-full mt-1 z-10">
                    <div className="relative w-full max-h-[500px] overflow-y-auto bg-white rounded-xl shadow-lg border border-slate-400">
                        {searchLoading && (
                            <div className="p-4 text-center text-slate-400">
                                Memuat...
                            </div>
                        )}

                        {!searchLoading && datas.length === 0 && (
                            <div className="p-4 text-center text-slate-400">
                                Tidak ada hasil
                            </div>
                        )}

                        {!searchLoading && datas.length > 0 && (
                            <div className="w-full">

                                <div className="sticky top-0 bg-white border-b border-slate-300">
                                    <div className="px-4 py-2 text-slate-500 text-sm select-none">
                                        {datas.length} hasil ditemukan
                                    </div>
                                </div>

                                <div className="py-2 px-2">
                                    {datas.map((data: any, index: number) => (
                                        <div
                                            key={index}
                                            onClick={() => {
                                                if (data.type === 'folder') {
                                                    router.push(`/?_p=${data.slug}&ref=search`);
                                                    setSearchOpen(false);
                                                }
                                                if (data.type === 'file') {
                                                    router.push(`/?_p=${data.parent_slug}&ref=search&_f=${data.slug}`);
                                                    setSearchOpen(false);
                                                }
                                            }}
                                            className="px-4 py-2 rounded hover:bg-slate-200 flex items-center justify-between cursor-pointer group"
                                        >
                                            <div className="grow flex items-center gap-x-2 whitespace-nowrap overflow-hidden">

                                                <div
                                                    className="text-slate-500"
                                                >
                                                    {data.type === 'folder' ? (
                                                        <FolderIcon className="h-8 w-8 inline group-hover:h-9 group-hover:w-9 group-hover:-rotate-3 transition-all duration-300 text-blue-800" />
                                                    ) : (
                                                        <>
                                                            {(['image'].includes(data?.mime)) && (
                                                                <PhotoIcon className="h-8 w-8 inline group-hover:h-9 group-hover:w-9 group-hover:-rotate-3 transition-all duration-300" />
                                                            )}
                                                            {(['video'].includes(data?.mime)) && (
                                                                <FilmIcon className="h-8 w-8 inline group-hover:h-9 group-hover:w-9 group-hover:-rotate-3 transition-all duration-300" />
                                                            )}
                                                            {(['archive'].includes(data?.mime)) && (
                                                                <ArchiveBoxIcon className="h-8 w-8 inline group-hover:h-9 group-hover:w-9 group-hover:-rotate-3 transition-all duration-300" />
                                                            )}
                                                            {(['application'].includes(data?.mime)) && (
                                                                <InboxIcon className="h-8 w-8 inline group-hover:h-9 group-hover:w-9 group-hover:-rotate-3 transition-all duration-300" />
                                                            )}
                                                            {(['text'].includes(data?.mime)) && (
                                                                <DocumentTextIcon className="h-8 w-8 inline group-hover:h-9 group-hover:w-9 group-hover:-rotate-3 transition-all duration-300" />
                                                            )}
                                                            {(['document'].includes(data?.mime)) && (
                                                                <DocumentChartBarIcon className="h-8 w-8 inline group-hover:h-9 group-hover:w-9 group-hover:-rotate-3 transition-all duration-300" />
                                                            )}
                                                            {(['image', 'video', 'archive', 'application', 'text', 'document'].includes(data?.mime) === false) && (
                                                                <DocumentIcon className="h-8 w-8 inline group-hover:h-9 group-hover:w-9 group-hover:-rotate-3 transition-all duration-300" />
                                                            )}
                                                        </>
                                                    )}
                                                </div>

                                                <div
                                                    className='grow'
                                                >
                                                    <div className="flex items-center gap-2 shrink">
                                                        <div
                                                            title={data?.name}
                                                            className="font-semibold select-none line-clamp-1">
                                                            {data?.name}
                                                            {data?.type === 'file' && (
                                                                <>
                                                                    .{data?.extension}
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-x-1 text-slate-400 select-none">
                                                        {data.type === 'folder' && (
                                                            <div className="text-[10px]">
                                                                {data?.childs} Berkas
                                                            </div>
                                                        )}
                                                        {data.type === 'file' && (
                                                            <div className="text-[10px]">
                                                                {data?.size}
                                                            </div>
                                                        )}

                                                        <div className="flex items-center gap-x-0.5">
                                                            <CalendarIcon className="h-3 w-3 inline" />
                                                            <div className="text-[10px]">
                                                                {new Date(data?.updated_at).toLocaleDateString('id-ID', {
                                                                    year: 'numeric',
                                                                    month: 'long',
                                                                    day: 'numeric',
                                                                })}, &nbsp;
                                                                {/* clock only */}
                                                                {new Date(data?.updated_at).toLocaleTimeString('id-ID', {
                                                                    hour: '2-digit',
                                                                    minute: '2-digit',
                                                                })} WIB
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* <div className="font-semibold text-slate-800">{data.name}</div>
                                            <div className="text-sm text-slate-600">{data.type} &middot; {data.size}</div> */}
                                            </div>
                                            <div className="flex-none w-[100px] hidden xl:block">
                                                <Tippy
                                                    content={data?.parent_name}
                                                    placement="top-start"
                                                    arrow={false}
                                                    delay={300}
                                                >
                                                    <div className="flex items-center text-xs text-slate-400 select-none line-clamp-1 group-hover:underline">
                                                        <FolderIcon className="flex-none h-3 w-3 inline mr-1" />
                                                        <div className="truncate">
                                                            {data?.parent_name}
                                                        </div>
                                                    </div>
                                                </Tippy>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

        </div>
    )
}

export default SearchEngine