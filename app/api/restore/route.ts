import { NextRequest, NextResponse } from 'next/server';
import { getToken } from "next-auth/jwt";
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
    try {
        // Get authorization token with 3-layer fallback
        let token = null;
        
        // 1. Try Authorization header
        const authHeader = request.headers.get('Authorization');
        if (authHeader?.startsWith('Bearer ')) {
            token = authHeader.substring(7);
        }
        
        // 2. Try NextAuth session if no header token
        if (!token) {
            const nextAuthToken = await getToken({ 
                req: request,
                secret: process.env.NEXTAUTH_SECRET 
            });
            if (nextAuthToken?.accessToken) {
                token = nextAuthToken.accessToken as string;
            }
        }
        
        // 3. Try encrypted cookies as last resort
        if (!token) {
            const cookieStore = await cookies();
            const encryptedToken = cookieStore.get('authToken')?.value;
            if (encryptedToken) {
                // Import crypto functions dynamically to avoid build issues
                const { decryptClient } = await import('@/lib/crypto-js');
                try {
                    token = decryptClient(encryptedToken);
                } catch (error) {
                    console.error('Failed to decrypt token:', error);
                }
            }
        }
        
        if (!token) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Get request body
        const body = await request.json();
        const { ids } = body;

        // Make request to Laravel backend
        const backendUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/restore`;
        
        const response = await fetch(backendUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ ids })
        });

        if (!response.ok) {
            throw new Error(`Backend responded with status: ${response.status}`);
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error('Restore API error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}