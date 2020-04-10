import request from '../request';
import { 
  TimelinePut,
  Timeline,
  TimelineDownloadPhoto, 
  TimelineListResponse,
  TimelineInitValue,
} from '../../interface/timeline';
import { QueryResult } from '../../interface/common';
import { Character } from '../../interface/character';
import { getDownloadUrl } from '../../utils/common';

const parse = (text: string): TimelineDownloadPhoto => {
  const obj = JSON.parse(text);
  const tl: TimelineDownloadPhoto = {
    id: obj._id,
    age: obj.age,
    photo: obj.photo,
    photoDownloadUrl: getDownloadUrl(obj.photo),
    showAge: obj.showAge,
    tags: obj.tags,
    title: obj.title,
    source: obj.source,
    img: '',
    imgDownloadUrl: '',
    characters: obj.characters || [],
    charactersDownloadUrl: (obj.characters || []).map((c: Character) => getDownloadUrl(c.avator))
  }
  return tl;
};

// 分页获取
const getTimelineList = async (
  limit: number, 
  skip: number, 
  keyword: string
): Promise<TimelineListResponse> => {
  let query = ['db.collection("events")'];
  if ( keyword ) {
    query.push(`
    .where(db.command.or([
      {
        age: "${keyword}"
      }, 
      {
        showAge: db.RegExp({
          regexp: \".*${keyword}.*\",
          options: 'i'
        })
      }, 
      {
        title: db.RegExp({
          regexp: \".*${keyword}.*\",
          options: 'i'
        })
      }, 
      {
        tags: db.RegExp({
          regexp: \".*${keyword}.*\",
          options: 'i'
        })
      }
    ]))
    `.replace(/\s/g, ''))
  }
  // if (age) {
  //   query.push(`
  //     .where(db.command.and([{

  //     }]))
  //   `);
  // }
  query.push(".orderBy('age', 'asc')");
  query.push(`.limit(${limit})`);
  query.push(`.skip(${skip})`);
  query.push(".get()");
  const queryresult: QueryResult = await request.query(query.join(''));
  const result: TimelineListResponse = {
    data: queryresult.data.map(str => {
      return parse(str);
    }),
    pager: queryresult.pager
  }
  return result;
};
const getDoc = async (id: string): Promise<TimelineDownloadPhoto> => {
  let timeline: TimelineDownloadPhoto = TimelineInitValue;
  try {
    const result: QueryResult = await request.query(`db.collection("events").doc("${id}").get()`);
    if ( result.data && result.data.length > 0 ) {
      const obj = JSON.parse(result.data[0]);
      timeline = {
        id: obj._id,
        age: obj.age,
        photo: obj.photo,
        photoDownloadUrl: getDownloadUrl(obj.photo),
        showAge: obj.showAge,
        tags: obj.tags || [],
        title: obj.title,
        source: obj.source,
        img: obj.img,
        imgDownloadUrl: getDownloadUrl(obj.img),
        characters: obj.characters || [],
        charactersDownloadUrl: (obj.characters || []).map((c: Character) => getDownloadUrl(c.avator))
      };
    }
  } catch ( error ) {

  }
  return timeline;
};
const updateDoc = async (id: string, timeline: TimelinePut): Promise<boolean> => {
  let modified: number = 0;
  try {
    modified = await request.update(`db.collection("events").doc("${id}").update({data: ${JSON.stringify(timeline)}})`);
  } catch ( error ) {

  }
  return modified > 0;
};
const addDoc = async (timeline: TimelinePut): Promise<string> => {
  let newid = '';
  try {
    const result: string[] = await request.add(`db.collection("events").add({data: ${JSON.stringify(timeline)}})`);
    newid = result[0];
  } catch ( error ) {

  }
  return newid;
};
const searchTimelineList = async (keyword: string): Promise<TimelineListResponse> => {
  const queryresult: QueryResult = await request.query(`
  db.collection("events")
  .orderBy('age', 'asc')
  .where(db.command.or([{
    age: "${keyword}"
  }, {
    showAge: db.RegExp({
      regexp: \".*${keyword}.*\",
      options: 'i'
    })
  }, {
    title: db.RegExp({
      regexp: \".*${keyword}.*\",
      options: 'i'
    })
  }, {
    tags: db.RegExp({
      regexp: \".*${keyword}.*\",
      options: 'i'
    })
}]))
  .get()
`.replace(/\s/g, ''));
const result: TimelineListResponse = {
  data: queryresult.data.map(str => {
    const tl: TimelineDownloadPhoto = parse(str);
    return tl;
  }),
  pager: queryresult.pager
}
return result;
};
// 删除一条记录
const deleteDoc = async (id: string): Promise<boolean> => {
  let deleted: number = 0;
  try {
    deleted = await request.del(`db.collection("events").where({_id: '${id}'}).remove()`);
  } catch (error) {

  }
  return deleted > 0;
};
export {
  addDoc,
  getDoc,
  getTimelineList,
  updateDoc,
  deleteDoc
};