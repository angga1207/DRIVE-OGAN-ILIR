"use client";
import { createUser, deleteUser, getUsers, updateUser, updateUserAccess } from "@/apis/apiUsers";
import { CogIcon, EnvelopeIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import ModalUser from "../Components/modalUser";
import Swal from "sweetalert2";
import 'tippy.js/dist/tippy.css';
import Tippy from "@tippyjs/react";
import { UserCircle } from "lucide-react";
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa6";

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
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [isCreate, setIsCreate] = useState(false);
    const [detailData, setDetailData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [sortBy, setSortBy] = useState('id');
    const [sortDirection, setSortDirection] = useState('desc');

    const [dataCounts, setDataCounts] = useState({
        totalUsers: 0,
        semestaUsers: 0,
        googleUsers: 0,
        accessedUsers: 0,
        unaccessedUsers: 0,
        googleAndSemestaUsers: 0,
        noIntegratedUsers: 0,
    });

    const _getData = () => {
        setLoading(true);
        getUsers(search, page, limit, sortBy, sortDirection).then((res: any) => {
            if (res.status === "success") {
                setTotalData(res.data.total);
                setData(res.data.data);
                setPage(res.data.current_page);
                if (res.data.per_page != limit) {
                    setLimit(res.data.per_page);
                }

                setDataCounts({
                    totalUsers: res.data.total,
                    semestaUsers: res.data.semesta_users_count,
                    googleUsers: res.data.google_users_count,
                    accessedUsers: res.data.accessed_users_count,
                    unaccessedUsers: res.data.unaccessed_users_count,
                    googleAndSemestaUsers: res.data.google_and_semesta_users_count,
                    noIntegratedUsers: res.data.no_integrated_users_count,
                });
            } else {
                setData([]);
                setTotalData(0);
            }
            setLoading(false);
        });
    }

    useEffect(() => {
        if (isMounted) {
            setLoading(true);
            _getData();
        }
    }, [isMounted]);

    const handleSearch = () => {
        _getData();
        setPage(1);
    }

    useEffect(() => {
        if (isMounted) {
            _getData();
        }
    }, [page, limit, sortBy, sortDirection]);

    const handleUpdate = (data: any) => {
        setLoading(true);
        updateUser(data).then((res: any) => {
            if (res.status === "success") {
                _getData();
                SweetAlertConfirm(
                    "Berhasil",
                    "Data berhasil diubah",
                    "Tutup",
                );
            } else {
                SweetAlertConfirm(
                    "Gagal",
                    res.message || "Data gagal diubah",
                    "Tutup",
                );
            }
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
                _getData();
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
                        _getData();
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

    const confirmDelete = (id: any) => {
        setLoading(true);
        SweetAlertConfirm(
            "Konfirmasi",
            "Apakah anda yakin ingin menghapus pengguna ini?",
            "Ya, Hapus",
            "Tidak"
        ).then((result) => {
            if (result.isConfirmed) {
                deleteUser(id).then((res: any) => {
                    if (res.status === "success") {
                        _getData();
                    }
                    SweetAlertConfirm(
                        "Berhasil",
                        "Pengguna berhasil dihapus",
                        "Tutup",
                    );
                });
            }
            setLoading(true);
        });
    }

    return (
        <div className="w-full xl:max-w-7xl p-8 xl:px-0 xl:py-4 mx-auto space-y-4">
            <div className="flex items-center justify-between gap-x-2">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSearch();
                    }}
                    className="flex items-center gap-x-2">
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
                            setSearch(e.currentTarget.value);
                        }} />
                </form>

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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-linear-to-br from-blue-800 to-blue-400 rounded-md shadow-md border border-blue-300 text-white text-center">
                    <div className="text-[50px] font-bold mb-1">
                        {dataCounts.totalUsers}
                    </div>
                    <div className="text-sm font-semibold">Total Pengguna</div>
                </div>
                <div className="p-4 bg-linear-to-br from-indigo-800 to-indigo-400 rounded-md shadow-md border border-indigo-300 text-white text-center">
                    <div className="text-[50px] font-bold mb-1">
                        {dataCounts.semestaUsers}
                    </div>
                    <div className="text-sm font-semibold">Pengguna Terintegrasi Semesta</div>
                </div>
                <div className="p-4 bg-linear-to-br from-orange-800 to-orange-400 rounded-md shadow-md border border-orange-300 text-white text-center">
                    <div className="text-[50px] font-bold mb-1">
                        {dataCounts.googleUsers}
                    </div>
                    <div className="text-sm font-semibold">Pengguna Terintegrasi Google</div>
                </div>
                <div className="p-4 bg-linear-to-br from-blue-800 to-blue-400 rounded-md shadow-md border border-blue-300 text-white text-center">
                    <div className="text-[50px] font-bold mb-1">
                        {dataCounts.googleAndSemestaUsers}
                    </div>
                    <div className="text-sm font-semibold">Terintegrasi Google & Semesta</div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-linear-to-br from-slate-800 to-slate-400 rounded-md shadow-md border border-slate-300 text-white text-center">
                    <div className="text-[50px] font-bold mb-1">
                        {dataCounts.noIntegratedUsers}
                    </div>
                    <div className="text-sm font-semibold">Pengguna Yang Tidak Terintegrasi</div>
                </div>
                <div className="p-4 bg-linear-to-br from-green-800 to-green-400 rounded-md shadow-md border border-green-300 text-white text-center">
                    <div className="text-[50px] font-bold mb-1">
                        {dataCounts.accessedUsers}
                    </div>
                    <div className="text-sm font-semibold">Pengguna Dengan Akses</div>
                </div>
                <div className="p-4 bg-linear-to-br from-red-800 to-red-400 rounded-md shadow-md border border-red-300 text-white text-center">
                    <div className="text-[50px] font-bold mb-1">
                        {dataCounts.unaccessedUsers}
                    </div>
                    <div className="text-sm font-semibold">Pengguna Tanpa Akses</div>
                </div>
            </div>

            <div className="w-full overflow-auto">
                <table className="w-full table-auto">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 border">
                                <div className="flex items-center justify-start gap-x-1 cursor-pointer"
                                    onClick={() => {
                                        setSortBy('fullname');
                                        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                                    }}>
                                    <div>
                                        Pengguna
                                    </div>
                                    <div className="flex items-center gap-x-1">
                                        <button>
                                            {sortBy === 'fullname' ? (
                                                sortDirection === 'asc' ? (
                                                    <FaSortUp className="w-3 h-3 text-slate-500" />
                                                ) : (
                                                    <FaSortDown className="w-3 h-3 text-slate-500" />
                                                )
                                            ) : (
                                                <FaSort className="w-3 h-3 text-slate-300" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </th>
                            <th className="px-4 py-2 border">
                                <div className="flex items-center justify-center gap-x-1 cursor-pointer"
                                    onClick={() => {
                                        setSortBy('id');
                                        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                                    }}>
                                    <div>
                                        Tanggal Dibuat
                                    </div>
                                    <div className="flex items-center gap-x-1">
                                        <button>
                                            {sortBy === 'id' ? (
                                                sortDirection === 'asc' ? (
                                                    <FaSortUp className="w-3 h-3 text-slate-500" />
                                                ) : (
                                                    <FaSortDown className="w-3 h-3 text-slate-500" />
                                                )
                                            ) : (
                                                <FaSort className="w-3 h-3 text-slate-300" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </th>
                            <th className="px-4 py-2 border">
                                Akses
                            </th>
                            <th className="px-4 py-2 border">
                                <div className="flex items-center justify-center gap-x-1 cursor-pointer"
                                    onClick={() => {
                                        setSortBy('drive_usage');
                                        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                                    }}
                                >
                                    <div>
                                        Kapasitas
                                    </div>
                                    <div className="flex items-center gap-x-1">
                                        <button>
                                            {sortBy === 'drive_usage' ? (
                                                sortDirection === 'asc' ? (
                                                    <FaSortUp className="w-3 h-3 text-slate-500" />
                                                ) : (
                                                    <FaSortDown className="w-3 h-3 text-slate-500" />
                                                )
                                            ) : (
                                                <FaSort className="w-3 h-3 text-slate-300" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </th>
                            <th className="px-4 py-2 border">
                                <div className="flex justify-center items-center">
                                    <CogIcon className="w-5 h-5 text-slate-500 text-center" />
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading && (
                            <tr>
                                <td colSpan={5} className="text-center py-4 border">
                                    Loading...
                                </td>
                            </tr>
                        )}
                        {!loading && data.map((item: any, index: any) => (
                            <tr key={index} className="hover:bg-slate-100">
                                <td className="px-4 py-2 border">
                                    <div className="flex items-center gap-x-2">
                                        <div className="w-12 h-12 shrink-0 rounded-full bg-gray-200 flex justify-center items-center">
                                            {item.photo ? (
                                                <img
                                                    src={item.photo}
                                                    onError={(e) => {
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
                                            <span className="text-xs text-slate-500">
                                                <EnvelopeIcon className="w-3 h-3 inline-block mr-1" />
                                                {item.email}
                                            </span>
                                            <span className="text-xs font-bold text-slate-500">
                                                <UserCircle className="w-3 h-3 inline-block mr-1" />
                                                {item.username}
                                            </span>

                                            <div className="flex items-center gap-x-1 mt-1">
                                                {item.googleIntegated && (
                                                    <Tippy content="Integrated with Google">
                                                        <div className="flex items-center gap-x-1">
                                                            <img src="/assets/images/google.png" className="w-3 h-3 inline-block cursor-pointer" />
                                                            <span className="text-xs font-semibold text-green-500">
                                                                Google
                                                            </span>
                                                        </div>
                                                    </Tippy>
                                                )}

                                                {item.semestaIntegrated && (
                                                    <Tippy content="Integrated with Semesta">
                                                        <div className="flex items-center gap-x-1">
                                                            <img src="https://aptika.oganilirkab.go.id/storage/images/thumbnail/original/semesta-ogan-ilir.png" className="w-3 h-3 inline-block cursor-pointer" />
                                                            <span className="text-xs font-semibold text-indigo-500">
                                                                Semesta
                                                            </span>
                                                        </div>
                                                    </Tippy>
                                                )}
                                            </div>
                                        </div>


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
                                        <button
                                            onClick={() => {
                                                confirmDelete(item.id);
                                            }}
                                            className="px-3 py-1 bg-red-500 text-white rounded-md cursor-pointer select-none text-sm flex items-center justify-center gap-x-1">
                                            <TrashIcon className="w-4 h-4 inline-block" />
                                            Hapus
                                        </button>
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
                                            disabled={loading}
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
                                            disabled={loading || (page <= 1)}
                                            className="px-3 py-1 bg-gray-300 text-gray-700 rounded-md ring-0 outline-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
                                            disabled={loading || (page * limit >= totalData)}
                                            className="px-3 py-1 bg-gray-300 text-gray-700 rounded-md ring-0 outline-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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