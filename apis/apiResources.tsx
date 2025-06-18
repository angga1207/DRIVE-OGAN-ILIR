import { getCookie } from "cookies-next";
import { serverDomain } from "./serverConfig";
import axios, { AxiosRequestConfig } from "axios";

var CurrentToken = getCookie('token');
const ServerDomain = serverDomain();

export async function getPath(slug: any = null) {
    try {
        const res = await axios.get(`${ServerDomain}/getPath`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
                // Authorization: document.cookie,
            },
            params: {
                slug: slug
            }
        });
        const data = await res.data;
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
        const res = await axios.get(`${ServerDomain}/getItems`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            },
            params: {
                slug: slug,
                sort: sort,
                order: order
            }
        });
        const data = await res.data;
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
        const res = await axios.post(`${ServerDomain}/folder`, {
            name: name,
            parent_slug: slug
        }, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            }
        });
        const response = await res.data;
        return response;
    } catch (error) {
        return {
            status: 'error',
            message: error
        }
    }
}

export async function postRename(slug: any = null, name: any = null) {
    try {
        const res = await axios.post(`${ServerDomain}/rename/${slug}`, {
            slug: slug,
            name: name
        }, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            }
        });
        const data = await res.data;
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
        const res = await axios.post(`${ServerDomain}/delete`, {
            ids: ids
        }, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            }
        });
        const data = await res.data;
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
        const res = await axios.post(`${ServerDomain}/publicity/${slug}`, {
            slug: slug,
            data: formData
        }, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            }
        });
        const data = await res.data;
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
        const res = await axios.get(`${ServerDomain}/getItemsSharer`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            },
            params: {
                slug: slug
            }
        });
        const data = await res.data;
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
        const res = await axios.get(`${ServerDomain}/search`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            },
            params: {
                search: search
            }
        });
        const data = await res.data;
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
        const res = await axios.post(`${ServerDomain}/download`, {
            ids: ids
        }, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            }
        });
        const data = await res.data;
        return data;
    } catch (error) {
        return {
            status: 'error',
            message: error
        }
    }
}