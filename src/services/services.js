import axios from 'axios'
import Api from './apiMethods'

const baseUrl = '';//'/api/v1/';
const regNum = /^[0-9]*$/;
//获取设备列表
export function getDevices(data= {}){
    return Api.get(baseUrl+'setting/devices' ,data)
}
//获取单个设备
export function getDeviceById(id){
    if(!regNum.test(id)) return ;
    return Api.get(baseUrl+'setting/devices/'+id);
}
//添加一项设备
export function addDevice(data = {}) {
    return Api.post('setting/devices', data);
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
    return Api.put(baseUrl+'setting/devices/'+ id, data);
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
    return Api.put(baseUrl+'setting/devices/'+ id, params);

    // return axios({
    //     method: 'put',
    //     url: baseUrl+'setting/items/'+id,
    //     data: params,
    //     headers: headers
    // });
}

//删除监控项
export function deleteItemById(id) {
    if(!id || !regNum.test(id)) throw 'id 不存在或者不是是数字';
    return Api.deleteById(baseUrl+'setting/items/', id);
}

//获取站点管理左侧菜单
export function devicesMenu(data={}) {
    return Api.get(baseUrl+'device_groups/menu',data);
}

//站点管理--监控项
export function stationItems(data) {
    return Api.get(baseUrl+'device_groups/device/item', data);
}

//告警日志
export function warnLogs(data={}) {
    return Api.get(baseUrl+'alarm_log', data);
}
//通知日志
export function alarmlog(data={}) {
    return Api.get(baseUrl+'notification_log', data);
}
// 获取监控线曲线数据
export function getItemTrend(data={}) {
    return Api.get(baseUrl+'device_groups/device/data', data);
}
