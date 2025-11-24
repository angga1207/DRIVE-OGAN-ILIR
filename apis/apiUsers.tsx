import { getCookie } from "cookies-next";
import { serverDomain } from "./serverConfig";
import axios, { AxiosRequestConfig } from "axios";
import { decryptClient } from "@/lib/crypto-js";
import { createAxiosConfig, getBearerTokenForApi } from "@/utils/apiHelpers";

var CurrentToken = getCookie('token');
const ServerDomain = serverDomain();

export async function getUsers(search: any = null, page: number = 1, limit: number = 10) {
    try {
        const axiosConfig = await createAxiosConfig({
            params: {
                search: search,
                page: page,
                per_page: limit
            }
        });

        const res = await axios.get(`${ServerDomain}/v2/getUsers`, axiosConfig);
        const data = await res.data;
        return data;
        // const res = await axios.get(`${ServerDomain}/getUsers`, {
        //     headers: {
        //         'Content-Type': 'application/json',
        //         Authorization: `Bearer ${decryptClient(CurrentToken as string)}`,
        //     },
        //     params: {
        //         search: search,
        //     }
        // });
        // const data = await res.data;
        // return data;
    } catch (error) {
        return {
            status: 'error',
            message: error
        }
    }
}

export async function createUser(formData: any) {
    try {
        // Use Next.js API route instead of direct server call
        const url = '/api/createUser';

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
            body: JSON.stringify(formData),
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

export async function updateUser(data: any) {
    try {
        const axiosConfig = await createAxiosConfig({
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${decryptClient(CurrentToken as string)}`,
            }
        });

        if (!data.id) {
            return {
                status: 'error',
                message: 'User ID is required'
            }
        }
        const res = await axios.post(`${ServerDomain}/updateUser/${data.id}`, data, axiosConfig);
        const response = await res.data;
        return response;

    } catch (error) {
        return {
            status: 'error',
            message: error
        }
    }
}

// export async function updateUserAccess(id: any, access: any) {
//     try {
//         const axiosConfig = await createAxiosConfig({
//             headers: {
//                 'Content-Type': 'application/json',
//             }
//         });

//         if (!id) {
//             return {
//                 status: 'error',
//                 message: 'User ID is required'
//             }
//         }
//         const res = await axios.post(`${ServerDomain}/updateUserAccess/${id}`, { access: access }, axiosConfig);
//         const response = await res.data;
//         return response;

//         // if (!id) {
//         //     return {
//         //         status: 'error',
//         //         message: 'User ID is required'
//         //     }
//         // }
//         // const res = await axios.post(`${ServerDomain}/updateUserAccess/${id}`, { access: access }, {
//         //     headers: {
//         //         'Content-Type': 'application/json',
//         //         Authorization: `Bearer ${decryptClient(CurrentToken as string)}`,
//         //     }
//         // });
//         // const response = await res.data;
//         // return response;
//     } catch (error) {
//         return {
//             status: 'error',
//             message: error
//         }
//     }
// }

export async function updateUserAccess(id: any, access: any) {
    try {
        // Use Next.js API route instead of direct server call
        const url = ServerDomain + '/updateUserAccess/' + id;

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
                access: access
            }),
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

export async function deleteUser(id: any) {
    try {
        const axiosConfig = await createAxiosConfig();

        if (!id) {
            return {
                status: 'error',
                message: 'User ID is required'
            }
        }
        const res = await axios.delete(`${ServerDomain}/deleteUser/${id}`, axiosConfig);
        const response = await res.data;
        return response;
        // if (!id) {
        //     return {
        //         status: 'error',
        //         message: 'User ID is required'
        //     }
        // }
        // const res = await axios.delete(`${ServerDomain}/deleteUser/${id}`, {
        //     headers: {
        //         'Content-Type': 'application/json',
        //         Authorization: `Bearer ${decryptClient(CurrentToken as string)}`,
        //     }
        // });
        // const response = await res.data;
        // return response;
    } catch (error) {
        return {
            status: 'error',
            message: error
        }
    }
}