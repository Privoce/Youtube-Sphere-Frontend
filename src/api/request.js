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
    return axios.request(localConfig);
}
export function createRelation(requestStarterUUID, requestOriginUUID) {
    let localConfig = Object.assign({}, config, {
        data: {
            meId: requestStarterUUID,
            friendId: requestOriginUUID,
            platform: 'youtube'
        },
        url: '/user/connect'
    });
    console.log(localConfig);
    return axios.request(localConfig);
}
export function getFriendsList(uuid) {
    let localConfig = Object.assign({}, config, {
        params: {
            userId: uuid,
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
        url: '/authing/search'
    });
    localConfig.method = 'get';
    console.log(localConfig);
    return axios.request(localConfig);
}
export function getFriendLiked(userId){
    let localConfig = Object.assign({}, config, {
        params: {
            userId: userId,
            num: 12
        },
        url: '/user/connect/liked'
    });
    console.log(localConfig);
    localConfig.method = 'get'
    return axios.request(localConfig);
}
export function reactionToVideo(uuid, url, reactionType='like', timeStamp, keepPrivate=false) {
    let localConfig = Object.assign({}, config, {
        data: {
            userId: uuid,
            videoId: url,
            reactiontime: timeStamp,
            datetime: "2021-09-27 13:00:00"
        },
        url: '/user/connect/liked'
    });
    return axios.request(localConfig);
}