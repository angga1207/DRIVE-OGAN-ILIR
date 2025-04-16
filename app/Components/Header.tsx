"use client";
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import Link from "next/link";
import AuthChecker from './AuthChecker';
import { useEffect, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

const Header = () => {
    const [navigation, setNavigation] = useState([
        { name: 'Beranda', href: '/', current: false },
        { name: 'Profil', href: '/profile', current: false },
    ]);

    const [userNavigation, setUserNavigation] = useState([
        { name: 'Profil Anda', href: '/profile' },
        { name: 'Keluar Aplikasi', href: '/logout' },
    ]);

    const [isMounted, setIsMounted] = useState(false);
    const Pathname = usePathname();

    const [user, setUser] = useState<any>({
        id: null,
        name: '{Username}',
        email: '{Email}',
        imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    });

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (isMounted) {
            const LocalUser = localStorage.getItem('user');
            if (LocalUser) {
                const parsedUser = JSON.parse(LocalUser);
                setUser({
                    id: parsedUser?.id,
                    name: parsedUser?.name?.fullname,
                    email: parsedUser?.email,
                    imageUrl: parsedUser?.photo,
                });

                if ([1, 4].includes(parsedUser?.id)) {
                    setNavigation([
                        { name: 'Beranda', href: '/', current: false },
                        { name: 'Profil', href: '/profile', current: false },
                        { name: 'Pengguna', href: '/users', current: false },
                        // { name: 'Sumber Daya', href: '/resources', current: false },
                    ]);
                }
                if (Pathname === '/sharer') {
                    setNavigation([
                        { name: 'Beranda', href: '/', current: false },
                    ]);
                    setUserNavigation([]);
                }

            }
        }
    }, [isMounted]);

    if (Pathname === '/login' || Pathname === '/register' || Pathname === '/logout') {
        return (
            <>
            </>
        );
    } else if (Pathname === '/sharer') {
        return (
            <Disclosure as="nav" className="bg-gray-800 select-none">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        <div className="flex items-center">
                            <div className="shrink-0">
                                <Link href="/">
                                    <img
                                        alt="Drive Ogan Ilir"
                                        src="/favicon.png"
                                        className="size-8"
                                    />
                                </Link>
                            </div>
                            <div className="hidden md:block">
                                <div className="ml-10 flex items-baseline space-x-4">
                                    {navigation.map((item) => (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            className={`${item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                                } rounded-md px-3 py-2 text-sm font-medium`}
                                        >
                                            {item.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="-mr-2 flex md:hidden">
                            {/* Mobile menu button */}
                            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white ring-0focus:outline-hidden">
                                <span className="absolute -inset-0.5" />
                                <span className="sr-only">Open main menu</span>
                                <Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden" />
                                <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
                            </DisclosureButton>
                        </div>
                    </div>
                </div>

                {/* Mobile Start */}
                <DisclosurePanel className="md:hidden">
                    <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
                        {navigation.map((item) => (
                            <DisclosureButton
                                key={item.name}
                                as="a"
                                href={item.href}
                                aria-current={item.current ? 'page' : undefined}
                                className={`${item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                    } block rounded-md px-3 py-2 text-base font-medium`}
                            >
                                {item.name}
                            </DisclosureButton>
                        ))}
                    </div>
                </DisclosurePanel>
                {/* Mobile End */}
            </Disclosure>
        );
    } else {
        return (
            <>
                {Pathname !== '/login' && Pathname !== '/register' && Pathname !== '/logout' && (
                    <AuthChecker />
                )}
                <Disclosure as="nav" className="bg-gray-800 select-none">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 items-center justify-between">
                            <div className="flex items-center">
                                <div className="shrink-0">
                                    <Link href="/">
                                        <img
                                            alt="Drive Ogan Ilir"
                                            src="/favicon.png"
                                            className="size-8"
                                        />
                                    </Link>
                                </div>
                                <div className="hidden md:block">
                                    <div className="ml-10 flex items-baseline space-x-4">
                                        {navigation.map((item) => (
                                            <Link
                                                key={item.name}
                                                href={item.href}
                                                className={`${item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                                    } rounded-md px-3 py-2 text-sm font-medium`}
                                            >
                                                {item.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="hidden md:block">
                                <div className="ml-4 flex items-center md:ml-6">

                                    {/* Profile dropdown */}
                                    <Menu as="div" className="relative ml-3">
                                        <div>
                                            <MenuButton className="relative flex max-w-xs items-center rounded-full bg-gray-800 text-sm ring-0 focus:ring-0 focus:outline-hidden cursor-pointer group">
                                                <span className="absolute -inset-1.5" />
                                                <span className="sr-only">
                                                    Buka Menu
                                                </span>
                                                <img alt="" src={user.imageUrl} className="size-8 rounded-full" />
                                                <div className="text-start ml-2">
                                                    <div className="font-bold text-white whitespace-nowrap select-none">
                                                        {user.name}
                                                    </div>
                                                    <div className="text-xs text-gray-400 whitespace-nowrap select-none">
                                                        {user.email}
                                                    </div>
                                                </div>
                                            </MenuButton>
                                        </div>
                                        <MenuItems
                                            transition
                                            className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 ring-1 shadow-lg ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                                        >
                                            {userNavigation.map((item) => (
                                                <MenuItem key={item.name}>
                                                    <Link
                                                        href={item.href}
                                                        className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                                                    >
                                                        {item.name}
                                                    </Link>
                                                </MenuItem>
                                            ))}
                                        </MenuItems>
                                    </Menu>
                                </div>
                            </div>
                            <div className="-mr-2 flex md:hidden">
                                {/* Mobile menu button */}
                                <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white ring-0focus:outline-hidden">
                                    <span className="absolute -inset-0.5" />
                                    <span className="sr-only">Open main menu</span>
                                    <Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden" />
                                    <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
                                </DisclosureButton>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Start */}
                    <DisclosurePanel className="md:hidden">
                        <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
                            {navigation.map((item) => (
                                <DisclosureButton
                                    key={item.name}
                                    as="a"
                                    href={item.href}
                                    aria-current={item.current ? 'page' : undefined}
                                    className={`${item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                        } block rounded-md px-3 py-2 text-base font-medium`}
                                >
                                    {item.name}
                                </DisclosureButton>
                            ))}
                        </div>
                        <div className="border-t border-gray-700 pt-4 pb-3">
                            <div className="flex items-center px-5">
                                <div className="shrink-0">
                                    <img alt="" src={user.imageUrl} className="size-10 rounded-full" />
                                </div>
                                <div className="ml-3">
                                    <div className="text-base/5 font-medium text-white">{user.name}</div>
                                    <div className="text-sm font-medium text-gray-400">{user.email}</div>
                                </div>
                                {/* <button
                                    type="button"
                                    className="relative ml-auto shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden"
                                >
                                    <span className="absolute -inset-1.5" />
                                    <span className="sr-only">View notifications</span>
                                    <BellIcon aria-hidden="true" className="size-6" />
                                </button> */}
                            </div>
                            <div className="mt-3 space-y-1 px-2">
                                {userNavigation.map((item) => (
                                    <DisclosureButton
                                        key={item.name}
                                        as="a"
                                        href={item.href}
                                        className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                                    >
                                        {item.name}
                                    </DisclosureButton>
                                ))}
                            </div>
                        </div>
                    </DisclosurePanel>
                    {/* Mobile End */}
                </Disclosure>
            </>
        );
    }

}

export default Header;