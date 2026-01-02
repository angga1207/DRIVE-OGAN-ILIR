import { getCookie } from "cookies-next";
import { serverDomain } from "./serverConfig";
import axios, { AxiosRequestConfig } from "axios";
import { decryptClient } from "@/lib/crypto-js";
import { createAxiosConfig, createAxiosConfigMultipart } from "@/utils/apiHelpers";

var CurrentToken = getCookie('token');
const ServerDomain = serverDomain();

export async function updateProfile(data: any) {
    try {
        // const axiosConfig = await createAxiosConfigMultipart({
        //     headers: {
        //         'Content-Type': 'multipart/form-data',
        //     }
        // });

        // const res = await axios.post(`${ServerDomain}/updateProfile`, data, axiosConfig);
        // const response = await res.data;
        // return response;
        const res = await axios.post(`${ServerDomain}/updateProfile`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
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

export async function getActivities(page: any = 1) {
    try {
        const axiosConfig = await createAxiosConfig({
            params: {
                page: page
            }
        });

        const res = await axios.get(`${ServerDomain}/getActivities`, axiosConfig);
        const data = await res.data;
        return data;

        // const res = await axios.get(`${ServerDomain}/getActivities`, {
        //     headers: {
        //         'Content-Type': 'application/json',
        //         Authorization: `Bearer ${decryptClient(CurrentToken as string)}`,
        //     },
        //     params: {
        //         page: page
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

export async function postDeleteAccount(password: string) {
    try {
        const res = await axios.post(`${ServerDomain}/deleteMySelf`, {
            password: password
        }, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${decryptClient(CurrentToken as string)}`,
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