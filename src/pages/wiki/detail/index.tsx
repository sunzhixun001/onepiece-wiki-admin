import React, { useState, useEffect, ChangeEventHandler, ChangeEvent } from 'react';
import { RouteComponentProps, useHistory } from 'react-router-dom';
import { WikiApi, CharacterApi } from '../../../api';
import { WikiUpdateRequestValue, WikiCharacterValue, WikiGetDocResponseValue } from '../../../interface/wiki';
import { Character, CharacterBindValue, CharacterSearchDownload } from '../../../interface/character'
import { FileValue } from '../../../interface/file';
import { getDownloadUrl } from '../../../utils/common';
import { 
  PageHeader,
  Form,
  Input,
  Avatar,
  Card,
  Col, 
  Row,
  Button,
  message,
  Icon,
  Modal
} from 'antd';
import "./index.css";
const { Search } = Input;

interface Props {
  id: string,
  wiki: WikiGetDocResponseValue,
  save: (wiki: WikiUpdateRequestValue) => void
};

const WikiDetailScreen = ( props: Props ) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [id, setId] = useState<string>('');
  const [album, setAlbum] = useState<FileValue[]>([]);
  const [title, setTitle] = useState<string>('');
  const [cover, setCover] = useState<string>('');
  const [coverDownloadUrl, setCoverDownloadUrl] = useState<string>('');
  const [summary, setSummary] = useState<string[]>([]);
  const [characters, setCharacters] = useState<CharacterSearchDownload[]>([]);
  const [searchcharacters, setSearchcharacters] = useState<CharacterBindValue[]>([]);
  let history = useHistory();
  useEffect(() => {
    const { wiki} = props;
      setId(wiki._id);
      setTitle(wiki.title);
      setCover(wiki.cover);
      setCoverDownloadUrl(wiki.cover_download_url);
      setAlbum(wiki.album);
      setSummary(wiki.summary);
      setCharacters(wiki.characters);
  }, [props.id]);
  const onSaveClick = function() {
    const value: WikiUpdateRequestValue = {
      album: album.map<string>(a => {
        return a.fileid
      }),
      characters: characters.map(c => {
        return {
          avator: c.avator,
          id: c.id
        }
      }),
      cover: cover,
      summary: summary,
      title: title
    };
    props.save(value);
  };
  const onSummaryChange: ChangeEventHandler = function<ChangeEventHandler>(e: any) {
    const value = e.target.value;
    const index: string = e.currentTarget.getAttribute('data-index');
    setSummary(summary.map((s, i) => {
      if ( i === parseInt(index) ) {
        s = value;
      }
      return s;
    }));
  };
  const onPlugClick = () => {
    setVisible(true);
  };
  const fetchSearchCharacter = (value: string) => {
    CharacterApi.searchCharacterList(value).then(result => {
      setSearchcharacters(result.data.map(d => {
        const _character: CharacterBindValue = {
          ...d,
          locked: !!characters.find(c => c.id === d.id),
          selected: false
        };
        return _character;
      }));
    });
  };
  const onCharacterClick = (e: any) => {
    const id = e.currentTarget.getAttribute('data-id');
    setSearchcharacters(searchcharacters.map(c => {
      if (c.id === id) {
        c.selected = true;
      }
      return c;
    }));
  };
  const onChooseOK = () => {
    setCharacters(characters.concat(searchcharacters.filter(c => c.selected).map(c => {
      const character: CharacterSearchDownload = {
        id: c.id,
        avator: c.avator,
        download_url: c.download_url
      };
      return character;
    })));
  };
  const closeModal = () => {
    setVisible(false);
  };
  const onAlbumChange = (e: any) => {
    const index = parseInt(e.currentTarget.getAttribute('data-index'));
    const value = e.target.value;
    setAlbum(album.map((a, i) => {
      if(i === index) {
        a.fileid = value;
        a.download_url = getDownloadUrl(value)
      }
      return a;
    }));
  };
  const onTitleChange = (e: any) => {
    setTitle(e.target.value);
  };
  const onCoverChange = (e: any) => {
    setCover(e.target.value.trim());
    setCoverDownloadUrl(getDownloadUrl(e.target.value.trim()));
  };
  const removeSummary = (e: any) => {
    const index = parseInt(e.currentTarget.getAttribute('data-index'));
    const new_summary = summary.filter((s, i) => {
      return i !== index;
    });
    setSummary(new_summary);
  };
  const onAddSummaryClick = () => {
    setSummary(summary.concat(['']));
  };
  const onAddAlbumClick = () => {
    setAlbum(album.concat([{
      fileid: '',
      download_url: ''
    }]))
  };
  const onCharacterRemoveClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const id = e.currentTarget.getAttribute('data-id');
    setCharacters(characters.filter(c => c.id !== id));
  };
  return (
    <div>
      <PageHeader
        title={title || '新增wiki'}
        onBack={()=>{history.goBack()}}
      />
      <Form
        layout="horizontal"
        labelCol={{span: 2}}
        wrapperCol={{span: 14}}
      >
        <Form.Item label="名称">
          <Input value={title } onChange={onTitleChange}/>
        </Form.Item>
        <Form.Item label="cover">
          {
            coverDownloadUrl && 
            <div>
              <img src={coverDownloadUrl} />
            </div>
          }
          <Input 
            value={cover}
            onChange={onCoverChange}
          />
        </Form.Item>
        <Form.Item label="描述">
        {
          summary.map((s, index) => (
              <div 
                className="summary-input"
                key={index}
              >
                <Input.TextArea 
                  className="icon"
                  value={s}
                  onChange={onSummaryChange}
                  data-index={index}
                />
                <Icon 
                  type="minus-circle" 
                  onClick={removeSummary}
                  data-index={index}
                />
              </div>
          ))
        }
          <div>
            <Button type="dashed" onClick={onAddSummaryClick}>
              <Icon type="plus" /> 添加描述
            </Button>
          </div>
        </Form.Item>
        <Form.Item label="相关人物">
          <div className="wiki-detail-character">
          {
            characters.map(c => (
              <div
                className="avator-box"
                key={c.id}
              >
                <img src={c.download_url} />
                <div 
                  className="close-button"
                  onClick={onCharacterRemoveClick}
                  data-id={c.id}
                >
                  <Icon type="close-circle" />
                </div>
              </div>
            ))
          }
            <div><Icon type="plus-circle" onClick={onPlugClick}/></div>
          </div>
        </Form.Item>
        <Form.Item
          label="相册"
        >
          <Row gutter={16} type="flex">
          {
            album.map((a, i) => (
              <Col 
                key={i}
                span={12}
              >
                <div className="album-main">
                  <img src={a.download_url} />
                  <input defaultValue={a.fileid} onChange={onAlbumChange} data-index={i}/>
                </div>
              </Col>
            ))
          }
            <Col 
              span={12}
            >
              <div className="album-plus-main" onClick={onAddAlbumClick}>
                <Icon type="plus-circle" style={{ fontSize: '100px', color: 'gray' }}/>
              </div>
            </Col>
          </Row>
        </Form.Item>
        <Form.Item>
        <Button type="primary" onClick={onSaveClick}>保存</Button>
        </Form.Item>
      </Form>
      <Modal
        title="搜索人物"
        visible={visible}
        onOk={onChooseOK}
        onCancel={closeModal}
      >
        <div className="modal-wrap">
        <Search 
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
                    className={`${c.selected ? "checked":""} ${c.locked ? "locked": ""}`}
                    key={c.id}
                    span={6}
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
          </div>
        </div>
      </Modal>
    </div>
  )
}
export default WikiDetailScreen;