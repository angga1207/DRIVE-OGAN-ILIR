import { getCookie } from "cookies-next";
import { serverDomain } from "./serverConfig";
import axios, { AxiosRequestConfig } from "axios";

var CurrentToken = getCookie('token');
const ServerDomain = serverDomain();

export async function getUsers(search: any = null) {
    try {
        const res = await axios.get(`${ServerDomain}/getUsers`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            },
            params: {
                search: search,
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

export async function createUser(data: any) {
    try {
        const res = await axios.post(`${ServerDomain}/createUser`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
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

export async function updateUser(data: any) {
    try {
        if (!data.id) {
            return {
                status: 'error',
                message: 'User ID is required'
            }
        }
        const res = await axios.post(`${ServerDomain}/updateUser/${data.id}`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
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

export async function updateUserAccess(id: any, access: any) {
    try {
        if (!id) {
            return {
                status: 'error',
                message: 'User ID is required'
            }
        }
        const res = await axios.post(`${ServerDomain}/updateUserAccess/${id}`, { access: access }, {
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