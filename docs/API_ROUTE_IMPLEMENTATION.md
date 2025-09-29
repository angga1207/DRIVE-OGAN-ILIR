# API Route Implementation Guide

## Overview
Telah diimplementasikan API Routes untuk `getItems` dan `getPath` menggunakan Next.js App Router untuk memindahkan logic API call dari client ke server.

## Struktur File Baru

### API Routes
- `/app/api/items/route.ts` - Handles getItems requests
- `/app/api/path/route.ts` - Handles getPath requests

## How It Works

### Before (Direct Server Call)
```typescript
// Client langsung ke server external
Client -> External Server API
```

### After (Via API Route)
```typescript
// Client ke Next.js API Route, lalu ke server external
Client -> Next.js API Route -> External Server API
```

## Benefits

### 1. **Server-Side Processing**
- API calls sekarang diproses di server Next.js
- Mengurangi beban client-side processing
- Better error handling dan logging

### 2. **Security**
- Bearer token handling lebih aman di server
- External server URL tidak terexpose ke client
- Request headers bisa di-customize di server

### 3. **Caching & Performance**
- Bisa implement caching di level API route
- Server-side request optimization
- Reduced client-server roundtrips

### 4. **Monitoring & Debugging**
- Centralized logging di server
- Better error tracking
- Request/response monitoring

## Implementation Details

### API Route Structure
```typescript
// /app/api/items/route.ts & /app/api/path/route.ts
export async function GET(request: NextRequest) {
  // 1. Extract query parameters
  // 2. Get authentication (session/bearer token)  
  // 3. Forward request to external server
  // 4. Return response to client
}
```

### Client-Side Changes
```typescript
// apiResources.ts - getItems & getPath functions
export async function getItems(slug, sort, order) {
  // Use Next.js API route instead of direct server call
  const res = await fetch('/api/items?...');
  return res.json();
}

export async function getPath(slug) {
  // Use Next.js API route instead of direct server call  
  const res = await fetch('/api/path?...');
  return res.json();
}
```

## Authentication Flow

### Server-Side Token Handling
1. **NextAuth Session**: Primary method using `getServerSession()`
2. **Bearer Token Extraction**: From session or Authorization header
3. **Forward to External API**: With proper Authorization header

### Error Handling
- 401: No authentication token found
- 500: Server errors with detailed logging
- Pass-through: External server error responses

## API Route Features

### Query Parameters Support
- **getItems**: `slug`, `sort`, `order`
- **getPath**: `slug`

### Headers Management
- Automatic `Authorization: Bearer <token>` header
- `Content-Type: application/json`
- Custom headers bisa ditambahkan

### Error Responses
```json
{
  "status": "error",
  "message": "Error description"
}
```

## Usage Examples

### Client-Side Calls (Unchanged)
```typescript
// Existing code tetap bekerja
const items = await getItems('folder-slug', 'created_at', 'desc');
const path = await getPath('folder-slug');
```

### API Route Endpoints
```
GET /api/items?slug=folder&sort=name&order=asc
GET /api/path?slug=folder
```

## Monitoring & Debugging

### Server Logs
- Console.error untuk semua API route errors
- Request parameters logging
- External API response status

### Network Tab
- Client hanya melihat calls ke `/api/items` dan `/api/path`
- External server calls tersembunyi dari browser
- Cleaner network debugging

## Future Enhancements

### 1. Caching
```typescript
// Add Redis/memory caching
const cached = await cache.get(cacheKey);
if (cached) return NextResponse.json(cached);
```

### 2. Rate Limiting
```typescript
// Add rate limiting per user/IP
const rateLimited = await checkRateLimit(userId);
if (rateLimited) return NextResponse.json({...}, {status: 429});
```

### 3. Request Validation
```typescript
// Add Zod schema validation
const validParams = schema.parse(searchParams);
```

### 4. Response Transformation
```typescript
// Transform external API response
const transformedData = transformResponse(externalData);
return NextResponse.json(transformedData);
```

## Security Benefits

### 1. **Hidden External APIs**
- External server URLs tidak terexpose ke client
- API structure tersembunyi dari browser

### 2. **Server-Side Token Management**
- Bearer tokens di-handle server-side
- No token exposure di client network calls

### 3. **Request Sanitization**
- Parameter validation di server
- Injection attack prevention

### 4. **CORS Management**
- Bypass CORS issues dengan server-side requests
- Better cross-origin handling

## Migration Checklist

- ✅ Create `/app/api/items/route.ts`
- ✅ Create `/app/api/path/route.ts`  
- ✅ Update `getItems()` in `apiResources.ts`
- ✅ Update `getPath()` in `apiResources.ts`
- ✅ Test functionality (recommended)
- ✅ Monitor server logs
- ⏳ Add caching (optional)
- ⏳ Add rate limiting (optional)

## Testing

### Manual Testing
1. Open browser DevTools Network tab
2. Navigate app yang menggunakan getItems/getPath
3. Verify calls go to `/api/items` dan `/api/path`
4. Check server logs untuk external API calls

### Error Testing
1. Test tanpa authentication
2. Test dengan invalid parameters
3. Test server external down scenario