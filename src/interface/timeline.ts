import { Pager, Atom } from './common';
import { Character } from './character';

export interface TimelinePut {
  age: number,
  photo: string,
  showAge: string,
  tags: string[],
  title: string,
  source: string,
  img: string,
  characters: Character[]
};

export interface Timeline extends Atom, TimelinePut {
  
};
export interface TimelineDownloadPhoto extends Timeline {
  photoDownloadUrl: string,
  imgDownloadUrl: string,
  charactersDownloadUrl: string[],
}

export const TimelineInitValue: TimelineDownloadPhoto = {
  id: '',
  age: 0,
  photo: '',
  showAge: '',
  tags: [],
  title: '',
  source: '',
  img: '',
  photoDownloadUrl: '',
  imgDownloadUrl: '',
  characters: [],
  charactersDownloadUrl: []
};

export interface TimelineListResponse {
  data: TimelineDownloadPhoto[],
  pager: Pager
};