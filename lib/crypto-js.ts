import CryptoJS from "crypto-js";

const secret = process.env.NEXT_PUBLIC_ENCRYPT_SECRET || "dev";

export function encryptClient(text: string) {
    return CryptoJS.AES.encrypt(text, secret).toString();
}

export function decryptClient(cipher: string) {
    const bytes = CryptoJS.AES.decrypt(cipher, secret);
    return bytes.toString(CryptoJS.enc.Utf8);
}