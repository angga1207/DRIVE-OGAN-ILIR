// utils/crypto.ts
import crypto from "crypto";

// const algorithm = "aes-256-ctr";
// const secretKey = process.env.ENCRYPT_KEY || "my_secret_key_32_chars!!";
// const iv = crypto.randomBytes(16);

const password = process.env.ENCRYPT_PASSWORD || "dev-password";
const salt = process.env.ENCRYPT_SALT || "dev-salt";

// Hasil 32 byte untuk AES-256
function getKey() {
    // scryptSync lebih kuat daripada hash biasa
    return crypto.scryptSync(password, salt, 32); // <— 32 byte
}

export function encrypt(text: string) {
    const key = getKey();
    const iv = crypto.randomBytes(12); // 12 byte untuk GCM
    const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);

    const ciphertext = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);
    const tag = cipher.getAuthTag();

    // Simpan iv:tag:cipher dalam hex
    return [
        iv.toString("hex"),
        tag.toString("hex"),
        ciphertext.toString("hex"),
    ].join(":");
}

export function decrypt(payload: string) {
    const [ivHex, tagHex, dataHex] = payload.split(":");
    const key = getKey();

    const iv = Buffer.from(ivHex, "hex");
    const tag = Buffer.from(tagHex, "hex");
    const data = Buffer.from(dataHex, "hex");

    const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
    decipher.setAuthTag(tag);

    const decrypted = Buffer.concat([decipher.update(data), decipher.final()]);
    return decrypted.toString("utf8");
}