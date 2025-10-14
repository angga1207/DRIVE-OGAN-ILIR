import { ArrowPathIcon, ChevronDoubleDownIcon, ChevronDoubleRightIcon } from "@heroicons/react/24/outline";
import { useEffect, useRef } from "react";

const QueueList = (
    {
        datas,
        isShow,
        onClose,
        onOpen,
        onReset,
    }: {
        datas: any;
        isShow: boolean;
        onClose: () => void;
        onOpen: () => void;
        onReset: () => void;
    }
) => {
    const __isoFileSize = (bytes: number) => {
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes == 0) return '0 Byte';
        const i = parseInt(String(Math.floor(Math.log(bytes) / Math.log(1024))));
        return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i];
    }

    const ref = useRef<HTMLDivElement>(null);
    const handleClickOutside = (event: MouseEvent) => {
        if (ref.current && !ref.current.contains(event.target as Node)) {
            onClose();
        }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
            onClose();
        }
    }

    useEffect(() => {
        if (isShow) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleKeyDown);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        }
    }, [isShow]);

    return (
        <>
            {isShow && (
                <div
                    ref={ref}
                    className="fixed bottom-2 right-0 w-[300px] lg:w-[30vw] h-[200px] rounded-b-xl bg-white shadow-xl group z-10">
                    <div
                        className="absolute top-0 left-0 w-10 h-10 text-white flex items-center justify-center cursor-pointer opacity-75 lg:opacity-0 group-hover:opacity-100 transition-all duration-300"
                        onClick={() => {
                            onClose();
                        }}
                    >
                        <ChevronDoubleDownIcon className="h-5 w-5 inline" />
                    </div>

                    {datas.length > 0 && (
                        <div
                            className="absolute top-0 left-10 w-10 h-10 text-white flex items-center justify-center cursor-pointer opacity-75 lg:opacity-0 group-hover:opacity-100 transition-all duration-300"
                            onClick={() => {
                                onReset();
                            }}
                        >
                            <ArrowPathIcon className="h-5 w-5 inline" />
                        </div>
                    )}

                    <div className="font-bold text-sm bg-[#003a69] text-white flex items-center justify-center mb-2 border-b border-slate-200 pb-2 px-4 py-2 rounded-t-xl">
                        <div className="text-center">
                            Daftar Antrian Unggah
                        </div>
                    </div>
                    <div className="space-y-2 divide-y divide-slate-200 w-full hs-[calc(100vh-80px)] h-[150px] overflow-y-auto px-4 py-2">

                        {datas?.leaves?.length == 0 && (
                            <div className="py-3">
                                <div className="text-xs text-slate-500">
                                    Tidak ada antrian
                                </div>
                            </div>
                        )}

                        {datas?.map((item: any, index: number) => (
                            <div key={`queue-${index}`} className="py-3 select-none">
                                <div className="text-xs text-slate-500 flex items-center gap-x-1">
                                    <div className="font-bold">
                                        {/* {item?.id}. */}
                                        {index + 1}.
                                    </div>
                                    <div className="truncate" title={item?.name}>
                                        {item?.name}
                                    </div>
                                </div>
                                <div className="flex items-center gap-x-1 mt-1">
                                    <div className="text-slate-400 text-xs">
                                        {__isoFileSize(item?.size)}
                                    </div>
                                    {item?.progress >= 100 && (
                                        <div className="text-green-500 text-xs">
                                            - Selesai
                                        </div>
                                    )}
                                </div>
                                <div className="mt-1">
                                    <div className="w-full bg-gray-200 rounded-full h-1">
                                        <div
                                            className={`${item?.progress >= 100 ? 'bg-green-600' : 'bg-blue-600'} h-full rounded-full`}
                                            style={{
                                                width: `${item?.progress}%`,
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        ))}

                    </div>
                </div>
            )}

            {isShow == false && (
                <div className="fixed bottom-20 right-0">
                    <div
                        className="absolute top-3 -left-10 w-10 h-10 rounded-l-lg bg-[#003a69] text-white border border-r-0 border-white shadow-sm flex items-center justify-center cursor-pointer opacity-50 hover:opacity-100 transition-all duration-300"
                        onClick={() => {
                            onOpen();
                        }}
                    >
                        <ChevronDoubleDownIcon className="h-5 w-5 inline rotate-180" />
                    </div>
                </div>
            )}
        </>
    );
}

export default QueueList;