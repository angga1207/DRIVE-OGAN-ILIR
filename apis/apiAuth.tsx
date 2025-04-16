import { getCookie } from "cookies-next";
import { serverDomain } from "./serverConfig";
import axios, { AxiosRequestConfig } from "axios";

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