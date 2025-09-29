import { getBearerTokenForApi } from "@/utils/apiHelpers";

export async function getPath(slug: any = null) {
    try {
        // Use Next.js API route instead of direct server call
        const params = new URLSearchParams();
        if (slug) {
            params.append('slug', slug);
        }
        
        const url = `/api/getPath${params.toString() ? '?' + params.toString() : ''}`;
        
        // Get bearer token for authorization
        const token = await getBearerTokenForApi();
        const headers: any = {
            'Content-Type': 'application/json',
        };
        
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        const res = await fetch(url, {
            method: 'GET',
            headers: headers,
        });
        
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        return data;
    } catch (error) {
        return {
            status: 'error',
            message: error
        }
    }
}

export async function getItems(slug: any = null, sort: any = 'created_at', order: any = 'asc') {
    try {
        // Use Next.js API route instead of direct server call
        const params = new URLSearchParams();
        if (slug) {
            params.append('slug', slug);
        }
        if (sort) {
            params.append('sort', sort);
        }
        if (order) {
            params.append('order', order);
        }
        
        const url = `/api/getItems${params.toString() ? '?' + params.toString() : ''}`;
        
        // Get bearer token for authorization
        const token = await getBearerTokenForApi();
        const headers: any = {
            'Content-Type': 'application/json',
        };
        
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        const res = await fetch(url, {
            method: 'GET',
            headers: headers,
        });
        
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        return data;
    } catch (error) {
        return {
            status: 'error',
            message: error
        }
    }
}

export async function getFavoriteItems(slug: any = null) {
    try {
        // Use Next.js API route instead of direct server call
        const params = new URLSearchParams();
        if (slug) {
            params.append('slug', slug);
        }
        
        const url = `/api/getFavoriteItems${params.toString() ? '?' + params.toString() : ''}`;
        
        // Get bearer token for authorization
        const token = await getBearerTokenForApi();
        const headers: any = {
            'Content-Type': 'application/json',
        };
        
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        const res = await fetch(url, {
            method: 'GET',
            headers: headers,
        });
        
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        return data;
    } catch (error) {
        return {
            status: 'error',
            message: error
        }
    }
}

export async function getTrashItems() {
    try {
        // Use Next.js API route instead of direct server call
        const url = '/api/getItemsTrashed';
        
        // Get bearer token for authorization
        const token = await getBearerTokenForApi();
        const headers: any = {
            'Content-Type': 'application/json',
        };
        
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        const res = await fetch(url, {
            method: 'GET',
            headers: headers,
        });
        
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        return data;
    } catch (error) {
        return {
            status: 'error',
            message: error
        }
    }
}

export async function postMakeFolder(slug: any, name: any) {
    try {
        // Use Next.js API route instead of direct server call
        const url = '/api/folder';
        
        // Get bearer token for authorization
        const token = await getBearerTokenForApi();
        const headers: any = {
            'Content-Type': 'application/json',
        };
        
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        const res = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                name: name,
                parent_slug: slug
            })
        });
        
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        return data;
    } catch (error) {
        return {
            status: 'error',
            message: error
        }
    }
}

export async function postRename(slug: any = null, name: any = null) {
    try {
        // Use Next.js API route with slug in URL
        const url = `/api/rename/${slug}`;
        
        // Get bearer token for authorization
        const token = await getBearerTokenForApi();
        const headers: any = {
            'Content-Type': 'application/json',
        };
        
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        const res = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                name: name
            })
        });
        
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        return data;
    } catch (error) {
        return {
            status: 'error',
            message: error
        }
    }
}

export async function postDelete(ids: any) {
    try {
        // Use Next.js API route instead of direct server call
        const url = '/api/delete';
        
        // Get bearer token for authorization
        const token = await getBearerTokenForApi();
        const headers: any = {
            'Content-Type': 'application/json',
        };
        
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        const res = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                ids: ids
            })
        });
        
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        return data;
    } catch (error) {
        return {
            status: 'error',
            message: error
        }
    }
}

export async function postForceDelete(ids: any) {
    try {
        // Use Next.js API route instead of direct server call
        const url = '/api/force-delete';
        
        // Get bearer token for authorization
        const token = await getBearerTokenForApi();
        const headers: any = {
            'Content-Type': 'application/json',
        };
        
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        const res = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({ ids })
        });
        
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        return data;
    } catch (error) {
        return {
            status: 'error',
            message: error
        }
    }
}

export async function postRestore(ids: any) {
    try {
        // Use Next.js API route instead of direct server call
        const url = '/api/restore';
        
        // Get bearer token for authorization
        const token = await getBearerTokenForApi();
        const headers: any = {
            'Content-Type': 'application/json',
        };
        
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        const res = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({ ids })
        });
        
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        return data;
    } catch (error) {
        return {
            status: 'error',
            message: error
        }
    }
}

export async function postPublicity(slug: any = null, formData: any = null) {
    try {
        // Use Next.js API route instead of direct server call
        const url = `/api/publicity/${slug}`;
        
        // Get bearer token for authorization
        const token = await getBearerTokenForApi();
        const headers: any = {
            'Content-Type': 'application/json',
        };
        
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        const res = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({ 
                slug: slug,
                data: formData 
            })
        });
        
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        return data;
    } catch (error) {
        return {
            status: 'error',
            message: error
        }
    }
}

export async function getSharedItems(slug: any) {
    try {
        // Use Next.js API route instead of direct server call
        const params = new URLSearchParams();
        if (slug) {
            params.append('slug', slug);
        }
        
        const url = `/api/shared-items${params.toString() ? '?' + params.toString() : ''}`;
        
        // Get bearer token for authorization
        const token = await getBearerTokenForApi();
        const headers: any = {
            'Content-Type': 'application/json',
        };
        
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        const res = await fetch(url, {
            method: 'GET',
            headers: headers,
        });
        
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        return data;
    } catch (error) {
        return {
            status: 'error',
            message: error
        }
    }
}

export async function getSearch(search: any) {
    try {
        // Use Next.js API route instead of direct server call
        const params = new URLSearchParams();
        if (search) {
            params.append('search', search);
        }
        
        const url = `/api/getSearch${params.toString() ? '?' + params.toString() : ''}`;
        
        // Get bearer token for authorization
        const token = await getBearerTokenForApi();
        const headers: any = {
            'Content-Type': 'application/json',
        };
        
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        const res = await fetch(url, {
            method: 'GET',
            headers: headers,
        });
        
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        return data;
    } catch (error) {
        return {
            status: 'error',
            message: error
        }
    }
}

export async function postDownload(ids: any) {
    try {
        // Use Next.js API route instead of direct server call
        const url = '/api/download';
        
        // Get bearer token for authorization
        const token = await getBearerTokenForApi();
        const headers: any = {
            'Content-Type': 'application/json',
        };
        
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        const res = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({ ids })
        });
        
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        return data;
    } catch (error) {
        return {
            status: 'error',
            message: error
        }
    }
}

export async function getFolders(slug: any = '', excludeIds: any[] = []) {
    try {
        // Use Next.js API route instead of direct server call
        const params = new URLSearchParams();
        if (slug) {
            params.append('slug', slug);
        }
        if (excludeIds && excludeIds.length > 0) {
            params.append('excludeIds', JSON.stringify(excludeIds));
        }
        
        const url = `/api/getFolders${params.toString() ? '?' + params.toString() : ''}`;
        
        // Get bearer token for authorization
        const token = await getBearerTokenForApi();
        const headers: any = {
            'Content-Type': 'application/json',
        };
        
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        const res = await fetch(url, {
            method: 'GET',
            headers: headers,
        });
        
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        return data;
    } catch (error) {
        return {
            status: 'error',
            message: error
        }
    }
}

export async function moveItems(sourceIds: any[], targetId: any) {
    try {
        // Use Next.js API route instead of direct server call
        const url = '/api/moveItem';
        
        // Get bearer token for authorization
        const token = await getBearerTokenForApi();
        const headers: any = {
            'Content-Type': 'application/json',
        };
        
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        const res = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({ 
                sourceIds: sourceIds,
                targetId: targetId 
            })
        });
        
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        return data;
    } catch (error) {
        return {
            status: 'error',
            message: error
        }
    }
}

export async function setFavorite(ids: any[], status: boolean = true) {
    try {
        // Use Next.js API route instead of direct server call
        const url = '/api/set-favorite';
        
        // Get bearer token for authorization
        const token = await getBearerTokenForApi();
        const headers: any = {
            'Content-Type': 'application/json',
        };
        
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        const res = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({ 
                ids: ids,
                status: status 
            })
        });
        
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        return data;
    } catch (error) {
        return {
            status: 'error',
            message: error
        }
    }
}
