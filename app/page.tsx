"use client";
import { FolderPlusIcon, ArrowsUpDownIcon, DocumentPlusIcon, TrashIcon, ExclamationTriangleIcon, ArchiveBoxArrowDownIcon, ArrowsPointingOutIcon, FolderIcon, ArrowUturnLeftIcon, TableCellsIcon, ListBulletIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import ItemCardList from "./Components/ItemCardList";
import Breadcrumbs from "./Components/breadcrumbs";
import { getItems, getPath, moveItems, postDelete, postDownload, postMakeFolder, postPublicity, postRename, setFavorite } from "@/apis/apiResources";
import { getCookie } from "cookies-next";
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import ModalDetail from "./Components/modalDetail";
import ModalFolder from "./Components/modalFolder";
import axios from "axios";
import Swal from 'sweetalert2'
import { serverDomain } from "@/apis/serverConfig";
import QueueList from "./Components/queueList";
import ModalShare from "./Components/modalShare";
import ModalMove from './Components/modalMove';
import Tippy from '@tippyjs/react';
import ItemCardGrid from './Components/ItemCardGrid';
import SideBar from './Components/SideBar';
import AddMenu from './Components/addMenu';
import { signOut, useSession } from 'next-auth/react';
import { decryptClient } from '@/lib/crypto-js';
import { createAxiosConfig, createAxiosConfigMultipart, getBearerTokenForApi } from '@/utils/apiHelpers';

const ServerDomain = serverDomain();

const SweetAlertConfirm = (title: any, text: any, confirmButtonText: any, cancelButtonText: any, showCancelButton: boolean = true) => {
  return Swal.fire({
    title: title,
    text: text,
    icon: 'warning',
    showCancelButton: showCancelButton,
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
  const pathname = usePathname();
  const router = useRouter();

  // var CurrentToken = getCookie('token');

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
  const [viewMode, setViewMode] = useState('list'); // grid or list
  const [items, setItems] = useState<any>([]);
  const [arrBreadcrumbs, setArrBreadcrumbs] = useState<any>([]);
  const [selectedItems, setSelectedItems] = useState<any>([]);
  const [inDetailItem, setInDetailItem] = useState<any>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingUploadFiles, setIsLoadingUploadFiles] = useState(false);
  const [isDownloading, setIsDownloading] = useState<any>([]);
  const [isMoveDragging, setIsMoveDragging] = useState(false);
  const [showQueueList, setShowQueueList] = useState(false);
  const [isLoadingBreadcrumbs, setIsLoadingBreadcrumbs] = useState(false);
  const [isLoadingFolder, setIsLoadingFolder] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSelectedMode, setIsSelectedMode] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openModalMove, setOpenModalMove] = useState(false);
  const [openModalFolder, setOpenModalFolder] = useState(false);
  const [openModalShare, setOpenModalShare] = useState(false);
  const [isFolderCreate, setIsFolderCreate] = useState(false);
  const [uploadFiles, setUploadFiles] = useState<any>([]);
  const [queueUploadFiles, setQueueUploadFiles] = useState<any>([]);
  const [queueBatch, setQueueBatch] = useState<any>(0);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      const cookieUser = getCookie('user');
      if (cookieUser) {
        const user = JSON.parse(cookieUser as string);
        setUser(user);
      }
    }
  }, [isMounted]);


  useEffect(() => {
    if (isMounted) {
      setArrBreadcrumbs([]);
      setItems([]);
      setIsLoading(true);
      setIsLoadingBreadcrumbs(true);
      if (searchParams.get('_p')) {
        getPath(searchParams.get('_p')).then((res: any) => {
          if (res.status === 'success') {
            setArrBreadcrumbs(res.data);
          }
          else if (res.message.status == 401) {
            signOut({
              callbackUrl: '/logout'
            });
            window.location.href = '/logout';
          }
          setIsLoadingBreadcrumbs(false);
        });

        getItems(searchParams.get('_p')).then((res: any) => {
          if (res.status === 'success') {
            setItems(res.data);
          } else if (res.message.status == 401) {
            signOut({
              callbackUrl: '/logout'
            })
            // window.location.href = '/logout';
          } else if (res.status == 'error') {
            if (res.code == 401 || res.message == 'Unauthenticated') {
              signOut({
                callbackUrl: '/logout'
              })
              // window.location.href = '/logout';
            }
          }
          setIsLoading(false);
        });
      } else {
        getPath().then((res: any) => {
          if (res.status === 'success') {
            setArrBreadcrumbs(res.data);
          }
          else if (res.message.status) {
            signOut({
              callbackUrl: '/logout'
            })
            // window.location.href = '/logout';
          }
          setIsLoadingBreadcrumbs(false);
        });

        getItems().then((res: any) => {
          if (res.status === 'success') {
            setItems(res.data);
          } else if (res.message.status == 401) {
            signOut({
              callbackUrl: '/logout'
            })
            // window.location.href = '/logout';
          } else if (res.status == 'error') {
            if (res.code == 401 || res.message == 'Unauthenticated') {
              signOut({
                callbackUrl: '/logout'
              })
              // window.location.href = '/logout';
            }
          }
          setIsLoading(false);

        });
      }
      setSort(sorts[0]);
      setSelectedItems([]);
    }
  }, [isMounted, searchParams, pathname]);

  useEffect(() => {
    if (isMounted) {
      if (items.length > 0) {
        if (searchParams.get('ref') === 'search' && searchParams.get('_f')) {
          const file = items.find((item: any) => item.slug === searchParams.get('_f'));
          if (file) {
            setSelectedItems([file]);
            // scroll to selected item
            const element = document.getElementById('item-' + file.slug);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }
        }
      }
    }
  }, [isMounted, searchParams, items]);

  // console.log(globalFilesData)

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
        getItems(searchParams.get('_p')).then((res: any) => {
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
    const globalSlug = searchParams.get('_p');
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileName = file.name;
      const fileSize = file.size;
      const formData = new FormData();
      formData.append('files[]', file);
      formData.append('folderId', globalSlug as string);
      try {
        // Get bearer token for authorization
        const token = await getBearerTokenForApi();

        // Use axios for upload progress tracking with Next.js API route
        const res = await axios.post(`/api/upload/${globalSlug}`, formData, {
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
            // Don't set Content-Type for FormData, let axios handle it
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
        });
        const response = await res.data;
        if (response.status == 'error') {
          SweetAlertToast('error', 'Gagal', response.message);
        }
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
      postMakeFolder(searchParams.get('_p'), name).then((res: any) => {
        if (res.status === 'success') {

          if (searchParams.get('_p')) {
            getItems(searchParams.get('_p')).then((res: any) => {
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

  const handleDeleteFile = (data: any, callback: any = null) => {
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

        if (callback) {
          // redirect to callback uri
          // window.location.href = '/?p=' + callback;

          if (callback !== 'root') {
            router.push('/?_p=' + (callback ?? ''));
          } else {
            router.push('/');
          }
        }
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
    postDownload([data.slug]).then((res: any) => {
      if (res.status === 'success') {
        const link = document.createElement('a');
        link.href = res.data[0].url;
        link.setAttribute('download', res.data[0].name || 'download.zip');
        // target="_blank"
        link.setAttribute('rel', 'noopener noreferrer');
        link.setAttribute('target', '_blank');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      setIsDownloading((prev: any) => {
        return prev.filter((item: any) => item.id !== data.id);
      });
    });
  }


  const handleMoveToFolder = (sourceIds: any, targetIds: any) => {
    moveItems(sourceIds, targetIds).then(res => {
      if (res.status === 'success') {
        if (searchParams.get('_p')) {
          getItems(searchParams.get('_p')).then((res: any) => {
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
        setSelectedItems([]);
      }
      if (res.status === 'error') {
        SweetAlertToast('error', 'Gagal Memindahkan', res.message);
      }
      if (res.status === 'error validation') {
        SweetAlertToast('error', 'Error', 'Gagal Memindahkan');
      }
    });
  }

  const handleSetFavorite = (data: any, status: boolean) => {
    setFavorite([data.slug], status).then((res: any) => {
      if (res.status === 'success') {
        if (searchParams.get('_p')) {
          getItems(searchParams.get('_p')).then((res: any) => {
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
        setSelectedItems([]);
      }
      if (res.status === 'error') {
        SweetAlertToast('error', 'Error', res.message);
      }
      if (res.status === 'error validation') {
        SweetAlertToast('error', 'Error', res.message);
      }
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
    <div
      onContextMenu={(e) => e.preventDefault()}>

      <div className="grid grid-cols-12 gap-0 lg:gap-4 bg-white">
        <div className="col-span-12 lg:col-span-2">
          <div className="h-auto lg:h-[calc(100vh-64px)] flex flex-col bg-[#003a69] pt-5 pb-20 px-2">

            <AddMenu
              isDisabled={false}
              isLoading={isLoading}
              isLoadingFolder={isLoadingFolder}
              isLoadingBreadcrumbs={isLoadingBreadcrumbs}

              onUploadFiles={(e: any) => {
                handleUploadFiles(e);
              }}

              onCreateFolder={() => {
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
            />

            <SideBar
              userData={user}
            />

          </div>
        </div>

        <div className="col-span-12 lg:col-span-10 px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-y-2">
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

                  onItemDelete={(e: any, callback: any) => {
                    SweetAlertConfirm('Peringatan', 'Langkah ini akan menghapus folder dan seluruh isinya?', 'Ya, Hapus!', 'Batalkan').then((result) => {
                      if (result.isConfirmed) {
                        handleDeleteFile(e, callback);
                      }
                    });
                  }}

                  onItemShare={(e: any) => {
                    setOpenModalShare(true);
                    setInDetailItem(e);
                  }}

                  onMakeNewFolder={() => {
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
                />
              )}
            </div>

            <div className="shrink w-auto flex items-center xl:justify-end gap-x-2">

              {/* sort start */}
              {(isLoading === false && isLoadingFolder === false && isLoadingBreadcrumbs === false) ? (
                <Menu as="div" className="relative inline-block text-left">
                  <div>
                    <MenuButton className="flex items-center w-full justify-center gap-x-1.5 rounded-md hover:bg-[#ebbd18] bg-[#003a69] hover:text-[#003a69] text-[#ebbd18] border border-transparent hover:border-[#003a69] px-3 py-2 text-sm font-semibold ring-1 shadow-xs ring-gray-300 ring-inset cursor-pointer select-none whitespace-nowrap group">
                      <ArrowsUpDownIcon className="-ml-1 size-4 text-[#ebbd18] group-hover:text-[#003a69]" />
                      {sort.name}
                      <ChevronDownIcon aria-hidden="true" className="-mr-1 size-5 text-[#ebbd18] group-hover:text-[#003a69]" />
                    </MenuButton>
                  </div>

                  <MenuItems
                    transition
                    className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-[#003a69] ring-1 shadow-lg ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                  >
                    <div className="py-1">
                      {sorts.map((item: any, index: number) => (
                        <MenuItem key={`sort-${index}`}>
                          <div
                            onClick={(e) => {
                              // setSort(item);
                              handleSort(item);
                            }}
                            className="block px-4 py-2 text-sm text-[#ebbd18] data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden cursor-pointer select-none"
                          >
                            {item.name}
                          </div>
                        </MenuItem>
                      ))}
                    </div>
                  </MenuItems>
                </Menu>
              ) : (
                <div className="h-10 w-24 inline-flex items-center justify-center gap-x-1.5 rounded-md bg-[#003a69] px-3 py-2 text-sm font-semibold text-slate-900 ring-1 shadow-xs ring-slate-300 ring-inset hover:bg-slate-200 cursor-pointer select-none whitespace-nowrap animate-pulse"></div>
              )}
              {/* sort end */}

              {/* view mode start */}
              {(isLoading === false && isLoadingFolder === false && isLoadingBreadcrumbs === false) ? (
                <Tippy content={viewMode === 'list' ? 'List View' : 'Grid View'} arrow={true}>
                  <div
                    className="flex items-center w-12 justify-center gap-x-1.5 rounded-md hover:bg-[#ebbd18] bg-[#003a69] hover:text-[#003a69] text-[#ebbd18] px-3 py-2 text-sm font-semibold ring-1 shadow-xs ring-gray-300 ring-inset cursor-pointer select-none whitespace-nowrap"
                    onClick={(e) => {
                      e.preventDefault();
                      setViewMode(viewMode === 'list' ? 'grid' : 'list');
                    }}
                  >
                    {viewMode === 'list' ? (
                      <ListBulletIcon className="size-5 inline outline-none" />
                    ) : (
                      <TableCellsIcon className="size-5 inline outline-none" />
                    )}
                  </div>
                </Tippy>
              ) : (
                <div className="h-10 w-12 inline-flex items-center justify-center gap-x-1.5 rounded-md bg-[#003a69] px-3 py-2 text-sm font-semibold text-slate-900 ring-1 shadow-xs ring-slate-300 ring-inset hover:bg-slate-200 cursor-pointer select-none whitespace-nowrap animate-pulse"></div>
              )}
              {/* view mode end */}

            </div>
          </div>

          {isLoading == false && (
            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between flex-wrap gap-y-4">
                <div className="flex flex-col lg:flex-row lg:items-center gap-2">
                  {/* select all */}
                  <div className="flex items-center gap-x-1 select-none">
                    <div className="flex items-center gap-x-1 cursor-pointer">
                      <input
                        type="checkbox"
                        id="select-all-checkbox"
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        checked={(selectedItems.length === items.length) && items.length > 0 ? true : false}
                        disabled={items.length === 0 ? true : false}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedItems(items.map((item: any) => item));
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
                    {/* {selectedItems.length > 0 && (
                  <div className="text-xs text-slate-500">
                    {selectedItems.length} Item Terpilih
                  </div>
                )} */}
                  </div>
                  {/* select all end */}

                  {selectedItems.length > 0 && (
                    <div className='flex items-center gap-x-2'>

                      <button
                        className="text-xs bg-red-100 text-slate-500 hover:text-red-900 cursor-pointer rounded border px-1 py-1 border-red-300 hover:border-red-400 hover:bg-red-200 shadow-sm flex items-center gap-x-1 whitespace-nowrap"
                        onClick={() => {
                          SweetAlertConfirm('Peringatan', 'Apakah anda yakin ingin menghapus ' + selectedItems?.length + ' berkas ini?', 'Ya, Hapus!', 'Batalkan')
                            .then((result) => {
                              if (result.isConfirmed) {
                                postDelete(selectedItems.map((item: any) => item.slug)).then((res: any) => {
                                  if (res.status === 'success') {
                                    setItems((prev: any) => {
                                      return prev.filter((item: any) => !selectedItems.map((item: any) => item.slug).includes(item.slug));
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

                      <button
                        className="text-xs bg-indigo-100 text-slate-500 hover:text-indigo-900 cursor-pointer rounded border px-1 py-1 border-indigo-300 hover:border-indigo-400 hover:bg-indigo-200 shadow-sm flex items-center gap-x-1 whitespace-nowrap"

                        onClick={() => {
                          if (selectedItems.length === 0) {
                            SweetAlertToast('info', 'Peringatan', 'Tidak ada berkas yang dipilih');
                            return;
                          }
                          if (selectedItems.filter((item: any) => item.type === 'folder').length > 0) {
                            SweetAlertConfirm('Peringatan', 'Tidak dapat mengunduh folder. Silahkan pilih berkas yang ingin diunduh.', 'Tutup', null, false)
                            return;
                          }

                          SweetAlertConfirm('Peringatan', 'Apakah anda yakin ingin mengunduh ' + selectedItems?.length + ' berkas ini?', 'Ya, Unduh!', 'Batalkan')
                            .then((result) => {
                              if (result.isConfirmed) {
                                postDownload(selectedItems.map((item: any) => item.slug)).then((res: any) => {
                                  if (res.status === 'success') {
                                    res.data.forEach((item: any) => {
                                      const link = document.createElement('a');
                                      link.href = item.url;
                                      link.setAttribute('download', item.name || 'download.zip');
                                      link.setAttribute('rel', 'noopener noreferrer');
                                      link.setAttribute('target', '_blank');
                                      document.body.appendChild(link);
                                      link.click();
                                      document.body.removeChild(link);
                                    });

                                    setSelectedItems([]);
                                    setIsSelectedMode(false);
                                    setIsLoading(false);
                                    setIsError(false);
                                    SweetAlertToast('success', 'Berhasil', 'Berkas berhasil diunduh');
                                  } else {
                                    SweetAlertToast('error', 'Gagal', res.message);
                                  }
                                });
                              }
                            });
                        }}
                      >
                        <ArchiveBoxArrowDownIcon className="h-4 w-4 inline" />
                        Unduh {selectedItems.length} Item
                      </button>

                      <button
                        className="text-xs bg-amber-100 text-slate-500 hover:text-amber-900 cursor-pointer rounded border px-1 py-1 border-amber-300 hover:border-amber-400 hover:bg-amber-200 shadow-sm flex items-center gap-x-1 whitespace-nowrap"
                        onClick={() => {
                          if (selectedItems.length === 0) {
                            SweetAlertToast('info', 'Peringatan', 'Tidak ada berkas yang dipilih');
                            return;
                          }

                          setOpenModalMove(true);

                        }}
                      >
                        <ArrowsPointingOutIcon className="h-4 w-4 inline" />
                        Pindahkan
                      </button>

                      {/* reset button */}
                      <button
                        className="text-xs bg-slate-100 text-slate-500 hover:text-slate-900 cursor-pointer rounded border px-1 py-1 border-slate-300 hover:border-slate-400 hover:bg-slate-200 shadow-sm flex items-center gap-x-1 whitespace-nowrap"
                        onClick={() => {
                          setSelectedItems([]);
                          setIsSelectedMode(false);
                        }}
                      >
                        <XMarkIcon className="h-4 w-4 inline" />
                        Batalkan
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div
                className="flex flex-col gap-y-2 max-w-full max-h-[calc(100vh-200px)] overflow-x-hidden overflow-y-auto px-4 -mx-4 pb-4">

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
                            className="inline-flex items-center w-full justify-center gap-x-1.5 rounded-md bg-[#003a69] px-3 py-2 text-sm font-semibold text-[#ebbd18] ring-1 shadow-xs ring-[#003a69] ring-inset hover:bg-[#003a69]/90 cursor-pointer select-none whitespace-nowrap transition-all duration-300"
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
                            className="inline-flex items-center w-full justify-center gap-x-1.5 rounded-md bg-[#003a69] px-3 py-2 text-sm font-semibold text-[#ebbd18] ring-1 shadow-xs ring-[#003a69] ring-inset hover:bg-[#003a69]/90 cursor-pointer select-none whitespace-nowrap transition-all duration-300"
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

                {viewMode === 'list' && (
                  items.map((item: any, index: number) => (
                    <ItemCardList
                      draggable={true}
                      // draggable={selectedItems.length == 0}
                      onDragging={(data: any) => {
                        setIsMoveDragging(data)
                      }}

                      key={`item-${index}`}
                      item={item}

                      onItemClick={() => {

                      }}

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
                          if (prev.find((i: any) => i.id === e.id)) {
                            return prev.filter((item: any) => item.id !== e.id);
                          } else {
                            return [...prev, e];
                          }

                        });
                      }}
                      onMoveItems={(sourceItems: any, targetFolder: any) => {
                        handleMoveToFolder(sourceItems, targetFolder);
                      }}
                      onSetFavorite={(e: any, is_favorite: boolean) => {
                        handleSetFavorite(e, is_favorite);
                      }}
                      options={{
                        view: true,
                        favorite: true,
                        edit_name: true,
                        share: true,
                        download: true,
                        delete: true,
                        copy_link: true,
                      }}
                      isOwner={user?.id == item?.author?.id ? true : false}
                      selectedItems={selectedItems}
                      isLoading={false}
                      isError={false}
                      isSelected={selectedItems.find((i: any) => i.id === item.id) ? true : false}
                      isSelectedMode={selectedItems.length > 0}
                    />
                  ))
                )}

                {viewMode === 'grid' && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 mb-5">
                      {items.filter((i: any) => i.type === 'folder').map((item: any, index: number) => (
                        <ItemCardGrid
                          draggable={true}
                          // draggable={selectedItems.length == 0}
                          onDragging={(data: any) => {
                            setIsMoveDragging(data)
                          }}

                          key={`item-${index}`}
                          item={item}

                          onItemClick={() => {
                            if (isSelectedMode) {

                            }
                          }}

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
                              if (prev.find((i: any) => i.id === e.id)) {
                                return prev.filter((item: any) => item.id !== e.id);
                              } else {
                                return [...prev, e];
                              }

                            });
                          }}
                          onMoveItems={(sourceItems: any, targetFolder: any) => {
                            handleMoveToFolder(sourceItems, targetFolder);
                          }}
                          selectedItems={selectedItems}
                          isLoading={false}
                          isError={false}
                          isSelected={selectedItems.find((i: any) => i.id === item.id) ? true : false}
                          isSelectedMode={selectedItems.length > 0}
                        />
                      ))}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
                      {items.filter((i: any) => i.type === 'file').map((item: any, index: number) => (
                        <ItemCardGrid
                          draggable={true}
                          // draggable={selectedItems.length == 0}
                          onDragging={(data: any) => {
                            setIsMoveDragging(data)
                          }}

                          key={`item-${index}`}
                          item={item}

                          onItemClick={() => {

                          }}

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
                              if (prev.find((i: any) => i.id === e.id)) {
                                return prev.filter((item: any) => item.id !== e.id);
                              } else {
                                return [...prev, e];
                              }

                            });
                          }}
                          onMoveItems={(sourceItems: any, targetFolder: any) => {
                            handleMoveToFolder(sourceItems, targetFolder);
                          }}
                          selectedItems={selectedItems}
                          isLoading={false}
                          isError={false}
                          isSelected={selectedItems.find((i: any) => i.id === item.id) ? true : false}
                          isSelectedMode={selectedItems.length > 0}
                        />
                      ))}
                    </div>
                  </>
                )}

              </div>

            </div>
          )}

          {isLoading && (
            <div className="space-y-3 mt-5">
              {/* skeletons */}
              {([0, 1, 2, 3, 4, 5].map((item: any, index: number) => (
                <div key={`loading-${index}`} className="animate-pulse flex items-center gap-x-2">
                  <div className="h-18 w-full card bg-[#003a69]/50"></div>
                </div>
              )))}
            </div>
          )}
        </div>
      </div>

      <ModalMove
        data={selectedItems}
        isOpen={openModalMove}
        onClose={() => {
          setOpenModalMove(false);
          setSelectedItems([]);
        }}
        onSubmit={() => {
          if (searchParams.get('_p')) {
            getItems(searchParams.get('_p')).then((res: any) => {
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
          setOpenModalMove(false);
          setSelectedItems([]);
        }}
      />

      <ModalDetail
        data={inDetailItem}
        isOpen={openModal}
        onItemDownload={(e: any) => {
          handleDownload(e);
        }}
        isDownloading={isDownloading?.find((i: any) => i.id === inDetailItem?.id) ? true : false}
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
        onReset={() => {
          const remainingQueue = queueUploadFiles.filter((item: any) => item.status !== 'done' && item.status !== 'failed');
          setQueueUploadFiles([]);
          setQueueBatch(0);
          setShowQueueList(false);
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
