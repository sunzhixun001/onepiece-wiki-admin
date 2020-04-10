import React, { useState, useEffect} from 'react';
import { 
  Col, 
  Row,
  Modal,
  Input,
  Button
} from 'antd';
import { CharacterBindValue, CharacterRelationship, CharacterRelationshipDownload, Character } from '../../../interface/character';
import { CharacterApi } from '../../../api';
import './index.css';

interface Props {
  characters: string[], 
  ok: (characters: CharacterRelationshipDownload[]) => void
};

const SearchCharacter = React.memo((props: Props) => {
  // 搜索出来的人物列表
  const [searchcharacters, setSearchcharacters] = useState<CharacterBindValue[]>([]);

  useEffect(() => {
    // setSearchcharacters(searchcharacters.map(d => {
    //   if(props.characters.includes(d.id)) {
    //     d.locked = true;
    //     d.selected = false;
    //   }
    //   return d;
    // }));
    setSearchcharacters([]);
  }, [props.characters]);
  const onSubmit = () => {
    const selected = searchcharacters.filter(c => c.selected).map(c => {
      const _character: CharacterRelationshipDownload = {
        avator: c.avator,
        avator_download_url: c.download_url,
        chataId: c.id,
        type: ''
      };
      return _character;
    });
    props.ok(selected);
  };
  const closeModal = () => {
    // props.close();
  };
  // 搜索点击事件
  const fetchSearchCharacter = (value: string) => {
    CharacterApi.searchCharacterList(value).then(result => {
      console.log(result);
      setSearchcharacters(result.data.map(d => {
        const _character: CharacterBindValue = {
          ...d,
          locked: !!props.characters.includes(d.id),
          selected: false
        };
        return _character;
      }));
    });
  };
  const onCharacterClick = (event: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    const id = event.currentTarget.getAttribute('data-id');
    setSearchcharacters(searchcharacters.map(c => {
      if (c.id === id) {
        c.selected = !c.selected;
      }
      return c;
    }));
  };
  return (
    <div className='search-character'>
      <div className="modal-wrap">
      <div className='form'>
        <Input.Search
          placeholder="输入关键字"
          onSearch={fetchSearchCharacter}
        />
      </div>
        <div
          className='item-list'
        >
          {
            searchcharacters.map(c => (
              <div 
                className={`${!c.locked && c.selected ? "checked":""} ${c.locked ? "locked": ""} item`}
                key={c.id}
              >
                <div className="image-box">
                  <img 
                    className='img'
                    src={c.download_url}
                    onClick={c.locked ? undefined:onCharacterClick } 
                    data-id={c.id}
                  />
                </div>
              </div>
            ))
          }
        </div>
        <div>
          <Button type="primary" onClick={onSubmit}>
            确定
          </Button>
        </div>
      </div>
    </div>
    // </Modal>
  ); 
});

export default SearchCharacter;