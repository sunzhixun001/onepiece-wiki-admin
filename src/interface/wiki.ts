import { FileValue } from './file';
import { Character, CharacterSearchDownload } from './character';
import { Pager } from './common';
export interface WikiCharacterValue extends FileValue {
  id: string
}
interface WikiValue {
  cover: string,
  summary: string[],
  title: string
};
export interface WikiListItem {
  id: string,
  title: string
};
export interface WikiUpdateRequestValue extends WikiValue {
  characters: Character[],
  album: string[]
};

export interface WikiGetDocResponseValue extends WikiValue {
  _id: string,
  characters: CharacterSearchDownload[],
  album: FileValue[],
  cover_download_url: string
};
export interface WikiListResult {
  data: WikiListItem[],
  pager: Pager
};
export interface WikiListResponse {
  data: WikiListItem[],
  pager: Pager
}

export const WikiGetDocResponseEmptyObject: WikiGetDocResponseValue = {
  cover: '',
  cover_download_url: '',
  summary: [],
  title: '',
  _id: '',
  characters: [],
  album: []
};