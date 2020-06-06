import Api from './apiMethods'
const baseUrl = '/api/v1/';

//获取设备列表
export function getDevices(data= {}){
    return Api.get(baseUrl+'setting/devices' ,data)
}

//添加一项列表
export function addDevice(data = {}) {
    return Api.post(baseUrl+'setting/devices', data)
}
