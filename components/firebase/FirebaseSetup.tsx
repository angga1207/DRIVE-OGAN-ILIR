"use client"
import { getMessaging, onMessage } from 'firebase/messaging';
import firebaseApp from '@/utils/firebase/firebase';
import useFcmToken from '@/utils/hooks/useFcmToken';
import { useEffect, useState } from 'react';
import { serverDomain } from '@/apis/serverConfig';
import { getCookie } from 'cookies-next';
import Swal from 'sweetalert2'
import { decryptClient } from '@/lib/crypto-js';

const FirebaseSetup = () => {
    const ServerDomain = serverDomain();
    const CurrentToken = getCookie('token');

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const { fcmToken, notificationPermissionStatus } = useFcmToken();

    useEffect(() => {
        if (isMounted) {
            if (CurrentToken && fcmToken && notificationPermissionStatus === 'granted') {
                fetch(ServerDomain + '/fcm', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${decryptClient(CurrentToken as string)}`,
                    },
                    body: JSON.stringify({
                        fcmToken: fcmToken,
                    }),
                })
                    .then((response) => {
                    })
                    .then((data) => {
                    })
                    .catch((error) => {
                    });
            }
            if (notificationPermissionStatus === 'denied') {
                // showAlert('warning', 'Aktifkan notifikasi untuk mendapatkan informasi terbaru');

                const swalWithBootstrapButtons = Swal.mixin({
                    customClass: {
                        confirmButton: 'btn btn-success',
                        cancelButton: 'btn btn-slate-200 ltr:mr-3 rtl:ml-3',
                        popup: 'sweet-alerts',
                    },
                    buttonsStyling: false,
                });
                swalWithBootstrapButtons
                    .fire({
                        text: "Aktifkan notifikasi untuk mendapatkan informasi terbaru!",
                        position: 'top',
                        showCancelButton: true,
                        confirmButtonText: 'Aktifkan!',
                        cancelButtonText: 'Tidak!',
                        reverseButtons: true,
                        padding: '2em',
                    })
                    .then((result) => {
                        if (result.value) {
                            // swalWithBootstrapButtons.fire('Aktif', 'Notifikasi berhasil diaktifkan', 'success');
                            Notification.requestPermission().then((permission) => {
                                if (permission === 'granted') {
                                    Swal.fire({
                                        position: 'top',
                                        icon: 'success',
                                        title: 'Notifikasi berhasil diaktifkan',
                                        showConfirmButton: false,
                                        timer: 1500,
                                        padding: '2em',
                                    });
                                }
                            });
                        } else if (result.dismiss === Swal.DismissReason.cancel) {
                            // swalWithBootstrapButtons.fire('Batal', 'Pengaktifan notifikasi dibatalkan', 'info');
                        }
                    });
            }
        }
    }, [isMounted, fcmToken, notificationPermissionStatus]);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
            const messaging = getMessaging(firebaseApp);
            const unsubscribe = onMessage(messaging, (payload) => {
                // showAlert('info', payload?.notification?.body);
                Swal.fire({
                    title: payload?.notification?.title,
                    text: payload?.notification?.body,
                    icon: 'info',
                    position: 'top-end',
                    toast: true,
                    showConfirmButton: false,
                    timer: 6000,
                    // padding: '2em',
                });
            });
            return () => {
                unsubscribe(); // Unsubscribe from the onMessage event
            };
        }
    }, []);

    return (
        <>
        </>
    )
}

export default FirebaseSetup