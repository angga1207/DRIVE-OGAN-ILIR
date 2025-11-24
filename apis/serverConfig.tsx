import { decryptClient } from "@/lib/crypto-js";
import { createAxiosConfig } from "@/utils/apiHelpers";
import axios, { AxiosRequestConfig } from "axios";
import { getCookie, setCookie } from "cookies-next";

const staticToken = '1816|zDB4IWBoirDGP40onWgjyfd0uek16vrKYGSVw5qtbbd5bdf6';
// const staticToken = '999999|zDB4IWBoirDGP40onWgjyfd0uek16vrKYGSVw5qtbbd5bdf6';

// const serverDomain = 'https://drive-backend.oganilirkab.go.id/api/';

export function serverDomain() {
    const uri = 'http://127.0.0.1:8000/api';
    // const uri = 'https://drive-backend.oganilirkab.go.id/api';
    return uri;
}

export function clientDomain() {
    const uri = 'http://localhost:3000';
    // const uri = 'https://drive.oganilirkab.go.id';
    return uri;
}

export async function serverCheck() {
    try {
        // var CurrentToken = '';
        // if (typeof window !== 'undefined') {
        //     CurrentToken = document.cookie.split('token=')[1];
        // }

        // // CurrentToken = staticToken;
        // const CurrentToken = getCookie('token');

        // const res = await axios.post(serverDomain() + '/a12', {}, {
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'access-control-allow-origin': '*',
        //         // Authorization: `Bearer ${CurrentToken}`,
        //         Authorization: `Bearer ${decryptClient(CurrentToken as string)}`,
        //     }
        // })
        // const data = await res.data;

        // // setCookie('token', CurrentToken, { maxAge: 60 * 60 * 24 * 30 });
        // return data;

        const axiosConfig = await createAxiosConfig();

        const res = await axios.post(serverDomain() + '/a12', {}, axiosConfig);
        const data = await res.data;
        return data;

    } catch (error) {
        return {
            status: 'error',
            message: error
        }
    }
}