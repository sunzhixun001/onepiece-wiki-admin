import React, { useState, useEffect } from 'react';
import { 
    List,
    Button,
    Drawer,
    Row,
    Col,
    Input,
    Icon,
    message
 } from 'antd';
import { WikiApi } from '../../../api';
import {
    Link,
    useHistory
  } from 'react-router-dom';
import { renderRoutes, RouteConfig, RouteConfigComponentProps } from "react-router-config";
import { WikiListItem, WikiGetDocResponseValue, WikiGetDocResponseEmptyObject, WikiUpdateRequestValue } from '../../../interface/wiki';
import WikiDetailScreen from '../detail';

const WikiListView: React.FC<RouteConfigComponentProps<any>> = ({ route }) => {
    const [list, setList] = useState<WikiListItem[]>([]); 
    const [total, setTotal] = useState<number>(0);
    const [id, setId] = useState<string>("");
    const [visibleDetail, setVisibleDetail] = useState<boolean>(false);
    const [detail, setDetail] = useState<WikiGetDocResponseValue>(WikiGetDocResponseEmptyObject);
    let history = useHistory();
    useEffect(() => {
        fetchGetWikiList(1);
    }, []);
    const fetchGetWikiList = (pageindex: number) => {
        WikiApi.getWikiList(pageindex * 20, 0).then(result => {
            setList(result.data);
            setTotal(result.pager.Total);
            // setList(data.map((d: string) => {
            //     return JSON.parse(d)
            // }));
        });
    };
    const listItemClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const id = event.currentTarget.getAttribute("data-id") || '';
        WikiApi.getDoc(id).then(result => {
            message.success('getDoc 成功');
            setDetail(result);
            setId(id || '');
            setVisibleDetail(true);
        });
    };
    const search = (value: string) => {
        WikiApi.searchWikiList(value).then(res => {
            setList(res.data);
            setTotal(res.pager.Total);
        });
    };
    const onAddClick = () => {
        setId("");
        setDetail(WikiGetDocResponseEmptyObject);
        setVisibleDetail(true);
    };
    const save = (wiki: WikiUpdateRequestValue) => {
        if( id) {
            try {
                WikiApi.updateDoc(id, wiki).then((result: boolean) => {
                    if(result) {
                      message.success('保存成功');
                    } else {
                      message.warning('保存不成功');
                    }
                  });
            } catch (error) {
                message.error(error);
            }
            
        } else {
            WikiApi.addDoc(wiki).then((result: string) => {
                if(result) {
                  message.success('添加成功');
                } else {
                  message.warning('添加不成功');
                }
              });
        }
    };
    return (
        <div>
            <Row>
                <Col span={8}>
                <Input.Search 
                    addonBefore={<Icon type="plus" onClick={onAddClick} />}
                    onSearch={search}
                />
                </Col>
            </Row>
            <List
                dataSource={list}
                renderItem={(item) => (
                    <List.Item 
                        onClick={listItemClick}
                        data-id={item.id}
                    >
                        {item.title}
                    </List.Item>
                )}
                pagination={{
                    onChange: page => {
                        fetchGetWikiList(page);
                    },
                    pageSize: 20,
                    total: total,
                    position: 'top'
                }}
            />
            <Drawer
                width="50%"
                onClose={()=>{setVisibleDetail(false)}}
                visible={visibleDetail}
            >
                <WikiDetailScreen 
                    id={id}
                    wiki={detail}
                    save={save}
                />
            </Drawer>
        </div>
    )
}

export default WikiListView;