import { message } from 'antd';
const axios = require('axios');

const instance = axios.create({
    timeout: 5000,
    responseType: 'json'
});
interface errorValue {
    response: {
        config: {
            method: string,
            url: string
        },
        status: number,
        statusText: string
    }
}
interface responseDataValue {
    data: any,
    errcode: number,
    errmsg: string
}
instance.interceptors.response.use((response: any) => {
    console.log("网略请求响应结果：", {...response, toString: null});
    return response;
}, (error: errorValue) => {
    const { response } = error;
    const { status } = response;
    message.error(status);
    console.log({
        ...error,
        toString: ''
    });
    return Promise.reject(error)
});

const get = async (url: string, params: object) => {
    try {
        const response = await instance.get(url, {
            params: {
                ...params
            }
        });
        const { data } = response; 
        return data
    } catch (error) {
        console.log("发送网略请求出错：", error);
    }
    
};

const post = async (url: string, params: object) : Promise<responseDataValue> => {
    const response = await instance.post(url, {
        ...params
    });
    const data = response.data as responseDataValue; 
    return data;
    // try {
    //     const response = await instance.post(url, {
    //         ...params
    //     });
    //     const data = response.data as responseDataValue; 
    //     return data;
    // } catch (error) {
    //     console.log("发送网略请求出错：", error);
    // }
}

export default {
    get,
    post
};
