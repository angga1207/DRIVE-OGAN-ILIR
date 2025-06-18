"use client";
import { createUser, getUsers, updateUser, updateUserAccess } from "@/apis/apiUsers";
import { CogIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import ModalUser from "../Components/modalUser";
import Swal from "sweetalert2";

const SweetAlertConfirm = (title: any, text: any, confirmButtonText: any, cancelButtonText: any = null) => {
    return Swal.fire({
        title: title,
        text: text,
        icon: 'warning',
        showCancelButton: cancelButtonText ? true : false,
        // green confirm button
        confirmButtonColor: '#00a63e',
        cancelButtonColor: '#d33',
        confirmButtonText: confirmButtonText,
        cancelButtonText: cancelButtonText,
        // confirm button on right
        reverseButtons: true,
    })
}

// const SweetAlertToast = (icon: any, title: any, text: any) => {
//     return Swal.fire({
//         position: 'top-end',
//         icon: icon,
//         title: title,
//         text: text,
//         showConfirmButton: false,
//         timer: 5000,
//         timerProgressBar: true,
//         toast: true,
//     })
// }

const Page = () => {

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    });

    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalData, setTotalData] = useState(0);
    const [data, setData] = useState<any>([]);
    const [dataRaw, setDataRaw] = useState<any>([]);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [isCreate, setIsCreate] = useState(false);
    const [detailData, setDetailData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        if (isMounted) {
            setLoading(true);
            getUsers().then((res: any) => {
                if (res.status === "success") {
                    setDataRaw(res.data);
                    setTotalData(res.total);
                } else {
                    setData([]);
                    setTotalData(0);
                }
                setLoading(false);
            });
        }
    }, [isMounted]);

    useEffect(() => {
        setLoading(true);
        const filteredData = dataRaw.filter((item: any) => {
            return (
                item?.fullname?.toLowerCase().includes(search.toLowerCase())
            );
        });
        setTotalData(filteredData.length);
        setData(filteredData.slice((page - 1) * limit, page * limit));
        setLoading(false);
    }, [dataRaw, search, page, limit]);


    const handleUpdate = (data: any) => {
        setLoading(true);
        updateUser(data).then((res: any) => {
            if (res.status === "success") {
                getUsers().then((res: any) => {
                    if (res.status === "success") {
                        setDataRaw(res.data);
                        setTotalData(res.total);
                    } else {
                        setData([]);
                        setTotalData(0);
                    }
                });
            }
            SweetAlertConfirm(
                "Berhasil",
                "Data berhasil diubah",
                "Tutup",
            );
            setLoading(false);
            setDetailData(null);
            setModalOpen(false);
        });
    }

    const handleCreate = (data: any) => {
        setLoading(true);
        // create user
        createUser(data).then((res: any) => {
            if (res.status === "success") {
                getUsers().then((res: any) => {
                    if (res.status === "success") {
                        setDataRaw(res.data);
                        setTotalData(res.total);
                    } else {
                        setData([]);
                        setTotalData(0);
                    }
                });
            }
            SweetAlertConfirm(
                "Berhasil",
                "Data berhasil ditambahkan",
                "Tutup",
            );
            setLoading(false);
            setDetailData(null);
            setModalOpen(false);
        });
    }

    const handleChangeAccess = (id: any, access: any) => {
        setLoading(true);
        SweetAlertConfirm(
            "Konfirmasi",
            "Apakah anda yakin ingin mengubah akses pengguna ini?",
            "Ya",
            "Tidak"
        ).then((result) => {
            if (result.isConfirmed) {
                updateUserAccess(id, access).then((res: any) => {
                    if (res.status === "success") {
                        getUsers().then((res: any) => {
                            if (res.status === "success") {
                                setDataRaw(res.data);
                                setTotalData(res.total);
                            } else {
                                setData([]);
                                setTotalData(0);
                            }
                        });
                    }
                    SweetAlertConfirm(
                        "Berhasil",
                        "Akses pengguna berhasil diubah",
                        "Tutup",
                    );
                });
            }
            setLoading(true);
        });
    }

    return (
        <div className="w-full space-y-4">
            <div className="flex items-center justify-between gap-x-2">
                <div className="">
                    <input
                        type="search"
                        placeholder="Pencarian"
                        className="px-3 py-2 border border-slate-400 focus:border-slate-500 rounded-md focus:outline-none ring-0 outline-0"
                        defaultValue={search}
                        onClick={(e) => {
                            // select all text
                            e.currentTarget.select();
                            e.currentTarget.setSelectionRange(0, e.currentTarget.value.length);
                            e.currentTarget.focus();
                        }}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                    />
                </div>

                <div className="">
                    <button
                        type="button"
                        onClick={() => {
                            setModalOpen(true);
                            setIsCreate(true);
                            setDetailData(null);
                        }}
                        className="px-3 py-2 bg-blue-500 text-white rounded-md cursor-pointer select-none">
                        Tambah Pengguna
                    </button>
                </div>
            </div>

            <div className="w-full overflow-auto">
                <table className="w-full table-auto">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 border">
                                Nama Pengguna
                            </th>
                            <th className="px-4 py-2 border">
                                Tanggal pendaftaran
                            </th>
                            <th className="px-4 py-2 border">
                                Akses
                            </th>
                            <th className="px-4 py-2 border">
                                Kapasitas
                            </th>
                            <th className="px-4 py-2 border">
                                <div className="flex justify-center items-center">
                                    <CogIcon className="w-5 h-5 text-slate-500 text-center" />
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item: any, index: any) => (
                            <tr key={index} className="hover:bg-slate-100">
                                <td className="px-4 py-2 border">
                                    <div className="flex items-center gap-x-2">
                                        <div className="w-12 h-12 shrink-0 rounded-full bg-gray-200 flex justify-center items-center">
                                            {item.photo ? (
                                                <img
                                                    src={item.photo}
                                                    onError={(e) => {
                                                        // e.currentTarget.src = '/favicon.png';
                                                        e.currentTarget.src = '/logo-oi.webp';
                                                    }}
                                                    alt={item.fullname}
                                                    className="w-12 h-12 rounded-full object-contain p-1" />
                                            ) : (
                                                <div className="w-full h-full rounded-full bg-slate-500 flex justify-center items-center">
                                                    <span className="text-white text-sm font-bold">A</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-semibold">{item.fullname}</span>
                                            <span className="text-xs text-slate-500">{item.email}</span>
                                            <span className="text-xs text-slate-500">{item.phone}</span>
                                        </div>

                                        {item.googleIntegated && (
                                            <img src="/assets/images/google.png" className="w-3 h-3 inline-block" />
                                        )}
                                    </div>
                                </td>
                                <td className="px-4 py-2 border text-sm text-slate-500">
                                    {item.created_at ? (
                                        new Date(item.created_at).toLocaleString('id-ID', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric',
                                        })
                                    ) : (
                                        <div className="text-center">
                                            -
                                        </div>
                                    )}
                                </td>
                                <td className="px-4 py-2 border">
                                    <div className="flex items-center justify-center">
                                        {item?.access ? (
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    handleChangeAccess(item.id, item.access ? false : true);
                                                }}
                                                className="rounded px-2 py-1 text-xs bg-green-500 text-green-100 cursor-pointer whitespace-nowrap">
                                                Punya Akses
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    handleChangeAccess(item.id, item.access ? false : true);
                                                }}
                                                className="rounded px-2 py-1 text-xs bg-red-500 text-red-100 cursor-pointer whitespace-nowrap">
                                                Tidak Punya Akses
                                            </button>
                                        )}
                                    </div>
                                </td>
                                <td className="px-4 py-2 border">
                                    <div className="text-center text-sm text-slate-500">
                                        {item?.storage?.used} / {item?.storage?.total}
                                    </div>
                                </td>
                                <td className="px-4 py-2 border">
                                    <div className="flex justify-center items-center gap-x-2">
                                        <button
                                            className="px-3 py-1 bg-blue-500 text-white rounded-md cursor-pointer select-none text-sm flex items-center justify-center gap-x-1"
                                            onClick={() => {
                                                setDetailData(item);
                                                setModalOpen(true);
                                                setIsCreate(false);
                                            }}
                                        >
                                            <PencilSquareIcon className="w-4 h-4 inline-block" />
                                            Edit
                                        </button>
                                        {/* <button
                                            className="px-3 py-1 bg-red-500 text-white rounded-md cursor-pointer select-none">
                                            Hapus
                                        </button> */}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan={5} className="px-4 py-2 border">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-x-2">
                                        <select
                                            className="px-3 py-1 border border-slate-400 focus:border-slate-500 rounded-md focus:outline-none ring-0 outline-0"
                                            value={limit}
                                            onChange={(e) => {
                                                setLimit(parseInt(e.target.value));
                                                setPage(1);
                                            }}
                                        >
                                            <option value={10}>10</option>
                                            <option value={20}>20</option>
                                            <option value={50}>50</option>
                                            <option value={100}>100</option>
                                        </select>
                                        <div className="text-sm text-slate-500 border-x border-slate-300 px-2">
                                            {page} dari {Math.ceil(totalData / limit)} halaman
                                        </div>
                                        <div className="text-sm text-slate-500">
                                            Total : {totalData} data
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-x-2">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (page > 1) {
                                                    setPage(page - 1);
                                                }
                                            }}
                                            className="px-3 py-1 bg-gray-300 text-gray-700 rounded-md ring-0 outline-0 cursor-pointer"
                                        >
                                            Sebelumnya
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (page * limit < totalData) {
                                                    setPage(page + 1);
                                                }
                                            }}
                                            className="px-3 py-1 bg-gray-300 text-gray-700 rounded-md ring-0 outline-0 cursor-pointer"
                                        >
                                            Selanjutnya
                                        </button>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            <ModalUser
                isOpen={modalOpen}
                isCreate={isCreate}
                onClose={() => {
                    setModalOpen(false);
                    setDetailData(null);
                }}
                data={detailData}
                isLoading={isLoading}
                onSubmit={(data: any) => {
                    if (data?.inputType === 'update') {
                        handleUpdate(data);
                    } else if (data?.inputType === 'create') {
                        handleCreate(data);
                    }
                }}
            />
        </div>
    );
}
export default Page;