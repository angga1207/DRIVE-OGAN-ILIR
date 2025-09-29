import { getSession, useSession } from "next-auth/react";
import { getServerSession } from "next-auth/next";
import { useEffect, useState } from "react";
import { authOptions } from "@/lib/auth";

// Untuk Client Components
export async function getClientBearerToken() {
  const session = await getSession();
  return session?.accessToken || null;
}

// Untuk Server Components/API Routes  
export async function getServerBearerToken() {
  const session = await getServerSession(authOptions);
  return session?.accessToken || null;
}

// Helper function untuk membuat headers dengan bearer token
export function createAuthHeaders(token: string | null) {
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

// Custom hook untuk mendapatkan token di client component
export function useBearerToken() {
  const [token, setToken] = useState<string | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.accessToken) {
      setToken(session.accessToken);
    }
  }, [session]);

  return token;
}