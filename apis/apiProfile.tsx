import { getCookie } from "cookies-next";
import { serverDomain } from "./serverConfig";
import axios, { AxiosRequestConfig } from "axios";

var CurrentToken = getCookie('token');
const ServerDomain = serverDomain();

export async function updateProfile(data: any) {
    try {
        const res = await axios.post(`${ServerDomain}/updateProfile`, data, {
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

export async function getActivities(page: any = 1) {
    try {
        const res = await axios.get(`${ServerDomain}/getActivities`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            },
            params: {
                page: page
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