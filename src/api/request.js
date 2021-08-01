import axios from 'axios';

const baseURL = "https://social.qmcurtis.me/api/";
const config = {
    method: 'post',
    baseURL: baseURL,
    timeout: 36000,
    responseType: 'json'
};

export function createUserRequest(uuid, token) {
    let localConfig = Object.assign({}, config, {
        data: {
            uuid: uuid,
            id_token: token,
        },
        url: '/register'
    });
    return axios.request(localConfig);
}
export function createRelation(requestStarterUUID, requestOriginUUID, starterToken) {
    let localConfig = Object.assign({}, config, {
        data: {
            firstID: requestStarterUUID,
            secondID: requestOriginUUID,
            id_token: starterToken,
        },
        url: '/create-relation'
    });
    console.log(localConfig);
    return axios.request(localConfig);
}
export function getFriendsList(uuid, token) {
    let localConfig = Object.assign({}, config, {
        params: {
            uuid: uuid,
            id_token: token,
            depth: 0,
        },
        url: '/user/connect/'
    });
    localConfig.method = 'get'
    console.log(localConfig);
    return axios.request(localConfig);
}
export function searchAccount(text) {
    let localConfig = Object.assign({}, config, {
        params: {
            keyword: text,
        },
        url: '/search'
    });
    localConfig.method = 'get';
    console.log(localConfig);
    return axios.request(localConfig);
}
export function getFriendLiked(userId){
    let localConfig = Object.assign({}, config, {
        params: {
            userId:userId
        },
        url: '/video'
    });
    console.log(localConfig);
    localConfig.method = 'get'
    return axios.request(localConfig);
}