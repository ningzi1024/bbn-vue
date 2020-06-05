import Api from './apiMethods'
const baseUrl = '/api/v1/';

export function refreshToken(data= {}){
    return Api.get(baseUrl+'pub/refresh_token' ,data)
}

export function realtime(data = {}) {
    return Api.get(baseUrl+'realtime', data)
}
