"use client";
import { FolderPlusIcon, ArrowsUpDownIcon, DocumentPlusIcon, TrashIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { Suspense, useEffect, useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import ItemCardList from "./Components/ItemCardList";
import Breadcrumbs from "./Components/breadcrumbs";
import { getItems, getPath, postDelete, postDownload, postMakeFolder, postPublicity, postRename } from "@/apis/apiResources";
import { getCookie } from "cookies-next";
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import ModalDetail from "./Components/modalDetail";
import ModalFolder from "./Components/modalFolder";
import axios from "axios";
import Swal from 'sweetalert2'
import { serverDomain } from "@/apis/serverConfig";
import QueueList from "./Components/queueList";
import ModalShare from "./Components/modalShare";

const ServerDomain = serverDomain();

const SweetAlertConfirm = (title: any, text: any, confirmButtonText: any, cancelButtonText: any) => {
  return Swal.fire({
    title: title,
    text: text,
    icon: 'warning',
    showCancelButton: true,
    // green confirm button
    confirmButtonColor: '#00a63e',
    cancelButtonColor: '#d33',
    confirmButtonText: confirmButtonText,
    cancelButtonText: cancelButtonText,
    // confirm button on right
    reverseButtons: true,
  })
}

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

function Page() {

  const searchParams = useSearchParams();
  const [globalSlug, setGlobalSlug] = useState<any>(null);
  const pathname = usePathname();
  const router = useRouter();

  var CurrentToken = getCookie('token');

  const [user, setUser] = useState<any>(null);

  const [sorts, setSorts] = useState<any>([
    { name: 'Nama ↑', value: 'name', direction: 'asc' },
    { name: 'Nama ↓', value: 'name', direction: 'desc' },
    { name: 'Tanggal ↑', value: 'date', direction: 'asc' },
    { name: 'Tanggal ↓', value: 'date', direction: 'desc' },
    { name: 'Ukuran ↑', value: 'size', direction: 'asc' },
    { name: 'Ukuran ↓', value: 'size', direction: 'desc' },
  ]);

  const [sort, setSort] = useState(sorts[0]);
  const [items, setItems] = useState<any>([]);
  const [arrBreadcrumbs, setArrBreadcrumbs] = useState<any>([]);
  const [selectedItems, setSelectedItems] = useState<any>([]);
  const [inDetailItem, setInDetailItem] = useState<any>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingUploadFiles, setIsLoadingUploadFiles] = useState(false);
  const [isDownloading, setIsDownloading] = useState<any>([]);
  const [showQueueList, setShowQueueList] = useState(false);
  const [isLoadingBreadcrumbs, setIsLoadingBreadcrumbs] = useState(false);
  const [isLoadingFolder, setIsLoadingFolder] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSelectedMode, setIsSelectedMode] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openModalFolder, setOpenModalFolder] = useState(false);
  const [openModalShare, setOpenModalShare] = useState(false);
  const [isFolderCreate, setIsFolderCreate] = useState(false);
  const [uploadFiles, setUploadFiles] = useState<any>([]);
  const [queueUploadFiles, setQueueUploadFiles] = useState<any>([]);
  const [queueBatch, setQueueBatch] = useState<any>(0);

  useEffect(() => {
    setIsMounted(true);
  });

  useEffect(() => {
    if (isMounted) {
      const localUser = localStorage.getItem('user');
      if (localUser) {
        const user = JSON.parse(localUser);
        setUser(user);
      }
      setGlobalSlug(searchParams.get('_p'));
    }
  }, [isMounted]);

  useEffect(() => {
    if (isMounted) {
      setArrBreadcrumbs([]);
      setItems([]);
      setIsLoading(true);
      setIsLoadingBreadcrumbs(true);
      if (globalSlug) {
        getPath(globalSlug).then((res: any) => {
          if (res.status === 'success') {
            setArrBreadcrumbs(res.data);
          }
          setIsLoadingBreadcrumbs(false);
        });

        getItems(globalSlug).then((res: any) => {
          if (res.status === 'success') {
            setItems(res.data);
          }
          setIsLoading(false);
        });
      } else {
        getPath().then((res: any) => {
          if (res.status === 'success') {
            setArrBreadcrumbs(res.data);
          }
          setIsLoadingBreadcrumbs(false);
        });

        getItems().then((res: any) => {
          if (res.status === 'success') {
            setItems(res.data);
          }
          setIsLoading(false);
        });
      }
      setSort(sorts[0]);
    }
  }, [isMounted, searchParams, pathname]);

  const handleUploadFiles = (e: any) => {
    setIsLoadingUploadFiles(true);
    setShowQueueList(true);
    const files = e.target.files;
    if (files.length > 0) {
      setQueueBatch(queueBatch + 1);
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileName = file.name;
        const fileSize = file.size;
        setQueueUploadFiles((prev: any) => {
          return [...prev, { id: (queueBatch + '-') + (i + 1), name: fileName, size: fileSize, progress: 0, status: 'uploading' }];
        });
      }
      AxiosUploadFiles(files).then((res: any) => {
        getItems(globalSlug).then((res: any) => {
          if (res.status === 'success') {
            setItems(res.data);
          }
        });
        setIsLoadingUploadFiles(false);
      });
    }
    setUploadFiles([]);
  }

  const AxiosUploadFiles = async (files: any) => {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileName = file.name;
      const fileSize = file.size;
      const formData = new FormData();
      formData.append('files[]', file);
      formData.append('folderId', globalSlug);
      try {
        const res = await axios.post(`${ServerDomain}/upload/${globalSlug}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${CurrentToken}`,
          },
          onUploadProgress: (progressEvent: any) => {
            const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
            setQueueUploadFiles((prev: any) => {
              return prev.map((item: any) => {
                if (item.id === (queueBatch + '-') + (i + 1)) {
                  return { ...item, progress: progress };
                }
                return item;
              });
            });
            if (progress >= 100) {
              setQueueUploadFiles((prev: any) => {
                return prev.map((item: any) => {
                  if (item.id === (queueBatch + '-') + (i + 1)) {
                    return { ...item, status: 'done' };
                  }
                  return item;
                });
              });
            }
            if (progress < 100) {
              setQueueUploadFiles((prev: any) => {
                return prev.map((item: any) => {
                  if (item.id === (queueBatch + '-') + (i + 1)) {
                    return { ...item, status: 'uploading' };
                  }
                  return item;
                });
              });
            }
          }
        }).then((res: any) => {
          if (res.data.status == 'error') {
            // showSweetAlert('info', 'Peringatan', res?.data?.message, 'Tutup');
          }
        });
        // const response = await res.data;
        // return response;
      } catch (error) {
        return {
          status: 'error',
          message: error
        }
      }
    }
  }

  const handleGoFolder = (slug: any) => {
    const params = new URLSearchParams(window.location.search);
    params.set('_p', slug);
    window.history.pushState({}, '', `${pathname}?${params}`);
    router.push(`${pathname}?_p=${slug}`);
  }

  const handleRenamFolder = (slug: any, name: any, id: any) => {
    setIsLoadingFolder(true);
    if (isFolderCreate === true) {
      postMakeFolder(globalSlug, name).then((res: any) => {
        if (res.status === 'success') {

          if (globalSlug) {
            getItems(globalSlug).then((res: any) => {
              if (res.status === 'success') {
                setItems(res.data);
              }
            });
          } else {
            getItems().then((res: any) => {
              if (res.status === 'success') {
                setItems(res.data);
              }
            });
          }
          setOpenModalFolder(false);
          setInDetailItem(null);
          setSelectedItems([]);
          setIsSelectedMode(false);
          setIsLoading(false);
          setIsError(false);
        }
        else {
          SweetAlertToast('error', 'Gagal', res.message);
        }
        setIsLoadingFolder(false);
      });
    } else if (isFolderCreate === false) {
      postRename(slug, name).then((res: any) => {
        if (res.status === 'success') {
          setItems((prev: any) => {
            return prev.map((item: any) => {
              if (item.id === id) {
                return { ...item, name: name };
              }
              return item;
            });
          });

          setOpenModalFolder(false);
          setInDetailItem(null);
          setSelectedItems([]);
          setIsSelectedMode(false);
          setIsLoading(false);
          setIsError(false);
        }
        else {
          SweetAlertToast('error', 'Gagal', res.message);
        }
        setIsLoadingFolder(false);
      });
    }
  }

  const handleDeleteFile = (data: any) => {
    // setIsLoading(true);
    postDelete([data.slug]).then((res: any) => {
      if (res.status === 'success') {
        setItems((prev: any) => {
          return prev.filter((item: any) => item.id !== data.id);
        });
        setSelectedItems([]);
        setIsSelectedMode(false);
        setIsLoading(false);
        setIsError(false);
        SweetAlertToast('success', 'Berhasil', 'Berkas berhasil dihapus');
      }
    });
  }

  const handleSort = (data: any) => {
    const sortedItems = [...items].sort((a: any, b: any) => {
      if (data.value === 'name') {

        // item type folder first 
        if (a.type === 'folder' && b.type !== 'folder') {
          return -1;
        }
        if (a.type !== 'folder' && b.type === 'folder') {
          return 1;
        }
        if (a.type === 'folder' && b.type === 'folder') {
          return data.direction === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
        }
        if (a.type !== 'folder' && b.type !== 'folder') {
          return data.direction === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
        }

      } else if (data.value === 'date') {
        // item type folder first
        if (a.type === 'folder' && b.type !== 'folder') {
          return -1;
        }
        if (a.type !== 'folder' && b.type === 'folder') {
          return 1;
        }
        if (a.type === 'folder' && b.type === 'folder') {
          return data.direction === 'desc' ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime() : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
        if (a.type !== 'folder' && b.type !== 'folder') {
          return data.direction === 'desc' ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime() : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
      } else if (data.value === 'size') {
        // item type folder first
        if (a.type === 'folder' && b.type !== 'folder') {
          return -1;
        }
        if (a.type !== 'folder' && b.type === 'folder') {
          return 1;
        }
        if (a.type === 'folder' && b.type === 'folder') {
          return 0;
        }
        if (a.type !== 'folder' && b.type !== 'folder') {
          return data.direction === 'desc' ? a.size_bytes - b.size_bytes : b.size_bytes - a.size_bytes;
        }
      }
    });
    setItems(sortedItems);
    setSort(data);
  }

  const handlePostPublicity = (data: any) => {
    postPublicity(data.slug, data).then((res: any) => {
      if (res.status === 'success') {
        setItems((prev: any) => {
          return prev.map((item: any) => {
            if (item.id === data.id) {
              return { ...item, publicity: data.publicity };
            }
            return item;
          });
        });
        setInDetailItem(null);
        setOpenModalShare(false);
      }
    });
  }

  const handleDownload = (data: any) => {
    setIsDownloading((prev: any) => {
      return [...prev, { id: data.id }];
    });
    postDownload(data.slug).then((res: any) => {
      if (res.status === 'success') {
        const link = document.createElement('a');
        link.href = res.data;
        link.setAttribute('download', data.name);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      setIsDownloading((prev: any) => {
        return prev.filter((item: any) => item.id !== data.id);
      });
    });
  }

  if (user?.access === false) {
    return (
      <div>
        <div className="flex flex-col items-center justify-center w-full h-[calc(100vh-150px)] border border-dashed border-slate-300 rounded-lg">
          <div className="">
            <ExclamationTriangleIcon className="h-20 w-20 text-red-500" />
          </div>
          <div className="text-red-500 text-xl font-bold">
            Anda tidak memiliki akses di Aplikasi Drive Ogan Ilir
          </div>
          <div className="">
            Silahkan hubungi admin untuk mendapatkan akses di {` `}
            <a
              className="text-blue-500 font-semibold cursor-pointer hover:underline"
              target="_blank"
              rel="noopener noreferrer"
              href="https://wa.me/6281255332004">
              <span className="text-green-600 font-semibold cursor-pointer hover:underline">
                WhatsApp Center
              </span>
            </a>
            {``} kami.
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-y-2">
        <div className="">
          {isLoadingBreadcrumbs && (
            <>
              <div className="flex items-center gap-x-2">
                <div className="h-10 w-10 bg-slate-100 animate-pulse rounded-full"></div>
                <div className="h-10 w-80 bg-slate-100 animate-pulse rounded-full"></div>
              </div>
            </>
          )}
          {isLoadingBreadcrumbs == false && (
            <Breadcrumbs
              items={arrBreadcrumbs}
              onItemClick={(item) => {

              }}
            />
          )}
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-x-2">
          {/* make folder start */}
          {(isLoading === false && isLoadingFolder === false && isLoadingBreadcrumbs === false) ? (
            <div className="">
              <button
                className="inline-flex items-center w-full justify-center gap-x-1.5 rounded-md bg-blue-100 px-3 py-2 text-sm font-semibold text-blue-900 ring-1 shadow-xs ring-blue-300 ring-inset hover:bg-blue-200 cursor-pointer select-none whitespace-nowrap"
                onClick={() => {
                  setOpenModalFolder(true);
                  setIsFolderCreate(true);
                  setInDetailItem({
                    name: '',
                    slug: '',
                    id: '',
                    type: 'folder',
                  });
                  setSelectedItems([]);
                  setIsSelectedMode(false);
                  setIsLoading(false);
                  setIsError(false);
                }}
              >
                <FolderPlusIcon className="h-4 w-4 inline" />
                Buat Folder
              </button>
            </div>
          ) : (
            <div className="h-10 w-24 inline-flex items-center justify-center gap-x-1.5 rounded-md bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-900 ring-1 shadow-xs ring-slate-300 ring-inset hover:bg-slate-200 cursor-pointer select-none whitespace-nowrap animate-pulse"></div>
          )}
          {/* make folder end */}

          {/* upload files start */}
          {(isLoading === false && isLoadingFolder === false && isLoadingBreadcrumbs === false) ? (
            <div className="">
              <input type="file"
                className="hidden"
                id="upload-files"
                multiple
                onChange={(e: any) => {
                  const files = e.target.files;
                  if (files.length > 0) {
                    setUploadFiles(files);
                    handleUploadFiles(e);
                  }
                }}
                onClick={(e: any) => {
                  e.target.value = null;
                }}
              />
              <div
                className="inline-flex items-center w-full justify-center gap-x-1.5 rounded-md bg-green-100 px-3 py-2 text-sm font-semibold text-green-900 ring-1 shadow-xs ring-green-300 ring-inset hover:bg-green-200 cursor-pointer select-none whitespace-nowrap"
                onClick={(e: any) => {
                  const uploadFiles = document.getElementById('upload-files') as HTMLInputElement;
                  uploadFiles.click();
                }}
              >
                <DocumentPlusIcon className="h-4 w-4 inline" />
                Unggah Berkas
              </div>
            </div>
          ) : (
            <div className="h-10 w-24 inline-flex items-center justify-center gap-x-1.5 rounded-md bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-900 ring-1 shadow-xs ring-slate-300 ring-inset hover:bg-slate-200 cursor-pointer select-none whitespace-nowrap animate-pulse"></div>
          )}
          {/* upload files end */}

          {/* sort start */}
          {(isLoading === false && isLoadingFolder === false && isLoadingBreadcrumbs === false) ? (
            <Menu as="div" className="relative inline-block text-left">
              <div>
                <MenuButton className="inline-flex items-center w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50 cursor-pointer select-none whitespace-nowrap">
                  <ArrowsUpDownIcon className="-ml-1 size-4 text-gray-400" />
                  {sort.name}
                  <ChevronDownIcon aria-hidden="true" className="-mr-1 size-5 text-gray-400" />
                </MenuButton>
              </div>

              <MenuItems
                transition
                className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white ring-1 shadow-lg ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
              >
                <div className="py-1">
                  {sorts.map((item: any, index: number) => (
                    <MenuItem key={`sort-${index}`}>
                      <div
                        onClick={(e) => {
                          // setSort(item);
                          handleSort(item);
                        }}
                        className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden cursor-pointer select-none"
                      >
                        {item.name}
                      </div>
                    </MenuItem>
                  ))}
                </div>
              </MenuItems>
            </Menu>
          ) : (
            <div className="h-10 w-24 inline-flex items-center justify-center gap-x-1.5 rounded-md bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-900 ring-1 shadow-xs ring-slate-300 ring-inset hover:bg-slate-200 cursor-pointer select-none whitespace-nowrap animate-pulse"></div>
          )}
          {/* sort end */}
        </div>
      </div>

      {isLoading == false && (
        <div className="mt-5">

          <div className="mb-2 flex items-center justify-between flex-wrap">
            <div className="flex items-center gap-x-2">
              {/* select all */}
              <div className="flex items-center gap-x-1 cursor-pointer">
                <input
                  type="checkbox"
                  id="select-all-checkbox"
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  checked={(selectedItems.length === items.length) && items.length > 0 ? true : false}
                  disabled={items.length === 0 ? true : false}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedItems(items.map((item: any) => item.id));
                    } else {
                      setSelectedItems([]);
                    }
                  }}
                />
                <label
                  htmlFor="select-all-checkbox"
                  className="text-xs text-slate-500 cursor-pointer">
                  Pilih Semua
                </label>
              </div>
              {/* select all end */}

              {selectedItems.length > 0 && (
                <>
                  <div className="text-xs text-slate-500">
                    {selectedItems.length} Item Terpilih
                  </div>

                  <button
                    className="text-xs bg-red-100 text-slate-500 hover:text-red-900 cursor-pointer rounded border px-1 py-1 border-red-300 hover:border-red-400 hover:bg-red-200 shadow-sm flex items-center gap-x-1"
                    onClick={() => {
                      SweetAlertConfirm('Peringatan', 'Apakah anda yakin ingin menghapus ' + selectedItems?.length + ' berkas ini?', 'Ya, Hapus!', 'Batalkan')
                        .then((result) => {
                          if (result.isConfirmed) {
                            const selectedSlugs = selectedItems.map((item: any) => {
                              const selectedItem = items.find((i: any) => i.id === item);
                              return selectedItem ? selectedItem.slug : null;
                            });
                            postDelete(selectedSlugs).then((res: any) => {
                              if (res.status === 'success') {
                                setItems((prev: any) => {
                                  return prev.filter((item: any) => !selectedItems.includes(item.id));
                                });
                                setSelectedItems([]);
                                setIsSelectedMode(false);
                                setIsLoading(false);
                                setIsError(false);
                                SweetAlertToast('success', 'Berhasil', 'Berkas berhasil dihapus');
                              }
                            });
                          }
                        });
                    }}
                  >
                    <TrashIcon className="h-4 w-4 inline" />
                    Hapus Semua
                  </button>
                </>
              )}
            </div>
            <div className="w-[150px] sm:w-[350px] select-none">
              <div className="">
                <div className="w-full flex align-middle justify-between text-[10px] text-slate-500 font-semibold px-1.5">
                  <div className="">
                    {user?.storage?.used} / {user?.storage?.total}
                  </div>
                  <div className="">
                    {user?.storage?.rest}
                  </div>
                </div>
                <div className="w-full h-4 border border-slate-200 bg-slate-100 rounded-xl">
                  <div
                    className="h-full px-1 flex items-center bg-blue-300 text-[10px] text-blue-900 text-center leading-none rounded-xl whitespace-nowrap font-bold"
                    style={{
                      width: `${user?.storage?.percent}%`,
                      minWidth: '30px',
                    }}>
                    <div>
                      {new Intl.NumberFormat('id-ID', {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 2,
                      }).format(user?.storage?.percent)} %
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto px-4 -mx-4 pb-4">
            {(items.length === 0) && (
              <div className="flex flex-col gap-2 items-center justify-center w-full h-[calc(100vh-300px)] border border-dashed border-slate-300 rounded-lg">
                <div className="text-slate-500 text-sm">
                  Tidak ada berkas ditemukan
                </div>

                <div className="text-slate-500 text-sm">
                  Silahkan buat folder baru atau unggah berkas
                </div>

                <div className="flex items-center gap-x-2">

                  {/* make folder start */}
                  {(isLoading === false && isLoadingFolder === false && isLoadingBreadcrumbs === false) ? (
                    <div className="">
                      <button
                        className="inline-flex items-center w-full justify-center gap-x-1.5 rounded-md bg-blue-100 px-3 py-2 text-sm font-semibold text-blue-900 ring-1 shadow-xs ring-blue-300 ring-inset hover:bg-blue-200 cursor-pointer select-none whitespace-nowrap"
                        onClick={() => {
                          setOpenModalFolder(true);
                          setIsFolderCreate(true);
                          setInDetailItem({
                            name: '',
                            slug: '',
                            id: '',
                            type: 'folder',
                          });
                          setSelectedItems([]);
                          setIsSelectedMode(false);
                          setIsLoading(false);
                          setIsError(false);
                        }}
                      >
                        <FolderPlusIcon className="h-4 w-4 inline" />
                        Buat Folder
                      </button>
                    </div>
                  ) : (
                    <div className="h-10 w-24 inline-flex items-center justify-center gap-x-1.5 rounded-md bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-900 ring-1 shadow-xs ring-slate-300 ring-inset hover:bg-slate-200 cursor-pointer select-none whitespace-nowrap animate-pulse"></div>
                  )}
                  {/* make folder end */}

                  {/* upload files start */}
                  {(isLoading === false && isLoadingFolder === false && isLoadingBreadcrumbs === false) ? (
                    <div className="">
                      <input type="file"
                        className="hidden"
                        id="upload-files"
                        multiple
                        onChange={(e: any) => {
                          const files = e.target.files;
                          if (files.length > 0) {
                            setUploadFiles(files);
                            handleUploadFiles(e);
                          }
                        }}
                        onClick={(e: any) => {
                          e.target.value = null;
                        }}
                      />
                      <div
                        className="inline-flex items-center w-full justify-center gap-x-1.5 rounded-md bg-green-100 px-3 py-2 text-sm font-semibold text-green-900 ring-1 shadow-xs ring-green-300 ring-inset hover:bg-green-200 cursor-pointer select-none whitespace-nowrap"
                        onClick={(e: any) => {
                          const uploadFiles = document.getElementById('upload-files') as HTMLInputElement;
                          uploadFiles.click();
                        }}
                      >
                        <DocumentPlusIcon className="h-4 w-4 inline" />
                        Unggah Berkas
                      </div>
                    </div>
                  ) : (
                    <div className="h-10 w-24 inline-flex items-center justify-center gap-x-1.5 rounded-md bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-900 ring-1 shadow-xs ring-slate-300 ring-inset hover:bg-slate-200 cursor-pointer select-none whitespace-nowrap animate-pulse"></div>
                  )}
                  {/* upload files end */}
                </div>

              </div>
            )}

            {items.map((item: any, index: number) => (
              <ItemCardList
                draggable={selectedItems.includes(item.id)}
                key={`item-${index}`}
                item={item}
                onItemClick={() => { }}
                onItemShare={(e: any) => {
                  setOpenModalShare(true);
                  setInDetailItem(e);
                }}
                onItemEdit={(e: any) => {
                  if (e.type === 'folder') {
                    setOpenModalFolder(true);
                    setInDetailItem(e);
                    setIsFolderCreate(false);
                  } else if (e.type === 'file') {
                    setOpenModalFolder(true);
                    setInDetailItem(e);
                    setIsFolderCreate(false);
                  }
                }}
                onItemDownload={(e: any) => {
                  handleDownload(e);
                }}
                isDownloading={isDownloading?.find((i: any) => i.id === item.id) ? true : false}
                onItemOpen={(e: any) => {
                  if (e.type === 'folder') {
                    handleGoFolder(e.slug);
                  } else if (e.type === 'file') {
                    setOpenModal(true);
                    setInDetailItem(e);
                  }
                }}
                onItemDelete={(e: any) => {
                  SweetAlertConfirm('Peringatan', 'Apakah anda yakin ingin menghapus berkas ini?', 'Ya, Hapus!', 'Batalkan').then((result) => {
                    if (result.isConfirmed) {
                      handleDeleteFile(e);
                    }
                  });
                }}
                onItemSelect={(e: any) => {
                  setSelectedItems((prev: any) => {
                    if (prev.includes(e.id)) {
                      return prev.filter((item: any) => item !== e.id);
                    } else {
                      return [...prev, e.id];
                    }
                  });
                }}
                selectedItems={selectedItems}
                isLoading={false}
                isError={false}
                isSelected={selectedItems.includes(item.id)}
                isSelectedMode={selectedItems.length > 0}
              />
            ))}
          </div>

        </div>
      )}

      {isLoading && (
        <div className="space-y-3 mt-5">
          {/* skeletons */}
          {([0, 1, 2, 3, 4, 5].map((item: any, index: number) => (
            <div key={`loading-${index}`} className="animate-pulse flex items-center gap-x-2">
              <div className="h-18 w-full card bg-slate-100"></div>
            </div>
          )))}
        </div>
      )}

      <ModalDetail
        data={inDetailItem}
        isOpen={openModal}
        onClose={() => {
          setOpenModal(false);
          setInDetailItem(null);
          setSelectedItems([]);
          setIsSelectedMode(false);
          setIsLoading(false);
          setIsError(false);
        }}
        onSubmit={() => {
          setOpenModal(false);
          setInDetailItem(null);
          setSelectedItems([]);
          setIsSelectedMode(false);
          setIsLoading(false);
          setIsError(false);
        }}
      />

      <ModalFolder
        isCreate={isFolderCreate}
        isLoading={isLoadingFolder}
        data={inDetailItem}
        isOpen={openModalFolder}
        onClose={() => {
          setOpenModalFolder(false);
          setInDetailItem(null);
          setSelectedItems([]);
          setIsSelectedMode(false);
          setIsLoading(false);
          setIsError(false);
        }}
        onSubmit={(e: any) => {
          handleRenamFolder(e.slug, e.name, e.id);
        }}
      />

      <ModalShare
        data={inDetailItem}
        isOpen={openModalShare}
        isLoading={false}
        onClose={() => {
          setInDetailItem(null);
          setOpenModalShare(false);
        }}
        onSubmit={(e: any) => {
          handlePostPublicity(e);
        }}

      />

      <QueueList
        datas={queueUploadFiles}
        isShow={showQueueList}
        onClose={() => {
          setShowQueueList(false);
        }}
        onOpen={() => {
          setShowQueueList(true);
        }}
      />

    </div>
  )
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="h-full w-full flex items-center justify-center">Loading...</div>}>
      <Page />
    </Suspense>
  );
}
