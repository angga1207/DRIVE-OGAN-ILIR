import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { serverDomain } from '@/apis/serverConfig';
import { getBearerTokenForApi } from '@/utils/apiHelpers';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { cookies } from 'next/headers';
import { decryptClient } from '@/lib/crypto-js';

const ServerDomain = serverDomain();

export async function POST(
    request: NextRequest,
    { params }: { params: { slug: string } }
) {
    try {
        // Get request body
        const body = await request.json();
        const { slug: bodySlug, data: formData } = body;
        
        // Use slug from params or body
        const slug = params.slug || bodySlug;

        // Get bearer token - multiple fallback methods
        let bearerToken;
        
        // 1. Try from Authorization header
        const authHeader = request.headers.get('authorization');
        if (authHeader && authHeader.startsWith('Bearer ')) {
            bearerToken = authHeader.substring(7);
        }
        
        // 2. Try from NextAuth session
        if (!bearerToken) {
            try {
                const session = await getServerSession(authOptions);
                if (session?.accessToken) {
                    bearerToken = session.accessToken;
                }
            } catch (error) {
                console.log('Session check failed:', error);
            }
        }
        
        // 3. Try from cookies directly
        if (!bearerToken) {
            try {
                const cookieStore = await cookies();
                const tokenCookie = cookieStore.get('token');
                if (tokenCookie) {
                    bearerToken = decryptClient(tokenCookie.value);
                }
            } catch (error) {
                console.log('Cookie token decryption failed:', error);
            }
        }

        if (!bearerToken) {
            return NextResponse.json(
                { status: 'error', message: 'No authentication token found' },
                { status: 401 }
            );
        }

        // Configure axios request
        const axiosConfig = {
            headers: {
                'Authorization': `Bearer ${bearerToken}`,
                'Content-Type': 'application/json',
            }
        };

        // Make POST request to actual server
        const res = await axios.post(`${ServerDomain}/publicity/${slug}`, {
            slug: slug,
            data: formData
        }, axiosConfig);
        
        return NextResponse.json(res.data);
        
    } catch (error: any) {
        console.error('Error in /api/publicity:', error);
        
        return NextResponse.json(
            { 
                status: 'error', 
                message: error.response?.data?.message || error.message || 'Internal server error'
            },
            { status: error.response?.status || 500 }
        );
    }
}