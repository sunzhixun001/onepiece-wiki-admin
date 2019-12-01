import request from '../request';
import { getDownloadUrl } from '../../utils/common';
import { 
  CharacterSearchResponseValue, 
  CharacterListSearchResult, 
  CharacterDetailShow, 
  CharacterDetail,
  CharacterRelationship,
  CharacterRelationshipDownload 
} from '../../interface/character';
import { QueryResult } from '../../interface/common';

// 模糊检索
const searchCharacterList = async (keyword: string): Promise<CharacterListSearchResult> => {
  let result: CharacterListSearchResult = {
    data: [],
    pager: {
      Offset: 0,
      Limit: 0,
      Total: 0
    }
  };
  try {
    let response: QueryResult = await request.query(
      `db.collection("biologicals").where(db.command.or(
        [{
          fullname: db.RegExp ({
              regexp: \".*${keyword}.*\",
              options: 'i'
            })
          }, {
            japaneseName: db.RegExp ({
                regexp: \".*${keyword}.*\",
                options: 'i'
              })
            }, {
              englishName: db.RegExp ({
                  regexp: \".*${keyword}.*\",
                  options: 'i'
                })
              }, {
              group: db.RegExp({
                regexp: \".*${keyword}.*\",
                options: 'i'
              })
          }]
        ))
          .field({
            avator: true,
            fullname: true
          })
          .get()`.replace(/\s/g, '')
    );
    result.data = response.data.map(s => {
      const obj = JSON.parse(s);
      const character: CharacterSearchResponseValue = {
        id: obj._id,
        avator: obj.avator,
        download_url: getDownloadUrl(obj.avator as string),
        fullname: obj.fullname
      };
      return character;
    });
    result.pager = response.pager;
  } catch ( error ) {

  }
  return result;
};

// 分页获取
const getCharacterList = async ( pageindex: number, pagesize: number): Promise<CharacterListSearchResult> => {
  let result: CharacterListSearchResult = {
    data: [],
    pager: {
      Offset: 0,
      Limit: 0,
      Total: 0
    }
  };
  try {
    let response: QueryResult = await request.query(
      `
      db.collection("biologicals")
      .orderBy('pinyinName', 'asc')
      .limit(${pagesize})
      .skip(${(pageindex - 1) * pagesize})
      .field({fullname: true, avator: true})
      .get();
      `.replace(/\s/g, '')
    );
    result.data = response.data.map(s => {
      const obj = JSON.parse(s);
      const character: CharacterSearchResponseValue = {
        id: obj._id,
        avator: obj.avator,
        download_url: getDownloadUrl(obj.avator as string),
        fullname: obj.fullname
      };
      return character;
    });
    result.pager = response.pager;
  } catch ( error ) {

  }
  return result;
};

// 获取单个详情
const getCharacterDoc = async ( id: string): Promise<CharacterDetailShow> => {
  const result: QueryResult = await request.query(`db.collection("biologicals").doc("${id}").get();`);
  const obj = JSON.parse(result.data[0]);
  let character: CharacterDetailShow = {
    // id: obj._id,
    avator: obj.avator,
    age: obj.age,
    birthday: obj.birthday,
    bounty: obj.bounty,
    devilfruitName: obj.devilfruitName,
    devilfruitType: obj.devilfruitType || "无",
    englishName: obj.englishName,
    fullname: obj.fullname,
    height: obj.height,
    img: obj.img,
    japaneseName: obj.japaneseName,
    name: obj.name,
    pinyinName: obj.pinyinName,
    role: obj.role,
    profile: obj.profile || '',
    avator_download_url: getDownloadUrl(obj.avator),
    img_download_url: getDownloadUrl(obj.img),
    priateRegimentName: obj.priateRegimentName || '',
    job: obj.job || '',
    position: obj.position || '',
    levelName: obj.levelName || '',
    group: obj.group || [],
    nickname: obj.nickname || '',
    gender: !!obj.gender,
    relationships: obj.relationships ? obj.relationships: [],
    relationships_download_url: obj.relationships ? obj.relationships.map((r: CharacterRelationship) => {
      const _relationship: CharacterRelationshipDownload = {
        ...r,
        avator_download_url: getDownloadUrl(r.avator)
      };
      return _relationship;
    }): []
  };
  return character;
};

// 更新单个
const updateCharacterDoc = async ( id: string, character: CharacterDetail): Promise<boolean> => {
  let number = 0;
  try {
    number = await request.update(`db.collection("biologicals").doc("${id}").update({data:${JSON.stringify(character)}})`);
  } catch ( error ) {

  }
  return number > 0;
};
// 新增
const addCharacterDoc = async (character: CharacterDetail): Promise<string> => {
  let id = '';
  try {
    const result: string[] = await request.add(`db.collection("biologicals").add({data:${JSON.stringify(character)}})`);
    id = result[0];
  } catch ( error ) {

  }
  return id;
};

export {
  addCharacterDoc,
  searchCharacterList,
  getCharacterList,
  getCharacterDoc,
  updateCharacterDoc
};