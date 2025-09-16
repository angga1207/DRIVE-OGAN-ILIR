"use client";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { ShareIcon } from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react';
import { clientDomain } from '@/apis/serverConfig';
import Select from 'react-select';
import Swal from 'sweetalert2';


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

const ModalShare = (
    {
        data,
        isOpen,
        isLoading,
        onSubmit,
        onClose,
    }: {
        data: any,
        isOpen: boolean,
        isLoading: boolean,
        onSubmit: (data: any) => void,
        onClose: () => void,
    }
) => {

    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);

    const [options, setOptions] = useState([
        { value: 'private', label: 'Pribadi' },
        { value: 'public', label: 'Publik' },
    ]);

    const [newData, setNewData] = useState<any>(null);

    useEffect(() => {
        if (isMounted) {
            setNewData(data)
        }
    }, [isOpen, isMounted]);


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
                        className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 w-full sm:w-full sm:max-w-xl data-closed:sm:translate-y-0 data-closed:sm:scale-95"
                    >
                        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <div className="flex items-center gap-x-2">
                                <div className="flex size-8 items-center justify-center rounded-full bg-blue-200 p-2">
                                    <ShareIcon aria-hidden="true" className="size-6 text-blue-600" />
                                </div>
                                <div className="">
                                    <DialogTitle as="h3" className="text-base font-semibold text-gray-900">
                                        {newData?.name}
                                    </DialogTitle>
                                </div>
                            </div>

                            <div className="mt-2 w-full space-y-2 min-h-[100px]">
                                <div className="">
                                    <label className='text-xs text-slate-500 font-semibold'>
                                        Status Publikasi
                                    </label>
                                    <div className="">
                                        <Select
                                            className=''
                                            value={options.find((option) => option.value == newData?.publicity?.status)}
                                            onChange={(e) => {
                                                setNewData({
                                                    ...newData,
                                                    publicity: {
                                                        ...newData?.publicity,
                                                        status: e?.value
                                                    }
                                                })
                                            }}
                                            options={options}
                                            placeholder='Pilih Status Publikasi'
                                            styles={{
                                                control: (baseStyles, state) => ({
                                                    ...baseStyles,
                                                    border: '1px solid #e2e8f0',
                                                    borderColor: state.isFocused ? 'gray' : '#e2e8f0',
                                                    boxShadow: 'none',
                                                    '&:hover': {
                                                        borderColor: state.isFocused ? 'gray' : '#e2e8f0',
                                                    },
                                                }),
                                            }}
                                            isSearchable={true}
                                            isLoading={isLoading}
                                            isDisabled={isLoading}
                                            isClearable={false}
                                            isMulti={false}
                                        >
                                        </Select>
                                    </div>
                                </div>

                                {newData?.publicity?.status === 'public' && (
                                    <>
                                        {newData?.publicity?.forever === false && (
                                            <div className="">
                                                <label className='text-xs text-slate-500 font-semibold'>
                                                    Tanggal Kadaluarsa
                                                </label>
                                                <div className="">
                                                    <input
                                                        type="datetime-local"
                                                        className="border border-gray-200 rounded-md p-2 w-full outline-0 ring-0"
                                                        defaultValue={newData?.publicity?.expired_at}
                                                        onChange={(e) => {
                                                            setNewData({
                                                                ...newData,
                                                                publicity: {
                                                                    ...newData?.publicity,
                                                                    expired_at: e?.target?.value
                                                                }
                                                            })
                                                        }}
                                                        placeholder='Pilih Tanggal Kadaluarsa'
                                                        autoComplete='off'
                                                        disabled={isLoading}
                                                        min={new Date().toISOString().split('T')[0] + 'T00:00'}
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex justify-start items-center gap-2">
                                            <input
                                                onChange={(e) => {
                                                    setNewData({
                                                        ...newData,
                                                        publicity: {
                                                            ...newData?.publicity,
                                                            expired_at: e.target.checked ? '9999-12-31 23:59:59' : null,
                                                            forever: e.target.checked
                                                        }
                                                    });
                                                }}
                                                id="forever"
                                                type="checkbox"
                                                checked={newData?.publicity?.forever}
                                                value="true"
                                                disabled={isLoading}
                                                className="border border-gray-300 rounded-md p-2 cursor-pointer" />
                                            <label htmlFor="forever" className="text-sm text-slate-400 font-semibold cursor-pointer">
                                                Selamanya
                                            </label>
                                        </div>
                                    </>
                                )}

                            </div>
                        </div>

                        <div className="bg-gray-50 px-4 py-3 flex items-center justify-between">
                            <div className="">
                                {data?.publicity?.status === 'public' && (
                                    <button
                                        type='button'
                                        className='mt-3 flex items-center gap-x-2 w-full justify-center rounded-md bg-green-100 px-3 py-2 text-sm font-semibold text-green-900 shadow-xs ring-0 border border-green-300 hover:bg-green-200 sm:mt-0 sm:w-auto cursor-pointer select-none whitespace-nowrap transition-all duration-300'
                                        onClick={() => {
                                            navigator.clipboard.writeText(clientDomain() + '/sharer?_id=' + data?.slug);

                                            SweetAlertToast('success', 'Tautan berhasil disalin', clientDomain() + '/sharer?_id=' + data?.slug)
                                        }}
                                    >
                                        <ShareIcon className="h-3 w-3 inline" />
                                        <div className=''>
                                            Salin Tautan
                                        </div>
                                    </button>
                                )}
                            </div>

                            <div className="flex items-center gap-2">

                                <button
                                    type="button"
                                    onClick={() =>
                                        onClose()
                                    }
                                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-0 border border-slate-300 hover:bg-gray-50 sm:mt-0 sm:w-auto cursor-pointer select-none whitespace-nowrap transition-all duration-300"
                                >
                                    Tutup
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (isLoading === false) {
                                            onSubmit({
                                                ...newData,
                                                publicity: {
                                                    ...newData?.publicity,
                                                    status: newData?.publicity?.status,
                                                    expired_at: newData?.publicity?.expired_at,
                                                    forever: newData?.publicity?.forever
                                                }
                                            })
                                        }
                                    }}
                                    className="mt-3 inline-flex w-full justify-center rounded-md text-slate-100 bg-green-400 px-3 py-2 text-sm font-semibold hover:text-green-900 border border-slate-300 ring-0 outline-0 shadow-xs hover:bg-green-500 sm:mt-0 sm:w-auto cursor-pointer select-none whitespace-nowrap transition-all duration-300"
                                >
                                    {isLoading ? (
                                        <span>
                                            Menyimpan...
                                        </span>
                                    ) : (
                                        <span>
                                            Bagikan
                                        </span>
                                    )}
                                </button>

                            </div>
                        </div>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    );
};
export default ModalShare;