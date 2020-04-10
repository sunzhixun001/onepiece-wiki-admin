import React, { useState, useEffect, ReactElement, useCallback } from 'react';
import { RouteComponentProps } from 'react-router';
import { TimelineApi } from '../../../api';
import {
  Form,
  Input,
  Button,
  message,
  Drawer
} from 'antd';
import {
  CloseCircleOutlined,
  PlusCircleOutlined
} from '@ant-design/icons';
import "./index.css";
import { getDownloadUrl } from '../../../utils/common';
import { TimelinePut, Timeline, TimelineDownloadPhoto } from '../../../interface/timeline';
import { Character, CharacterRelationshipDownload } from '../../../interface/character';
import SearchCharacter from '../../../components/common/search-character';
import { Tags } from './components';

interface Props {
  id: string,
  timeline: TimelineDownloadPhoto,
  save: (data: TimelinePut) => void
};

const TimelineDeatilScreen = (props: Props) => {
  const [photo, setPhoto] = useState<string>("");
  const [photoDownloadUrl, setPhotoDownloadUrl] = useState<string>("");
  const [showAge, setShowAge] = useState<string>("");
  const [age, setAge] = useState<number>(0);
  const [title, setTitle] = useState<string>("");
  const [source, setSource] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [id, setId] = useState<string>("");
  const [img, setImg] = useState<string>("");
  const [imgDownloadUrl, setImgDownloadUrl] = useState<string>("");
  const [characters, setCharacters] = useState<Character[]>([]);
  const [charactersDownloadUrl, setCharactersDownloadUrl] = useState<string[]>([]);
  const [visiableAddCharacter, setVisiableAddCharacter] = useState<boolean>(false);

  const onAddTagClick = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    setTags(tags.concat([""]));
  };
  const onRemoveTagClick = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    const index = parseInt(event.currentTarget.getAttribute("data-index") || '0');
    setTags(tags.filter((t, i) => i !== index));
  };
  const onTagChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const index = parseInt(event.currentTarget.getAttribute("data-index") || '0');
    const value = event.target.value;
    setTags(tags.map((t, i) => {
      if (i === index) {
        return value;
      } else {
        return t;
      }
    }));
  }, [tags]);
  // 点击删除事件
  const handleRemove = useCallback(() => {
    TimelineApi.deleteDoc(id).then(result => {
      if (result) {
        message.success('删除成功');
      }
    });
  }, [id]);
  const onPhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPhoto(event.target.value.trim());
    setPhotoDownloadUrl(getDownloadUrl(event.target.value.trim()));
  };
  const onImgChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setImg(event.target.value.trim());
    setImgDownloadUrl(getDownloadUrl(event.target.value.trim()));
  };
  const onAgeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value);
    setAge(parseFloat(event.target.value));
  };
  const onShowAgeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowAge(event.target.value);
  };
  const onTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };
  const onSourceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSource(event.target.value);
  };
  const onSaveClick = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    const tl: TimelinePut = {
      photo: photo,
      showAge: showAge,
      age: age,
      title: title,
      source: source,
      tags: tags,
      img: img,
      characters: characters
    };
    props.save(tl);
  };
  const onAddCharacter = () => {
    setVisiableAddCharacter(true);
  };
  const onAddCharacterDrawerSubmit = useCallback((characters: CharacterRelationshipDownload[]) => {
    setCharacters(characters.map(c => {
      const _character: Character = {
        id: c.chataId,
        avator: c.avator
      };
      return _character;
    }));
    setCharactersDownloadUrl(
      Array.from(new Set(charactersDownloadUrl.concat(characters.map(c => c.avator_download_url))))
    );
  }, [charactersDownloadUrl]);
  const onDrawerClose = () => {
    setVisiableAddCharacter(false);
  };
  const onCharacterMouseOver = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    console.log(event);
  };
  useEffect(() => {
    const { timeline } = props;
    setPhoto(timeline.photo);
    setPhotoDownloadUrl(timeline.photoDownloadUrl);
    setShowAge(timeline.showAge);
    setAge(timeline.age);
    setTitle(timeline.title);
    setSource(timeline.source);
    setTags(timeline.tags);
    setId(timeline.id);
    setImg(timeline.img);
    setImgDownloadUrl(timeline.imgDownloadUrl);
    setCharacters(timeline.characters);
    setCharactersDownloadUrl(timeline.charactersDownloadUrl);
  }, [props.id]);
  return (
    <div>
      <Form
        labelCol={{span: 3}}
        wrapperCol={{span: 21}}
      >
        <Form.Item
          label="Id"
        >
          <span>{id}</span>
        </Form.Item>
        <Form.Item
          label="图片"
        >
          <img src={photoDownloadUrl} />
          <Input value={photo} onChange={onPhotoChange} />
        </Form.Item>
        <Form.Item
          label="大图"
        >
          <img src={imgDownloadUrl} />
          <Input value={img} onChange={onImgChange} />
        </Form.Item>
        <Form.Item
          label="显示年份"
        >
          <Input value={showAge} onChange={onShowAgeChange} />
        </Form.Item>
        <Form.Item
          label="年份"
        >
          <Input value={age} onChange={onAgeChange} />
        </Form.Item>
        <Form.Item
          label="描述"
        >
          <Input value={title} onChange={onTitleChange} />
        </Form.Item>
        <Form.Item
          label="标签"
        >
          <Tags
            items={tags}
            onTagChange={onTagChange}
            onRemoveTagClick={onRemoveTagClick}
          />
          <div 
            className="tag-item add-tag"
          >
            <Button type="dashed" onClick={onAddTagClick}>添加</Button>
          </div>
        </Form.Item>
        <Form.Item
          label="来源"
        >
          <Input value={source} onChange={onSourceChange} />
        </Form.Item>
        <Form.Item
          label="相关人物"
        >
          <div className="character_list">
          {
            charactersDownloadUrl.map(c => (
              <div 
                className="character_item" 
                key={c}
                onMouseOver={onCharacterMouseOver}
              >
                <img className="avator" src={c} />
              </div>
            ))
          }
            <div className="character_item" onClick={onAddCharacter}>
              <PlusCircleOutlined />
            </div>
          </div>
        </Form.Item>
        <Form.Item
          wrapperCol={{offset:3}}
        >
          <div className='action-box'>
            <Button className='button' type='primary' onClick={onSaveClick} >保存</Button>
            <Button className='button' type='danger' onClick={handleRemove}>删除</Button>
          </div>
        </Form.Item>
      </Form>
      <Drawer
        visible={visiableAddCharacter}
        title="搜索人物"
        onClose={onDrawerClose}
        width='25%'
      >
          <SearchCharacter 
            characters={characters.map<string>(c => c.id)}
            // close={() => {}}
            ok={onAddCharacterDrawerSubmit}
          />
      </Drawer>
    </div>
  );
}

export default TimelineDeatilScreen;