import React, { useState, useEffect } from 'react';
import { TimelineApi } from '../../../api';
import { TimelinePut, Timeline, TimelineDownloadPhoto, TimelineInitValue } from '../../../interface/timeline';
import { 
  List,
  Drawer, 
  Row,
  Col,
  Input,
  message
} from 'antd';
import {
  CloseCircleOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import TimelineDeatilScreen from '../detail';
import './index.css';

const TimelineListScreen = () => {
  const [timelines, setTimelines] = useState<TimelineDownloadPhoto[]>([]);
  const [timeline, setTimeline] = useState<TimelineDownloadPhoto>(TimelineInitValue);
  const [id, setId] = useState<string>('');
  const [total, setTotal] = useState<number>(0);
  const [visibleDetail, setVisibleDetail] = useState<boolean>(false);
  const [keyword, setKeyword] = useState<string>('');
  const itemClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const id = event.currentTarget.getAttribute("data-id") || '';
    TimelineApi.getDoc(id).then(time => {
      setTimeline(time);
      setId(id);
      setVisibleDetail(true);
    });
  };
  const onDrawerClose = () => {
    setVisibleDetail(false);
  };
  const search = (value: string) => {
    fetchTimelineList(1, 20, value);
    // .then(res => {
    //   setTimelines(res.data);
    //   setTotal(res.pager.Total);
    // });
  };
  const onPageChange = (page: number, pageSize?: number | undefined) => {
    fetchTimelineList(page, 20, keyword);
  };
  const fetchTimelineList = (pageindex: number, pagesize: number, keyword: string) => {
    TimelineApi.getTimelineList(
      pagesize, 
      (pageindex - 1) * pagesize,
      keyword
    ).then(result => {
      setTimelines(result.data);
      setTotal(result.pager.Total);
    });
  }
  const addClick = () => {
    setTimeline(TimelineInitValue);
    setId('');
    setVisibleDetail(true);
  };
  const save = (data: TimelinePut) => {
    if ( id) {
      TimelineApi.updateDoc(id, data).then(result => {
        if (result) {
          message.success('保存成功');
        } else {
          message.warn('保存失败');
        }
      });
    } else {
      TimelineApi.addDoc(data).then(newid => {
        if( newid ) {
          message.success('添加成功');
          setKeyword(data.title);
          fetchTimelineList(1, 20, data.title);
        } else {
          message.warn('添加失败');
        }
      });         
    }
  };
  const onSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(event.target.value);
  }
  useEffect(() => {
    fetchTimelineList(1, 20, '');
  }, []);
  return (
    <div className="main">
      <Row>
        <Col span={8}>
          <Input.Search 
            addonBefore={<CloseCircleOutlined onClick={addClick} />}
            onSearch={search}
            onChange={onSearchChange}
            value={keyword}
          />
        </Col>
      </Row>
      <List
        size="small"
        pagination={{
          onChange: onPageChange,
          pageSize: 20,
          total: total,
          position: "top"
        }}
        itemLayout="vertical"
        dataSource={timelines}
        renderItem={item => (
          <List.Item
            extra={<img src={item.photoDownloadUrl} />}
            onClick={itemClick}
            data-id={item.id}
          >
            <List.Item.Meta 
              title={item.age}
              description={item.showAge}
            />
              <Row>
                <Col span={8}>{item.title}</Col>
                <Col span={8}>
                  {item.tags && item.tags[0]}
                </Col>
              </Row>
          </List.Item>
        )}
      />
      <Drawer
        visible={visibleDetail}
        onClose={onDrawerClose}
        width="50%"
      >
          <TimelineDeatilScreen 
            id={id}
            timeline={timeline} 
            save={save}
          />
      </Drawer>
    </div>
  )

};

export default TimelineListScreen;