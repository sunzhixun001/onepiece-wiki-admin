import { Pager, Biological } from './common';

export interface Character {
  id: string,
  avator: string
};

export interface CharacterSearchDownload extends Character {
  download_url: string
}

export interface CharacterSearchResponseValue extends CharacterSearchDownload {
  fullname: string
};

export interface CharacterBindValue extends CharacterSearchResponseValue {
  selected: boolean,
  locked: boolean
};

export interface CharacterListSearchResult {
  data: CharacterSearchResponseValue[],
  pager: Pager
};
export interface CharacterRelationship {
  avator: string,
  chataId: string,
  type: string
};

export interface CharacterRelationshipDownload extends CharacterRelationship {
  avator_download_url: string
};

export interface CharacterDetail {
  avator: string,
  age: number,
  birthday: string,
  bounty: number,
  devilfruitName: string,
  devilfruitType: string,
  englishName: string,
  fullname: string,
  height: number,
  img: string,
  japaneseName: string,
  name: string,
  pinyinName: string,
  role: number,
  priateRegimentName: string,
  job: string,
  position: string,
  levelName: string,
  group: string[],
  relationships: CharacterRelationship[],
  profile: string,
  gender: boolean,
  nickname: string
};


export interface CharacterResponse extends CharacterDetail {
  id: string,
  relationships: CharacterRelationship[]
};

export interface CharacterDetailShow extends CharacterDetail {
  // id: string
  avator_download_url: string,
  img_download_url: string,
  relationships_download_url: CharacterRelationshipDownload[]
};

export const CharacterDetailShowEmpty: CharacterDetailShow = {
  avator: "",
  age: 0,
  birthday: "",
  bounty: 0,
  devilfruitName: "",
  devilfruitType: "无",
  englishName: "",
  fullname: "",
  height: 0,
  img: "",
  japaneseName: "",
  name: "",
  pinyinName: "",
  role: 0,
  priateRegimentName: "",
  job: "",
  position: "",
  levelName: "",
  group: [],
  relationships: [],
  avator_download_url: '',
  img_download_url: '',
  relationships_download_url: [],
  profile: '',
  gender: true,
  nickname: ''
};
