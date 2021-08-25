import axios from 'axios';

const baseURL = "https://social.qmcurtis.me/api/";
const config = {
    method: 'post',
    baseURL: baseURL,
    timeout: 36000,
    responseType: 'json'
};

export function createUserRequest(uuid, nickname='') {
    let localConfig = Object.assign({}, config, {
        data: {
            userId: uuid,
            nickname: nickname,
        },
        url: '/user'
    });
    localConfig.baseURL = "https://aws.nicegoodthings.com/";
    return axios.request(localConfig);
}
export function createRelation(requestStarterUUID, requestOriginUUID) {
    let localConfig = Object.assign({}, config, {
        data: {
            userId: requestStarterUUID,
            users: [
                requestOriginUUID
            ],
            platform: 'youtube'
        },
        url: '/user/connect'
    });
    localConfig.baseURL = "https://aws.nicegoodthings.com/"
    console.log(localConfig);
    return axios.request(localConfig);
}
export function getFriendsList(uuid) {
    let localConfig = Object.assign({}, config, {
        params: {
            userId: uuid,
        },
        url: '/authing/connect/'
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
        url: '/authing/search'
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
        url: '/user/connect/liked'
    });
    console.log(localConfig);
    localConfig.method = 'get'
    return axios.request(localConfig);
}
export function reactionToVideo(uuid, url, reactionType='like', timeStamp, keepPrivate) {
    let localConfig = Object.assign({}, config, {
        data: {
            userId: uuid,
            url: url,
            reaction: reactionType,
            timeStamp: timeStamp,
            keepPrivate: keepPrivate,
        },
        url: '/reaction'
    });
    localConfig.method='post'
    return axios.request(localConfig);
}