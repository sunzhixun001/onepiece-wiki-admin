import React from 'react';
import {
    Input
} from 'antd';
import {
    CloseCircleOutlined
} from '@ant-design/icons';

export default ({
    items,
    onTagChange,
    onRemoveTagClick
}) => {
    return (
        items.map((t, i) => (
            <div 
              key={i}
              className="tag-item"
            >
              <Input 
                value={t} 
                onChange={onTagChange}
                data-index={i}
              />
              <CloseCircleOutlined 
                className="icon" 
                onClick={onRemoveTagClick}
                data-index={i}
              />
            </div>
        ))
    )
};