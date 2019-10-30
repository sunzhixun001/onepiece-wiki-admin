import { GET_ACCESS_TOKEN } from '../url';
import { appId, Secret } from '../../config';
const axios = require('axios');

interface TokenValue {
    token: string;
    expires: number;
};

// 获取接口调用凭据
const getAccessToken = async (): Promise<string> => {
    const value: string | null = localStorage.getItem("AccessToken");
    if( value === null ) {
        fetchGetAccessToken().then(token => {

        }).catch( error => {
            console.log("接口调用凭据出错", error);
        })
    }
    const obj: TokenValue = JSON.parse(value as string);
    const {token, expires} = obj;
    if(new Date().getTime() > expires) {
        console.log("access_token已过期");
        fetchGetAccessToken().then(token => {

        }).catch( error => {
            console.log("接口调用凭据出错", error);
        })
    }
    return obj.token;
};

// 从腾讯服务器获取调用凭据
const fetchGetAccessToken = async (): Promise<string> => {
    const now: number = new Date().getTime();
    const response = await axios.get(GET_ACCESS_TOKEN, {
        params: {
            // appid: appId,
            // secret: Secret,
            // grant_type: 'client_credential'
        }
    });
    console.log("接口调用凭据", response);
    const { data, status, statusText } = response;   
    const { access_token, expires_in, errcode, errmsg } = data;
    if (status !== 200 || statusText !== "OK") {
        throw new Error('error');
    }
    if(errcode !== 0 || errmsg !== "ok") {
        throw new Error(`${errcode}: ${errmsg}`);
    }
    localStorage.setItem("AccessToken", JSON.stringify({
        token: access_token,
        expires: now + (expires_in * 1000)
    }));  
    return access_token;
};

const getTokenExpires = (): string => {
    const value: string | null = localStorage.getItem("time");
    const obj: TokenValue = JSON.parse(value as string);
    return obj.token;
    // let date = new Date(value);
    // date.setHours(date.getHours() + 2);
    // return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
};

export {
    getTokenExpires,
    getAccessToken
};