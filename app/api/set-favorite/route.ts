import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { serverDomain } from '@/apis/serverConfig';
import { getBearerTokenForApi } from '@/utils/apiHelpers';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { cookies } from 'next/headers';
import { decryptClient } from '@/lib/crypto-js';

const ServerDomain = serverDomain();

export async function POST(request: NextRequest) {
  try {
    // Get request body
    const body = await request.json();
    const { ids, status = true } = body;

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

    // Make request to actual server with JSON body
    const res = await axios.post(`${ServerDomain}/setFavorite`, {
      ids: ids,
      status: status
    }, axiosConfig);
    
    return NextResponse.json(res.data);
    
  } catch (error: any) {
    console.error('Error in /api/set-favorite:', error);
    
    return NextResponse.json(
      { 
        status: 'error', 
        message: error.response?.data?.message || error.message || 'Internal server error'
      },
      { status: error.response?.status || 500 }
    );
  }
}