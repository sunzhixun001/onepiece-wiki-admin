import React, { useState, useEffect} from 'react';
import './App.css';
import routers from './pages/router-config';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';
import { renderRoutes } from "react-router-config";

const axios = require('axios');

const App: React.FC = () => {
  const [value, setValue] = useState('');
  useEffect(() => {
    // AccessApi.getAccessToken().then(accesstoken => {
    //   console.log("accesstoken", accesstoken);
    // });
    // console.log("useEffect", new Date().getTime());
    // setValue("useEffect");
  }, []);
  return (
    <Router>
      {renderRoutes(routers)}
    </Router>
  );
}

export default App;
