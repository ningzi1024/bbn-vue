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

//获取联系人组数据
export function getContactGroups(data = {}) {
    return Api.get(baseUrl+'setting/contact_groups', data)
}
