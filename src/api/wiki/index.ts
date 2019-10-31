import { getAccessToken } from '../access';
import request from '../request';

const getWikiList = async (limit: number, skip: number) => {
    const token = await getAccessToken();
    const response = await request.post("/tcb/databasequery?access_token=" + token, {
        env: 'develop-6e54e7',
        query: `db.collection("wikis").limit(${limit}).skip(${skip}).get()`
    });
    const { data, errcode, errmsg } = response;
    return data;
    // .then(token => {
    //     request.post("/tcb/databasequery?access_token=" + token, {
    //         env: 'develop-6e54e7',
    //         query: `db.collection("wikis").limit(${limit}).skip(${skip}).get()`
    //     }).then(function(response: any) {
    //         console.log(response);
    //     })
    // })
    
}

export {
    getWikiList
}