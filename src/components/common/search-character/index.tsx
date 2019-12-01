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

interface Props {
  // visible: boolean,
  characters: string[],
  // close: () => void,
  ok: (characters: CharacterRelationshipDownload[]) => void
};

const SearchCharacter = (props: Props) => {
  const [searchcharacters, setSearchcharacters] = useState<CharacterBindValue[]>([]);
  useEffect(() => {
    setSearchcharacters(searchcharacters.map(d => {
      if(props.characters.includes(d.id)) {
        d.locked = true;
        d.selected = false;
      }
      return d;
    }));
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
    // <Modal
    //   title="搜索人物"
    //   visible={props.visible}
    //   onOk={onChooseOK}
    //   onCancel={closeModal}
    // >
    <div>
      <div className="modal-wrap">
      <Input.Search 
        placeholder="输入关键字"
        onSearch={fetchSearchCharacter}
      />
        <div className="cw">
          <Row
            gutter={[24,24]}
          >
            {
              searchcharacters.map(c => (
                <Col 
                  className={`${!c.locked && c.selected ? "checked":""} ${c.locked ? "locked": ""}`}
                  key={c.id}
                  span={12}
                >
                  <div className="image-box">
                    <img 
                      src={c.download_url}
                      onClick={c.locked ? undefined:onCharacterClick } 
                      data-id={c.id}
                    />
                  </div>
                </Col>
              ))
            }
          </Row>
          <Row>
            <Col>
            <Button type="primary" onClick={onSubmit}>
              确定
            </Button>
            </Col>
          </Row>
        </div>
      </div>
    </div>
    // </Modal>
  ); 
};

export default SearchCharacter;