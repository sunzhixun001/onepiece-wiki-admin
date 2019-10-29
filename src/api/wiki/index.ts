import { getAccessToken } from '../access';
const axios = require('axios');

const getList = () => {
    getAccessToken().then(token => {
        axios.post("/tcb/databasequery?access_token=" + token, {
            env: 'develop-6e54e7',
            query: 'db.collection(\"wikis\").limit(10).skip(1).get()'
        }).then(function(response: any) {
            console.log(response);
        })
    })
    
}

export {
    getList
};