import React, { useState, useEffect } from 'react';
import { CharacterApi } from '../../../api'
import {
  List,
  Avatar,
  Drawer,
  Form,
  Input,
  Row,
  Col,
  Table,
  Button,
  Icon,
  message
} from 'antd';
import { CharacterSearchResponseValue, CharacterDetail, CharacterDetailShowEmpty, CharacterDetailShow } from '../../../interface/character';
import { Link } from 'react-router-dom';
import { renderRoutes, RouteConfig, RouteConfigComponentProps } from 'react-router-config';
import "./index.css";
import CharacterDetailScreen from "../detail";

const CharacterListScreen: React.FC<RouteConfigComponentProps<any>> = ({ route }) => {
  const [characters, setCharacters] = useState<CharacterSearchResponseValue[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [visibleDrawer, setVisibleDrawer] = useState<boolean>(false);
  const [id, setId] = useState<string>('');
  const [characterdetail, setCharacterdetail] = useState<CharacterDetailShow>(CharacterDetailShowEmpty);
  useEffect(() => {
    CharacterApi.getCharacterList(1, 20).then(result => {
      setCharacters(result.data);
      setTotal(result.pager.Total);
    });
  }, []);
  const onAddClick = () => {
    setCharacterdetail(CharacterDetailShowEmpty);
    setId('');
    setVisibleDrawer(true);
  };
  const onSearch = (value: string) => {
    CharacterApi.searchCharacterList(value).then(result => {
      setCharacters(result.data);
      setTotal(result.pager.Total);
    });
  };
  const onSave = (character: CharacterDetail): void => {
    if( id ) {
      CharacterApi.updateCharacterDoc(id, character).then(result => {
        if(result) {
          message.success('更新成功');
        } else {
          message.success('更新失败');
        }
      });
    } else {
      CharacterApi.addCharacterDoc(character).then(result => {
        if(result) {
          message.success('新增成功');
          setVisibleDrawer(false);
          onSearch(character.name);
        } else {
          message.success('新增失败');
        }
      });
    }
    // console.log(character);
  };
  const onRowClick = (id: string) => {
    CharacterApi.getCharacterDoc(id).then(detail => {
      setCharacterdetail(detail);
      setId(id); 
      setVisibleDrawer(true);
    })
  }
  return (
    <div className="character-wrap">
      <div>
        <Form>
          <Form.Item>
            <Row>
              <Col span={9}>
                <Input.Search 
                  enterButton="搜索"
                  addonBefore={<Icon type="plus-circle" onClick={onAddClick} />}
                  onSearch={onSearch}
                />
              </Col>
            </Row>
          </Form.Item>
        </Form>
      </div>
      <div className="item-list">
        <div className="item-list-main">
          <Table
            // itemLayout="horizontal"
            dataSource={characters}
            columns={[{
              title: '头像',
              dataIndex: 'download_url',
              render: url => <Avatar src={url}/>
            }, {
              title: '名字',
              dataIndex: 'fullname',
              render: fullname => fullname
            }]}
            rowKey={record => record.id}
            onRow={(record, index) => {
              return {
                onClick: event => {
                  onRowClick(record.id);
                }
              }
            }}
            // renderItem={item => (
            //   <List.Item key={item.id} onClick={() => {setId(item.id); setVisibleDrawer(true)}}>
            //     <List.Item.Meta 
            //       avatar={<Avatar src={item.download_url}/>}
            //       title={item.fullname}
            //     />
            //   </List.Item>
            // )}
            pagination={{
              position: "both",
              total: total,
              pageSize: 20
            }}
          />
        </div>
      </div>
      <Drawer
          title="Basic Drawer"
          placement="right"
          closable={true}
          visible={visibleDrawer}
          width="50%"
          onClose={() => setVisibleDrawer(false)}
        >
          <CharacterDetailScreen 
            id={id}
            save={onSave} 
            detail={characterdetail}
          />
        </Drawer>
    </div>
  );
};

export default CharacterListScreen;