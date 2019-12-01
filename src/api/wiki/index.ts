import request from '../request';
import { 
    WikiUpdateRequestValue, 
    WikiGetDocResponseValue, 
    WikiCharacterValue, 
    WikiListResult 
} from '../../interface/wiki';
import { CharacterSearchDownload } from '../../interface/character';
import { QueryResult } from '../../interface/common';
import { WikiListItem } from '../../interface/wiki';
import { getDownloadUrl } from '../../utils/common';
import { message } from 'antd';


const getWikiList = async (limit: number, skip: number): Promise<WikiListResult> => {
    const response: QueryResult = await request.query(`db.collection("wikis").limit(${limit}).skip(${skip}).get()`);
    let result: WikiListResult = {
        data: response.data.map(str => {
            const obj = JSON.parse(str);
            const wiki: WikiListItem = {
                id: obj._id,
                title: obj.title
            };
            return wiki;
        }),
        pager: response.pager
    };
    return result;
};
const getDoc = async ( id: string ): Promise<WikiGetDocResponseValue> => {
    let wiki_doc: WikiGetDocResponseValue = {
        _id: '',
        album: [],
        cover: '',
        cover_download_url: '',
        summary: [],
        title: '',
        characters: []
    };
    try {
        const response: QueryResult = await request.query(`db.collection("wikis").doc("${id}").get()`);
        if( response.data && response.data.length > 0 ) {
            const json_obj = JSON.parse(response.data[0]);
            wiki_doc = {
                _id: json_obj._id,
                album: json_obj.album && json_obj.album.map((a: string) => {
                    return {
                        fileid: a,
                        download_url: getDownloadUrl(a)
                    }
                }) || [],
                cover: json_obj.cover,
                cover_download_url: getDownloadUrl(json_obj.cover),
                summary: json_obj.summary || [],
                title: json_obj.title,
                characters: json_obj.characters && json_obj.characters.map((c: any) => {
                    const character: CharacterSearchDownload = {
                        id: c.id,
                        avator: c.avator,
                        download_url: getDownloadUrl(c.avator)
                    }
                    return character;
                }) || []
            };
            return wiki_doc;
        }
    } catch ( error ) {
        message.error(error);
    }
    return wiki_doc;
};
const updateDoc = async ( id: string,  wiki: WikiUpdateRequestValue): Promise<boolean> => {
    const modified: number = await request.update(`db.collection("wikis").doc("${id}").update({data: ${JSON.stringify(wiki)}})`);
    return modified > 0;
};
const addDoc = async ( wiki: WikiUpdateRequestValue ): Promise<string> => {
    const result: string[] = await request.add(`db.collection("wikis").add({data: ${JSON.stringify(wiki)}})`);
    return result[0];
};
const searchWikiList = async (keyword: string): Promise<WikiListResult> => {
    const response: QueryResult = await request.query(`
        db.collection("wikis")
        .orderBy('age', 'asc')
        .where(db.command.or([{
        title: db.RegExp({
            regexp: \".*${keyword}.*\",
            options: 'i'
        })
        }]))
        .get()
    `.replace(/\s/g, ''));
    let result: WikiListResult = {
        data: response.data.map(str => {
            const obj = JSON.parse(str);
            const wiki: WikiListItem = {
                id: obj._id,
                title: obj.title
            };
            return wiki;
        }),
        pager: response.pager
    };
    return result;
};
export {
    addDoc,
    getDoc,
    getWikiList,
    searchWikiList,
    updateDoc
}