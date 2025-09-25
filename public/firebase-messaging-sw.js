// eslint-disable-next-line no-undef
importScripts('https://www.gstatic.com/firebasejs/8.8.0/firebase-app.js');
// eslint-disable-next-line no-undef
importScripts('https://www.gstatic.com/firebasejs/8.8.0/firebase-messaging.js');

const firebaseConfig = {
    apiKey: "AIzaSyAjlTezwus94viuYpyMtaKMyYffaG7tqZM",
    authDomain: "drive-ogan-ilir-7d2de.firebaseapp.com",
    projectId: "drive-ogan-ilir-7d2de",
    storageBucket: "drive-ogan-ilir-7d2de.firebasestorage.app",
    messagingSenderId: "372949415786",
    appId: "1:372949415786:web:e42244f7e21c464b1a1713",
    measurementId: "G-E4BNKCWEBH"
};
// eslint-disable-next-line no-undef
firebase.initializeApp(firebaseConfig);
// eslint-disable-next-line no-undef
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log(
        '[firebase-messaging-sw.js] Received background message ',
        payload
    );
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: './logo.png',
    };
    self.registration.showNotification(notificationTitle, notificationOptions);
});
