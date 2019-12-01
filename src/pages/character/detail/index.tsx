import React, { useState, useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { CharacterApi } from '../../../api'
import { CharacterDetailShow, CharacterDetail, CharacterRelationship, CharacterRelationshipDownload } from '../../../interface/character';
import {
  Form,
  Input,
  Radio,
  Icon,
  Button,
  message,
  Row,
  Col,
  Avatar,
  Select
} from 'antd';
import "./index.css";
import { RadioChangeEvent } from 'antd/lib/radio/interface';
import { getDownloadUrl } from '../../../utils/common';
import SearchCharacter from '../../../components/common/search-character';

interface Props {
  id: string,
  detail: CharacterDetailShow,
  save: (character: CharacterDetail) => void
};

const CharacterDetailScreen = (props: Props) => {
  const [id, setId] = useState<string>('');
  const [avator, setAvator] = useState<string>("");
  const [avatorDownloadUrl, setAvatorDownloadUrl] = useState<string>("");
  const [imgDownloadUrl, setImgDownloadUrl] = useState<string>('');
  const [img, setImg] = useState<string>('');
  const [fullname, setFullname] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [pinyinName, setPinyinName] = useState<string>("");
  const [englishName, setEnglishName] = useState<string>("");
  const [japaneseName, setJapaneseName] = useState<string>("");
  const [height, setHeight] = useState<number>(0);
  const [birthday, setBirthday] = useState<string>("");
  const [age, setAge] = useState<number>(0);
  const [role, setRole] = useState<number>(0);
  const [priateRegimentName, setPriateRegimentName] = useState<string>("");
  const [job, setJob] = useState<string>("");
  const [levelName, setLevelName] = useState<string>("");
  const [position, setPosition] = useState<string>("");
  const [devilfruitType, setDevilfruitType] = useState<string>("无");
  const [devilfruitName, setDevilfruitName] = useState<string>('');
  const [group, setGroup] = useState<string[]>([]);
  const [bounty, setBounty] = useState<number>(0);
  const [relationships, setRelationships] = useState<CharacterRelationship[]>([]);
  const [relationshipsDownloadUrl, setRelationshipsDownloadUrl] = useState<CharacterRelationshipDownload[]>([]);
  const [visibleCharacterModal, setVisibleCharacterModal] = useState<boolean>(false);
  const [profile, setProfile] = useState<string>('');
  const [nickname, setNickname]= useState<string>('');
  const [gender, setGender] = useState<boolean>(true);
  useEffect(() => {
    const { detail } = props;
    setImgDownloadUrl(detail.img_download_url);
    setImg(detail.img);
    setAvator(detail.avator);
    setAvatorDownloadUrl(detail.avator_download_url);
    setFullname(detail.fullname);
    setName(detail.name);
    setPinyinName(detail.pinyinName);
    setEnglishName(detail.englishName);
    setJapaneseName(detail.japaneseName);
    setHeight(detail.height);
    setBirthday(detail.birthday);
    setAge(detail.age);
    setRole(detail.role);
    setPriateRegimentName(detail.priateRegimentName);
    setJob(detail.job);
    setPosition(detail.position);
    setDevilfruitName(detail.devilfruitName);
    setDevilfruitType(detail.devilfruitType);
    setGroup(detail.group);
    setRelationshipsDownloadUrl(detail.relationships_download_url);
    setBounty(detail.bounty);
    setProfile(detail.profile);
    setNickname(detail.nickname);
    setGender(detail.gender);

  }, [props.id]);
  const onRoleChange = (e: RadioChangeEvent) => {
    setRole(parseInt(e.target.value));
  };
  const onDevilChange = (e: RadioChangeEvent) => {
    setDevilfruitType(e.target.value)
  };
  const onPinyinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPinyinName(e.target.value);
  };
  const onEnglishChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEnglishName(e.target.value);  
  };
  const onJapaneseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setJapaneseName(e.target.value);
  };
  const onNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
  };
  const onSaveClick = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    let character: CharacterDetail = {
      avator: avator,
      age: age,
      birthday: birthday,
      bounty: bounty,
      devilfruitName: devilfruitName,
      devilfruitType: devilfruitType,
      englishName: englishName,
      fullname: fullname,
      height: height,
      img: img,
      japaneseName: japaneseName,
      name: name,
      pinyinName: pinyinName,
      role: role,
      priateRegimentName: priateRegimentName,
      job: job,
      levelName: levelName,
      position: position,
      group: group,
      relationships: relationships,
      profile: profile,
      gender: gender,
      nickname: nickname
    };
    props.save(character);
  };
  const onGroupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const index = parseInt(e.currentTarget.getAttribute('data-index') || '0');
    const value = e.target.value;
    setGroup(group.map((g, i) => {
      if(i === index) {
        g = value;
      }
      return g;
    }))
  };
  const onRemoveGroupClick = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    const index = parseInt(e.currentTarget.getAttribute('data-index') || '0');
    setGroup(group.filter((g, i) => {
      return i !== index;
    }))
  };
  const onAddGroupClick = () => {
    setGroup(group.concat(['']));
  };
  const onAddRelationshipClick = () => {
    setVisibleCharacterModal(true);
  };
  const onAvatorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAvator(event.target.value.trim());
    setAvatorDownloadUrl(getDownloadUrl(event.target.value.trim()));
  };
  const onImgChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setImg(event.target.value.trim());
    setImgDownloadUrl(getDownloadUrl(event.target.value.trim()));
  };
  const onFullnameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFullname(event.target.value);
  };
  const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };
  const onHeightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHeight(parseInt(event.target.value));
  };
  const onBirthdayChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBirthday(event.target.value);
  };
  const onAgeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAge(parseInt(event.target.value));
  };
  const onGenderChange = (e: RadioChangeEvent) => {
    setGender(Boolean(e.target.value));
  };
  const onProfileChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setProfile(event.target.value);
  };
  const onPriateRegimentNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPriateRegimentName(event.target.value);
  };
  const onJobChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setJob(event.target.value);
  };
  const onPositionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPosition(event.target.value);
  };
  const onBountyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBounty(parseInt(event.target.value));
  };
  const onLevelChange = (value: string) => {
    setLevelName(value);
  };
  const onDevilfruitNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDevilfruitName(event.target.value);
  };
  const onRemoveRelationshipClick = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    const id = event.currentTarget.getAttribute('data-id');
    setRelationshipsDownloadUrl(relationshipsDownloadUrl.filter(r => r.chataId !== id));
    setRelationships(relationships.filter(r => r.chataId !== id));
  };
  const onRelationshipChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const id = event.currentTarget.getAttribute('data-id');
    const value = event.target.value;
    setRelationshipsDownloadUrl(relationshipsDownloadUrl.map(r => {
      if ( r.chataId === id ) {
        r.type = value;
      }
      return r;
    }));
    setRelationships(relationships.filter(r => {
      if ( r.chataId === id ) {
        r.type = value;
      }
      return r;
    }));
  };
  return (
    <div className="character-detail-main">
      <Form
        labelCol={{span: 4}}
        wrapperCol={{span: 20 }}
      >
        <Form.Item
          label="头像"
        >
          <img src={avatorDownloadUrl} className="avator" />
          <Input value={avator} onChange={onAvatorChange} />
        </Form.Item>
        <Form.Item
          label="大图"
        >
          <div className="img-box">
            <img src={imgDownloadUrl} />
          </div>
          <Input value={img} onChange={onImgChange}/>
        </Form.Item>
        <Form.Item label="中文全名">
          <Input value={fullname} onChange={onFullnameChange} />
        </Form.Item>
        <Form.Item label="名字">
          <Input value={name} onChange={onNameChange} />
        </Form.Item>
        <Form.Item label="拼音名">
          <Input value={pinyinName} onChange={onPinyinChange} />
        </Form.Item>
        <Form.Item label="英文名">
          <Input value={englishName} onChange={onEnglishChange} />
        </Form.Item>
        <Form.Item label="日语名">
          <Input value={japaneseName} onChange={onJapaneseChange} />
        </Form.Item>
        <Form.Item label="外号">
          <Input value={nickname} onChange={onNicknameChange} />
        </Form.Item>
        <Form.Item label="身高">
          <Input value={height} onChange={onHeightChange} />
        </Form.Item>
        <Form.Item label="生日">
          <Input value={birthday} onChange={onBirthdayChange} />
        </Form.Item>
        <Form.Item label="年龄">
          <Input value={age} onChange={onAgeChange} />
        </Form.Item>
        <Form.Item label="性别">
          <Radio.Group onChange={onGenderChange} value={gender}>
            <Radio.Button value={true}>男</Radio.Button>
            <Radio.Button value={false}>女</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="简介">
          <Input.TextArea value={profile} onChange={onProfileChange} />
        </Form.Item>
        <Form.Item label="身份">
          <Radio.Group 
            onChange={onRoleChange} 
            value={role} 
            defaultValue={0}
            buttonStyle="solid"
          >
            <Radio.Button value={0}>无</Radio.Button>
            <Radio.Button value={1}>海贼</Radio.Button>
            <Radio.Button value={2}>海军</Radio.Button>
            <Radio.Button value={3}>革命军</Radio.Button>
          </Radio.Group>
        </Form.Item>
        {
          role === 1 &&
          <Form.Item label="海盗团">
            <Input value={priateRegimentName} onChange={onPriateRegimentNameChange} />
          </Form.Item>
        }
        {
          role === 1 &&
          <Form.Item label="角色">
            <Input value={job} onChange={onJobChange} />
          </Form.Item>
        }
        {
          role === 1 &&
          <Form.Item label="赏金">
            <Input value={bounty} onChange={onBountyChange} />
          </Form.Item>
        }
        {
           role === 2 &&
           <Form.Item label="军衔">
              <Select defaultValue="元帅" style={{ width: 120 }} value={levelName} onChange={onLevelChange}>
                <Select.Option value="元帅">元帅</Select.Option>
                <Select.Option value="大将">大将</Select.Option>
                <Select.Option value="中将">中将</Select.Option>
              </Select>
           </Form.Item>
        }
        {
           role === 3 &&
           <Form.Item label="职位">
              <Input value={position} onChange={onPositionChange} />
           </Form.Item>
        }
        <Form.Item label="能力">
          <Radio.Group 
            onChange={onDevilChange} 
            value={devilfruitType} 
            defaultValue={"无"}
            buttonStyle="solid"
          >
            <Radio.Button value="无">无</Radio.Button>
            <Radio.Button value="自然系">自然系</Radio.Button>
            <Radio.Button value="动物系">动物系</Radio.Button>
            <Radio.Button value="超人系">超人系</Radio.Button>
          </Radio.Group>
        </Form.Item>
        {
          devilfruitType !== "无" &&
          <Form.Item label="果实">
            <Input value={devilfruitName} onChange={onDevilfruitNameChange} />
          </Form.Item>
        }
        <Form.Item label="组">
          <div className="character-detail-group">
          {
            group.map((g, i) => (
              <div key={i} className="group-item">
                <Input value={g} onChange={onGroupChange} data-index={i} />
                <Icon type="close-circle" onClick={onRemoveGroupClick} data-index={i} />
              </div>
            ))
          }
            <div className="group-item add-group">
              <Button onClick={onAddGroupClick}>添加</Button>
            </div>
          </div>
        </Form.Item>
        <Form.Item label="关系">
          <div className="character-detail-relationship">
            {
              relationshipsDownloadUrl.map((r, i) => (
                <div key={r.chataId} className="relationship-item">
                  <Input.Group size="large">
                    <Row gutter={8} type="flex">
                      <Col span={5}>
                        <Input value={r.type} onChange={onRelationshipChange} data-id={r.chataId} />
                      </Col>
                      <Col span={3}>
                        <Avatar src={r.avator_download_url} />
                      </Col>
                      <Col span={3}>
                        <Icon type="close-circle" onClick={onRemoveRelationshipClick} data-id={r.chataId} />
                      </Col>
                    </Row>
                  </Input.Group>
                </div>
              ))
            }
            <div className="relationship-item add-relationship">
              <Row gutter={8} type="flex">
                <Col span={11}>
                  <Button onClick={onAddRelationshipClick}>添加</Button>
                </Col>
              </Row>
            </div>
          </div>
        </Form.Item>
        <Form.Item label="">
          <Button onClick={onSaveClick}>保存</Button>
        </Form.Item>
      </Form>
      <SearchCharacter 
        // visible={visibleCharacterModal} 
        characters={relationships.map<string>(r => r.chataId)}
        // close={()=>{setVisibleCharacterModal(false)}}
        ok={characters => {
          setRelationshipsDownloadUrl(relationshipsDownloadUrl.concat(characters));
          setRelationships(relationships.concat(characters.map(c => {
            const r: CharacterRelationship = {
              avator: c.avator,
              chataId: c.chataId,
              type: ''
            };
            return r;
          })));
        }}
      />
    </div>
  )
};

export default CharacterDetailScreen;