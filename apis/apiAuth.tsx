import { getCookie } from "cookies-next";
import { serverDomain } from "./serverConfig";
import axios, { AxiosRequestConfig } from "axios";
import { decryptClient } from "@/lib/crypto-js";

var CurrentToken = getCookie('token');
const ServerDomain = serverDomain();


export async function loggedWithGoogle(data: any) {
    try {
        const res = await axios.post(`${ServerDomain}/login/google`, data, {
            headers: {
                'Content-Type': 'application/json',
                // Authorization: `Bearer ${CurrentToken}`,
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

export async function attempLogin(data: any) {
    try {
        const res = await axios.post(`${ServerDomain}/login`, data, {
            headers: {
                'Content-Type': 'application/json',
                // Authorization: `Bearer ${CurrentToken}`,
            }
        });
        const dataRes = await res.data;
        return dataRes;
    } catch (error) {
        return {
            status: 'error',
            message: error
        }
    }
}

export async function autoLogin(data: any) {
    try {
        const res = await axios.post(`${ServerDomain}/auto-login`, data, {
            headers: {
                'Content-Type': 'application/json',
                // Authorization: `Bearer ${CurrentToken}`,
            }
        });
        const dataRes = await res.data;
        return dataRes;
    } catch (error) {
        return {
            status: 'error',
            message: error
        }
    }
}

export async function atempLoginSemesta(data: any) {
    try {
        const res = await axios.post(`${ServerDomain}/login/semesta`, data, {
            headers: {
                'Content-Type': 'application/json',
                // Authorization: `Bearer ${CurrentToken}`,
            }
        });
        const dataRes = await res.data;
        return dataRes;
    } catch (error) {
        return {
            status: 'error',
            message: error
        }
    }
}


export async function syncWithGoogle(data: any) {
    try {
        const res = await axios.post(`${ServerDomain}/sync/google`, data, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${decryptClient(CurrentToken as string)}`,
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

export async function syncWithSemesta(data: any) {
    try {
        const res = await axios.post(`${ServerDomain}/sync/semesta`, data, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${decryptClient(CurrentToken as string)}`,
            }
        });
        const dataRes = await res.data;
        return dataRes;
    } catch (error) {
        return {
            status: 'error',
            message: error
        }
    }
}