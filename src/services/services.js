import Api from './apiMethods'
const baseUrl = '/api/v1/';

//获取设备列表
export function getDevices(data= {}){
    return Api.get(baseUrl+'setting/devices' ,data)
}

//添加一项设备
export function addDevice(data = {}) {
    return Api.post(baseUrl+'setting/devices', data, false)
}

//获取联系人组数据
export function getContactGroups(data = {}) {
    return Api.get(baseUrl+'setting/contact_groups', data)
}

//时间管理-时间段-获取列表
export function timePeriods(data= {}) {
    return Api.get(baseUrl+'setting/time_periods', data)
}

//获取设备模板
export function getDeviceTemplates(data= {}) {
    return Api.get(baseUrl+'setting/device_templates', data);
}

//获取站点数据
export function getDeviceGroups(data= {}) {
    return Api.get(baseUrl+'setting/device_groups', data);
}

/**
 * 删除某个设备
 * @param data
 * @returns {Promise<unknown>}
 */
export function deleteDevice(data={}) {
    let url = baseUrl+'setting/devices/';
    if(typeof data === 'number'){
        url += data;
        return Api.delete(url);
    }else{
        return Api.delete(baseUrl+'setting/device_groups', data);
    }

}

/**
 * 更新某项设备
 * @param id
 */
export function updateDevice(data= {}) {
    if(!data.id || !/^[0-9]*$/.test(data.id)) throw 'id 不存在或者不是是数字';
    return Api.put(baseUrl+'setting/devices/'+ data.id, data);
}
