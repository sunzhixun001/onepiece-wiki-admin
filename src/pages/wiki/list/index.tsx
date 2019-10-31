import React, { useState, useEffect } from 'react';
import { List } from 'antd';
import { WikiApi } from '../../../api';
import {
    Link
  } from 'react-router-dom';
interface wikiValue {
    _id: string
}
const WikiListView: React.FC = () => {
    const [list, setList] = useState([]); 
    useEffect(() => {
        WikiApi.getWikiList(20, 1).then(data => {
            setList(data.map((d: string) => {
                return JSON.parse(d)
            }));
        });
    }, []);
    return (
        <List
            dataSource={list}
            renderItem={(item: wikiValue) => (
                <div><Link to={"/wiki/detail/" + item._id}>{item._id}</Link></div>
            )}
        />
    )
}

export default WikiListView;