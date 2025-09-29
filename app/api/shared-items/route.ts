import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { serverDomain } from '@/apis/serverConfig';
import { getBearerTokenForApi } from '@/utils/apiHelpers';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { cookies } from 'next/headers';
import { decryptClient } from '@/lib/crypto-js';

const ServerDomain = serverDomain();

export async function GET(request: NextRequest) {
  try {
    // Get search parameters from URL
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

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
      },
      params: {
        slug: slug
      }
    };

    // Make request to actual server
    const res = await axios.get(`${ServerDomain}/getItemsSharer`, axiosConfig);
    
    return NextResponse.json(res.data);
    
  } catch (error: any) {
    console.error('Error in /api/shared-items:', error);
    
    return NextResponse.json(
      { 
        status: 'error', 
        message: error.response?.data?.message || error.message || 'Internal server error'
      },
      { status: error.response?.status || 500 }
    );
  }
}