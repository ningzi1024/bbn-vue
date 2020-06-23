import axios from 'axios'
import Api from './apiMethods'
const baseUrl = '/api/v1/';
const token = sessionStorage.getItem('token') || localStorage.getItem('token');
const headers = {
    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    'Authorization':'Bearer ' + token
};
const regNum = /^[0-9]*$/;
//获取设备列表
export function getDevices(data= {}){
    return Api.get(baseUrl+'setting/devices' ,data)
}

//添加一项设备
export function addDevice(data = {}) {
    //apiMethods 内post 方法需要优化，暂时用这个
    return axios({
        method: 'post',
        url: baseUrl+'setting/devices',
        data: data,
        headers:headers
    });
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
    const id = data.id;
    if(!id || !regNum.test(id)) throw 'id 不存在或者不是是数字';
    // return Api.put(baseUrl+'setting/devices/'+ id, data);
    return axios({
        method: 'put',
        url: baseUrl+'setting/devices/'+id,
        data: data,
        headers: headers
    });
}

/**
 * 根据ID获取监控项
 * @param data
 * @return {Promise | Promise<unknown>}
 */
export function getItemsById(id="") {
    if(!id || !regNum.test(id)) throw 'id 不存在或者不是是数字';
    return Api.get(baseUrl+'setting/items/'+id);
}

/**
 * 获取所以监控项
 * @param data
 * @return {Promise | Promise<unknown>}
 */
export function getItems(data= {}) {
    return Api.get(baseUrl+'setting/items', data);
}

/**
 * 高级级别列表
 * @param data
 * @return {Promise | Promise<unknown>}
 */
export function alarmLevels(data={}) {
    return Api.get(baseUrl+'setting/alarm_levels', data);
}

/**
 * 更新某个监控项
 * @param data
 * @return {AxiosPromise}
 */
export function updateItem(data = {}) {
    const id = data.id;
    if(!data || !id || !regNum.test(id)) throw 'id 不存在或者不是是数字';
    let params = {...data};
    delete params.id;
    return axios({
        method: 'put',
        url: baseUrl+'setting/items/'+id,
        data: params,
        headers: headers
    });
}

export function deleteItemById(id) {
    if(!id || !regNum.test(id)) throw 'id 不存在或者不是是数字';
    return Api.deleteById(baseUrl+'setting/items/', id);
}