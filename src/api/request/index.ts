import { message } from 'antd';
import { getAccessToken } from '../access';
import { FileRequestValue } from '../../interface/file';
import { QueryResponseValue, QueryResult } from '../../interface/common';
const axios = require('axios');

const errcodes = new Map();
errcodes.set(40101, '缺少必填参数');
errcodes.set(-605101, '微信后台 HTTP API 错误：查询语句解析失败');

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
};
interface DLResponseFileValue {
    fileid: string,
    download_url: string,
    status: number,
    errmsg: string
};
interface DLResponseValue {
    errcode: number,
    errmsg: string,
    file_list: DLResponseFileValue[]
};
// databaseUpdate返回结构
interface UpdateResponseValue {
    errcode: number,	// 错误码
    errmsg:	string,	    // 错误信息
    matched: number,    // 更新条件匹配到的结果数
    modified: number,   // 修改的记录数，注意：使用set操作新插入的数据不计入修改数目
    id: string          // 新插入记录的id，注意：只有使用set操作新插入数据时这个字段会有值
};
interface DeleteResponseValue {
    errcode: number,	// 错误码
    errmsg:	string,	    // 错误信息
    deleted: number,    // 删除记录数量
};
interface AddResposneValue {
    errcode: number	        // 错误码
    errmsg: string	        // 错误信息
    id_list: string[]	// 插入成功的数据集合主键_id。
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

async function post<T>(url: string, params: object): Promise<T> {
    const response = await instance.post(url, {
        ...params
    });
    const data = response.data as T; 
    return data;
};
async function requestApi<T>(url: string, param: string): Promise<T>;
async function requestApi<T>(url: string, param: FileRequestValue[]): Promise<T>;
async function requestApi<T>(url: string, param: string | FileRequestValue[]): Promise<any> {
    const token = await getAccessToken();
    if(typeof param == 'string') {
        const response:T = await post(`${url}?access_token=${token}`, {
            env: 'develop-6e54e7',
            query: param
        });
        return response;
    } else {
        const response:T = await post(`${url}?access_token=${token}`, {
            env: 'develop-6e54e7',
            file_list: param
        });
        return response;
    }
}

const query = async (query: string): Promise<QueryResult> => {
    const response = await requestApi<QueryResponseValue>("/tcb/databasequery", query);
    const { data, errcode, errmsg, pager } = response;
    if( errcode ) {
        message.error(errcodes.get(errcode) || `${errcode}: ${errmsg}`);
        throw new Error(errmsg);
    }
    return {
        data,
        pager: pager
    }; 
};
const dl = async (request_file_list: FileRequestValue[]): Promise<DLResponseFileValue[]> => {
    const response = await requestApi<DLResponseValue>("/tcb/batchdownloadfile", request_file_list);
    const { file_list, errcode, errmsg } = response;
    if( errcode ) {
        message.error(errcodes.get(errcode) || `${errcode}: ${errmsg}`);
        throw new Error(errmsg);
    }
    return file_list;
};
const update = async (query: string): Promise<number> => {
    const response = await requestApi<UpdateResponseValue>("/tcb/databaseupdate", query);
    const { matched, modified, errcode, errmsg } = response;
    if( errcode ) {
        message.error(errcodes.get(errcode) || `${errcode}: ${errmsg}`);
        throw new Error(errmsg);
    }
    return modified;
};
const del = async (query: string): Promise<number> => {
    const response = await requestApi<DeleteResponseValue>("/tcb/databasedelete", query);
    const { deleted, errcode, errmsg } = response;
    if( errcode ) {
        message.error(errcodes.get(errcode) || `${errcode}: ${errmsg}`);
        throw new Error(errmsg);
    }
    return deleted;
};
const add = async (query: string): Promise<string[]> => {
    const response = await requestApi<AddResposneValue>("/tcb/databaseadd", query);
    const { id_list, errcode, errmsg } = response;
    if( errcode ) {
        message.error(errcodes.get(errcode) || `${errcode}: ${errmsg}`);
        throw new Error(errmsg);
    }
    return id_list;
}

export default {
    add,
    dl,
    get,
    post,
    query,
    update,
    del
};
