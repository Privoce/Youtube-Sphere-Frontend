import axios from 'axios';

const baseURL = "http://ec2-18-166-42-129.ap-east-1.compute.amazonaws.com:3000/";
const config = {
    method: 'post',
    baseURL: baseURL,
    timeout: 36000,
    headers: {'X-Requested-With': 'XMLHttpRequest'},
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
        data: {
            uuid: uuid,
            id_token: token,
        },
        url: '/friend-list'
    });
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
