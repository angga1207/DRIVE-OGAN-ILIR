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

    // Configure axios request
    const axiosConfig = {
      headers: {
        'Content-Type': 'application/json',
      },
      params: {
        slug: slug
      }
    };

    // Make request to actual server
    const res = await axios.get(`${ServerDomain}/path`, axiosConfig);

    return NextResponse.json(res.data);

  } catch (error: any) {
    console.error('Error in /api/path:', error);

    return NextResponse.json(
      {
        status: 'error',
        message: error.response?.data?.message || error.message || 'Internal server error'
      },
      { status: error.response?.status || 500 }
    );
  }
}