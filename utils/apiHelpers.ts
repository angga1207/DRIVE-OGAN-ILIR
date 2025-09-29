import { getSession } from "next-auth/react";
import { getCookie } from "cookies-next";
import { decryptClient } from "@/lib/crypto-js";

// Utility function untuk mendapatkan token dari session atau cookie
export async function getBearerTokenForApi() {
  try {
    // Coba ambil dari session NextAuth terlebih dahulu
    const session = await getSession();
    if (session?.accessToken) {
      return session.accessToken;
    }

    // Fallback ke cookie jika session tidak tersedia
    const cookieToken = getCookie('token');
    if (cookieToken) {
      return decryptClient(cookieToken as string);
    }

    return null;
  } catch (error) {
    console.error('Error getting bearer token:', error);
    return null;
  }
}

// Helper function untuk membuat axios config dengan token
export async function createAxiosConfig(additionalConfig: any = {}) {
  const token = await getBearerTokenForApi();

  return {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...additionalConfig.headers,
    },
    ...additionalConfig,
  };
}

// Helper function untuk membuat axios config dengan token dan content type multipart/form-data
export async function createAxiosConfigMultipart(additionalConfig: any = {}) {
  const token = await getBearerTokenForApi();

  return {
    headers: {
      'Content-Type': 'multipart/form-data',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...additionalConfig.headers,
    },
    ...additionalConfig,
  };
}