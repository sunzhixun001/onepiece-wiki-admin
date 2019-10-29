import React, { useState, useEffect} from 'react';
import './App.css';
import {AccessApi} from './api';
const axios = require('axios');

const App: React.FC = () => {
  const [value, setValue] = useState('');
  useEffect(() => {
    // const APPID = 'wxe59009a99d2c00a0';
    // const SECRET = 'ae2ec044a28288db7b9452b40e17e6ac';
    // const result = axios.get(`/cgi-bin/token?grant_type=client_credential&appid=${APPID}&secret=${SECRET}`);
    // console.log(result);
    AccessApi.getAccessToken().then(accesstoken => {
      setValue(accesstoken);
    });
  });
  let updateDate = function () {
    const date = new Date();
    const str = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    localStorage.setItem('time', str);
    setValue(str);
  };
  return (
    <div className="App">
      <div>token是：{value}</div>
      <div><button onClick={updateDate}>更新</button></div>
    </div>
  );
}

export default App;
