"use client";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react';

const ModalUser = (
    {
        data,
        isCreate,
        isOpen,
        isLoading,
        onClose,
        onSubmit,
    }: {
        data: any,
        isCreate: boolean,
        isOpen: boolean,
        isLoading: boolean,
        onClose: () => void,
        onSubmit: (data: any) => void,
    }
) => {
    const [newData, setNewData] = useState<any>([]);
    const [showPassword, setShowPassword] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (isMounted) {
            setNewData({
                id: data?.id ? data?.id : '',
                firstname: data?.firstname ? data?.firstname : '',
                lastname: data?.lastname ? data?.lastname : '',
                username: data?.username ? data?.username : '',
                email: data?.email ? data?.email : '',
                password: data?.password ? data?.password : '',
                password_confirmation: data?.password_confirmation ? data?.password_confirmation : '',
                photo: '',
                photo_url: data?.photo ? data?.photo : '',
                inputType: isCreate ? 'create' : 'update',
                capacity: data?.storage?.total_raw ? data?.storage?.total_raw : 0,
            });
        }
    }, [isMounted, data, isCreate]);

    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-10">
            <DialogBackdrop
                transition
                className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
            />

            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <DialogPanel
                        transition
                        className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-4xl data-closed:sm:translate-y-0 data-closed:sm:scale-95"
                    >
                        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <DialogTitle className="text-lg font-medium leading-6 text-gray-900">
                                {isCreate ? 'Buat Pengguna' : 'Edit Pengguna'}
                            </DialogTitle>

                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    if (isLoading === false) {
                                        onSubmit(newData);
                                    }
                                }}
                                className="grid grid-cols-12 gap-4 font-normal">

                                <div className="col-span-12 lg:col-span-6">
                                    <label className="font-semibold text-sm mb-1 text-slate-400 select-none">
                                        Nama Depan
                                    </label>
                                    <input className="w-full p-2 border border-slate-400 rounded ring-0 focus:ring-0 outline-0"
                                        defaultValue={newData?.firstname}
                                        onChange={(e) => {
                                            setNewData({
                                                ...newData,
                                                firstname: e.target.value
                                            });
                                        }}
                                        placeholder='Masukkan Nama Depan' />
                                    <div id="error-users-firstname" className="text-xs text-red-500"></div>
                                </div>

                                <div className="col-span-12 lg:col-span-6">
                                    <label className="font-semibold text-sm mb-1 text-slate-400 select-none">
                                        Nama Belakang
                                    </label>
                                    <input className="w-full p-2 border border-slate-400 rounded ring-0 focus:ring-0 outline-0"
                                        defaultValue={newData?.lastname}
                                        onChange={(e) => {
                                            setNewData({
                                                ...newData,
                                                lastname: e.target.value
                                            });
                                        }}
                                        placeholder='Masukkan Nama Belakang' />
                                    <div id="error-users-lastname" className="text-xs text-red-500"></div>
                                </div>

                                <div className="col-span-12 lg:col-span-6">
                                    <label className="font-semibold text-sm mb-1 text-slate-400 select-none">
                                        Nama Pengguna
                                    </label>
                                    <input className="w-full p-2 border border-slate-400 rounded ring-0 focus:ring-0 outline-0"
                                        defaultValue={newData?.username}
                                        onChange={(e) => {
                                            setNewData({
                                                ...newData,
                                                username: e.target.value
                                            });
                                        }}
                                        disabled={newData?.inputType === 'update' ? true : false}
                                        placeholder='Masukkan Nama Pengguna' />
                                    <div id="error-users-username" className="text-xs text-red-500"></div>
                                </div>

                                <div className="col-span-12 lg:col-span-6">
                                    <label className="font-semibold text-sm mb-1 text-slate-400 select-none">
                                        Email
                                    </label>
                                    <input className="w-full p-2 border border-slate-400 rounded ring-0 focus:ring-0 outline-0"
                                        defaultValue={newData?.email}
                                        onChange={(e) => {
                                            setNewData({
                                                ...newData,
                                                email: e.target.value
                                            });
                                        }}
                                        placeholder='Masukkan Email' />
                                    <div id="error-users-email" className="text-xs text-red-500"></div>
                                </div>

                                <div className="col-span-12 lg:col-span-6">
                                    <label className="font-semibold text-sm mb-1 text-slate-400 select-none">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <input className="w-full p-2 border border-slate-400 rounded ring-0 focus:ring-0 outline-0"
                                            defaultValue={newData?.password}
                                            onChange={(e) => {
                                                setNewData({
                                                    ...newData,
                                                    password: e.target.value
                                                });
                                            }}
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder='Masukkan Password' />
                                        <div className="absolute w-10 h-full right-0 top-0 cursor-pointer flex items-center justify-center bg-slate-100 border border-slate-400 rounded-r"
                                            onClick={() => setShowPassword(!showPassword)}>
                                            {showPassword ? <EyeIcon className="h-4 w-4 text-green-500" /> : <EyeSlashIcon className="h-4 w-4 text-slate-400" />}
                                        </div>
                                    </div>
                                    <div id="error-users-password" className="text-xs text-red-500"></div>
                                </div>

                                <div className="col-span-12 lg:col-span-6">
                                    <label className="font-semibold text-sm mb-1 text-slate-400 select-none">
                                        Konfirmasi Password
                                    </label>
                                    <div className="relative">
                                        <input className="w-full p-2 border border-slate-400 rounded ring-0 focus:ring-0 outline-0"
                                            defaultValue={newData?.password_confirmation}
                                            onChange={(e) => {
                                                setNewData({
                                                    ...newData,
                                                    password_confirmation: e.target.value
                                                });
                                            }}
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder='Masukkan Konfirmasi Password' />
                                        <div className="absolute w-10 h-full right-0 top-0 cursor-pointer flex items-center justify-center bg-slate-100 border border-slate-400 rounded-r"
                                            onClick={() => setShowPassword(!showPassword)}>
                                            {showPassword ? <EyeIcon className="h-4 w-4 text-green-500" /> : <EyeSlashIcon className="h-4 w-4 text-slate-400" />}
                                        </div>
                                    </div>
                                    <div id="error-users-password_confirmation" className="text-xs text-red-500"></div>
                                </div>

                                <div className="col-span-12 lg:col-span-6">
                                    <label className="font-semibold text-sm mb-1 text-slate-400 select-none">
                                        Kapasitas Drive
                                    </label>
                                    <div className="relative">
                                        <input className="w-full p-2 border border-slate-400 rounded ring-0 focus:ring-0 outline-0"
                                            defaultValue={newData?.capacity}
                                            onChange={(e) => {
                                                setNewData({
                                                    ...newData,
                                                    capacity: e.target.value
                                                });
                                            }}
                                            type="number"
                                            min={0}
                                            placeholder='Masukkan Kapasitas Drive' />
                                        <div className="absolute w-10 h-full right-0 top-0 cursor-pointer flex items-center justify-center bg-slate-100 border border-slate-400 rounded-r text-xs font-semibold">
                                            GB
                                        </div>
                                    </div>
                                    <div id="error-users-capacity" className="text-xs text-red-500"></div>
                                </div>

                                <div className="col-span-12 w-full flex items-center justify-end gap-2">
                                    <div className="">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                onClose();
                                            }}
                                            className="py-1 px-3 bg-slate-300 text-black rounded-lg hover:bg-slate-400 transition-all duration-200 flex items-center justify-center text-sm">
                                            <span>
                                                Batal
                                            </span>
                                        </button>
                                    </div>
                                    <div className="">
                                        <button
                                            type="submit"
                                            className="py-1 px-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-200 flex items-center justify-center text-sm">
                                            <span>
                                                {isLoading ? 'Menyimpan...' : isCreate ? 'Simpan' : 'Perbarui'}
                                            </span>
                                        </button>
                                    </div>
                                </div>

                            </form>
                        </div>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    );
}

export default ModalUser;