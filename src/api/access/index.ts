import { message } from 'antd';
import { GET_ACCESS_TOKEN } from '../url';
import { appId, Secret } from '../../config';
import request from '../request';
import { string } from 'prop-types';
const axios = require('axios');

const AccessTokenErrors = new Map<number, string>();
AccessTokenErrors.set(-1, "系统繁忙，此时请开发者稍候再试");
AccessTokenErrors.set(0, "请求成功");
AccessTokenErrors.set(40001, "AppSecret 错误或者 AppSecret 不属于这个小程序，请开发者确认 AppSecret 的正确性");
AccessTokenErrors.set(40002, "请确保 grant_type 字段值为 client_credential");
AccessTokenErrors.set(40013, "不合法的 AppID，请开发者检查 AppID 的正确性，避免异常字符，注意大小写");

interface TokenValue {
    token: string;
    expires: number;
};

// 获取接口调用凭据
const getAccessToken = async (): Promise<string> => {
    const access = getLocal();
    let token: string = '';
    if(access === null) {
        const fetch_token = await fetchGetAccessToken();
        token = fetch_token;
    } else {
        token = access.token;
    }
    return token;
};

// 从腾讯服务器获取调用凭据
const fetchGetAccessToken = async (): Promise<string> => {
    const now: number = new Date().getTime();
    let result: string = "";
    const data = await request.get(GET_ACCESS_TOKEN, {
            appid: appId,
            secret: Secret,
            grant_type: 'client_credential'
        }
    );
    const { access_token, expires_in, errcode, errmsg } = data;
    if (errcode && errcode !== 0) {
        const errorTxt = AccessTokenErrors.get(errcode) || errmsg;
        message.error(errorTxt);
        throw new Error(errorTxt);
    } else {
        setLocal(access_token, now + (expires_in * 1000));
        result = access_token;
    }
    return result;
};
// 从localStorage获取调用凭据
const getLocal = (): TokenValue | null => {
    let value: string | null = localStorage.getItem("AccessToken");
    value = value || "null";
    const obj: TokenValue | null = JSON.parse(value);
    if ( obj === null )
        return null;
    const {expires, token } = obj;
    if( overExpires(expires) ) {
        return null;
    }
    return obj;
}
// 存入localStorage
const setLocal = (token: string, expires: number): void => {
    localStorage.setItem("AccessToken", JSON.stringify({
        token: token,
        expires: expires
    })); 
};
// 判断是否超时
const overExpires = (expires: number) => {
    return new Date().getTime() > expires;
}
export {
    getAccessToken
};