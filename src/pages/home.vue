<template>
    <div class="setting-device-wrap">
        <div class="opts">
            <Search type="DEVICES" @searchEvent="searchEvent"/>
            <div class="btnIcons">
                <el-button-group>
                    <el-tooltip effect="dark" content="增加">
                        <el-button icon="el-icon-plus" @click="showAddDevicesFlag=true"></el-button>
                    </el-tooltip>
                    <el-tooltip effect="dark" content="删除">
                        <el-button icon="el-icon-minus" @click="deleteDevicesById"></el-button>
                    </el-tooltip>
                    <el-tooltip effect="dark" content="保存">
                        <el-badge :is-dot="globaEditing" class="item">
                            <el-button class="share-button" icon="el-icon-tickets" @click="saveHandle"></el-button>
                        </el-badge>
                    </el-tooltip>
                    <el-tooltip effect="dark" content="批量编辑">
                        <el-button icon="el-icon-collection" style="float: right" @click="batchManageHandle"></el-button>
                    </el-tooltip>
                </el-button-group>
            </div>
        </div>
        <div class="content-tab">
            <el-table
                ref="myTable"
                :data="tableData"
                stripe
                style="width: 100%"
                :row-class-name="rowIsEditing"
                @selection-change="tableChange"
                border>
                <el-table-column type="selection"/>
                <el-table-column
                        class="editing"
                        width="180"
                       label="设备名称">
                    <template slot-scope="scope">
                        <el-input
                                size="small"
                                v-model="tableDataByKeys[scope.row.id][`name_${scope.row.id}`]"
                                class="input-with-select"
                                @input="((val)=>{inputName(val, scope.row.id, 'name_')})">
                        </el-input>
                    </template>
                </el-table-column>
                <el-table-column label="站点"  width="200">
                    <template slot-scope="scope">
                        <el-select
                                size="small"
                                v-model="tableDataByKeys[scope.row.id][`device_group_id_${scope.row.id}`]"
                                @change="(val)=>inputName(val,scope.row.id, 'device_group_id_')"
                                placeholder="请选择机房">
                            <el-option
                                    v-for="item in scope.row.device_groups"
                                    :key="item.name"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column label="分类" prop="sort">
<!--                    <template slot-scope="scope">-->
<!--                        <el-input-->
<!--                                size="small"-->
<!--                                v-model="tableDataByKeys[scope.row.id][`sort_${scope.row.id}`]"-->
<!--                                @input="((val)=>{inputName(val, scope.row.id, 'sort_')})">-->
<!--                        </el-input>-->
<!--                    </template>-->
                </el-table-column>
                <el-table-column label="IP地址">
                    <template slot-scope="scope">
                        <el-input
                                size="small"
                                v-model="tableDataByKeys[scope.row.id][`ip_address_${scope.row.id}`]"
                                @input="((val)=>{inputName(val, scope.row.id, 'ip_address_')})">
                        </el-input>
                    </template>
                </el-table-column>
                <el-table-column label="端口号">
                    <template slot-scope="scope">
                        <el-input
                                size="small"
                                v-model="tableDataByKeys[scope.row.id][`port_${scope.row.id}`]"
                                @input="((val)=>{inputName(val, scope.row.id, 'port_')})">
                        </el-input>
                    </template>
                </el-table-column>
                <el-table-column label="协议ID">
                    <template slot-scope="scope">
                        <el-input
                                size="small"
                                v-model="tableDataByKeys[scope.row.id][`485_address_${scope.row.id}`]"
                                @input="((val)=>{inputName(val, scope.row.id, '485_address_')})">
                        </el-input>
                    </template>
                </el-table-column>
                <el-table-column label="被动连接注册包">
                    <template slot-scope="scope">
                        <el-input
                                size="small"
                                v-model="tableDataByKeys[scope.row.id][`registration_package_${scope.row.id}`]"
                                @input="((val)=>{inputName(val, scope.row.id, 'registration_package_')})">
                        </el-input>
                    </template>
                </el-table-column>
                <el-table-column label="被动链接">
                    <template slot-scope="scope">
                        <el-checkbox v-model="tableDataByKeys[scope.row.id][`connection_${scope.row.id}`]" @change="((val)=>{inputName(val, scope.row.id, 'connection_')})"></el-checkbox>
                    </template>
                </el-table-column>
                <el-table-column label="联系人组">
                    <template slot-scope="scope">
                        <div style="cursor:pointer">
                            <i class="el-icon-s-order" @click="selectContactGroups(scope.row)" style="font-size: 16px; color:#54b5ff"></i>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="监控项">
                    <template slot-scope="scope">
                        <div style="cursor:pointer">
                            <i class="el-icon-s-order" @click="selectMonitoring(scope.row)" style="font-size: 16px; color:#54b5ff;"></i>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="更多">
                    <template slot-scope="scope">
                        <div style="cursor:pointer">
                            <i class="el-icon-s-order" @click="showMoreSetting(scope.row)" style="font-size: 16px;color:#54b5ff"></i>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <!--        分页组件-->
        <el-pagination
                background
                layout="prev, pager, next"
                :total="pages.total"
                :page-size="pages.pageSize"
                @current-change = "changePage"
                class="pages">
        </el-pagination>

        <!--        联系人组组件-->
        <ContactGroups 
            :show.sync = "contactGroupsShow"
            :localData = "curTdData"
            @callBack = "getDeviceContact" />

        <!--        更多设置组件-->
        <MoreSetting 
        :show.sync = "showMoreSettingFlag" 
        :localData = "curTdData" 
        @callBack = "getMoreSetting"/>

        <!--   添加设备     -->
        <AddDevices
            :show.sync = "showAddDevicesFlag"
            :deviceGroups = "this.deviceGroups"
            @callBack = "getDeviceInfos"/>

        <BatchManage
                :show.sync = "showBatchManageFlag"
                :list="batchManageList" @callBack="getBatchMangeData"/>
    </div>
</template>

<script>
import { getDevices, getDeviceGroups, addDevice, deleteDevice, updateDevice } from '../services/services'
import ContactGroups from '../components/contact_groups'
import MoreSetting from '../components/more_setting'
import Search from '../components/search'
import AddDevices from '../components/add_device_component'
import BatchManage from '../components/batch_manage'
import { Select, Option, Input, Button, ButtonGroup, Badge, Tooltip, Table, TableColumn, Checkbox, Pagination } from 'element-ui'
import globalMixin from "../mixins/globalMixin";

export default {
    name: 'home',
    mixins:[globalMixin],
    components: {
        [Select.name]: Select,
        [Option.name]: Option,
        [Input.name]: Input,
        [Button.name]: Button,
        [ButtonGroup.name]: ButtonGroup,
        [Badge.name]: Badge,
        [Tooltip.name]: Tooltip,
        [Table.name]: Table,
        [TableColumn.name]: TableColumn,
        [Checkbox.name]: Checkbox,
        [Pagination.name]: Pagination,
        ContactGroups,
        MoreSetting,
        Search,
        AddDevices,
        BatchManage
    },
    data(){
        return {
            searchParams: {
                site: '',
                type: '',
                keywords: ''
            },
            pages: {
                total: 10,
                pageSize: 10,
                currentPage:1
            },
            tableData: [],              //表格数据
            tableDataByKeys:{},          //以id为key，对应表格数据的map，核心数据
            contactGroupsShow: false,    //打开选择联系人弹框
            curTdData: null,
            showMoreSettingFlag: false,     //显示更多设置开关
            showAddDevicesFlag: false,      //添加设备组件开关
            showBatchManageFlag: false,      //显示批量管理开关
            deviceGroups: [],
            tableSelectedData:[],            //表格选中的数据集合
            batchManageList: [],             //批量管理选中数据
            globaEditing: false              //全局开关，是否存在编辑
        }
    },
    mounted() {
        this.init();
    },
    methods: {
        /**
         * 获取初始化数据
         */
        async init(){
            this.getDevicesList();
            this.deviceGroups = await getDeviceGroups().then(res=>res.data);
            // this.tableDataByKeys = this.getPageTableData(this.tableData);
        },

        /**
         * @params {Object} 传入搜索条件参数
         *  获取设备的列表
         * */
        getDevicesList(params = {}){
            let { pages } = this;
            let _params = {
                page: pages.currentPage,
                limit: pages.pageSize,
                ...params
            };
            getDevices(_params).then(res=>{
                this.pages.total = res.total;
                let list = res.data;
                list = this.setArrItem(list, 'editing', false); //增加一个编辑状态字段
                this.tableData = list;
                this.tableDataByKeys = this.getPageTableData(list);
            });
        },

        /**
         * 点击打开选择联系人组
         */
        selectContactGroups(obj){
            if(!obj) return;
            this.curTdData= obj;
            this.contactGroupsShow = true;
        },

        /**
         * 获取页面维护数据
         */
        getPageTableData(arr){
            if(!arr || arr.length<=0) return {};
            let obj = {};
            arr.map(item=>{
                if(!obj[item.id]){
                    obj[item.id] = item;
                    obj[item.id][`name_${item.id}`] = item.name;  //设备名称model
                    obj[item.id][`ip_address_${item.id}`] = item.ip_address;  //IP地址 model
                    obj[item.id][`port_${item.id}`] = item.port;  //端口号 model
                    obj[item.id][`485_address_${item.id}`] = item['485_address'];  //协议id model
                    obj[item.id][`sort_${item.id}`] = item['sort'];  //协议id model
                    obj[item.id][`connection_${item.id}`] = item['connection']; //被动链接
                    obj[item.id][`registration_package_${item.id}`] = item['registration_package']; //注册包 model
                    obj[item.id][`device_group_id_${item.id}`] = item.device_group_id>0?item.device_group_id:"";  //设备名称model
                    obj[item.id][`contact_groups_${item.id}`] = item.contact_groups.length>0?item.contact_groups:[];  //联系人组 model

                }
            })
            return obj;
        },

        saveHandle(){
            console.log(this.tableDataByKeys);
            let { tableData } = this;
            const insertList = this.getSaveList(tableData);
            insertList.map(item=>{
                console.log(item);
                if(item.isNew){
                    addDevice(item).then(res=>{
                        if(res.data && res.data.id>0) {
                            this.$message.success(`【${item.name}】保存成功！`);
                            this.globaEditing = false;
                            this.init();
                        }
                    }).catch(()=>{
                        this.$message.error(`【${item.name}】保存失败！`);
                    })
                }else{
                    updateDevice(item).then(res=>{
                        if(res.data && res.data.status==="OK"){
                            this.$message.success('更新成功！');
                            this.globaEditing = false;
                            setTimeout(()=>{
                                this.init();
                            }, 30)
                        }else
                            this.$message.error(`【${item.name}】 更新失败！`)
                    })
                }
            })
            // addDevice
        },

        /**
         * 新增设备生成的数据
         * @param arr
         * @return Array
         */
        getSaveList(arr) {
            if(!arr || arr.length<=0) return [];
            let temp = [];
            arr =  arr.filter(item=>item.editing===true);
            arr.map(item=> {
                // if(item.isNew){
                    let id = item.id;
                    for (var key in item) {
                        item[key] = this.getStringToNumber(item[key]);
                    }
                    let contact_groups_ids = item[`contact_group_ids_${id}`] || item.contact_group_ids,
                        device_group_ids = (item[`device_group_ids_${id}`] || item.device_group_ids) || [item[`device_group_id_${id}`]];
                    if(!item.isNew) {
                        let tempContacts = [];
                        item[`contact_groups_${item.id}`].map(item=>{
                            tempContacts.push(item.id);
                        });
                        contact_groups_ids =tempContacts;
                    }
                    if (!!contact_groups_ids && contact_groups_ids.length <= 0){
                        this.$message.error('请选择联系人组！');
                        return false;
                    }
                    let _item = {
                        "id": item.id,
                        "name": item[`name_${id}`] || item.name,
                        "ip_address": item[`ip_address_${id}`] || item.ip_address,
                        "port": item[`port_${id}`] || item.port,
                        "protocol_id": item[`protocol_id_${id}`] || item['protocol_id'] || item[`485_address_${id}`] ,
                        "protocol_version": String(item[`protocol_version_${id}`] || item.protocol_version),
                        "connection_type": item[`connection_type_${id}`] || item.connection_type || "",
                        "connection": item[`connection_${id}`]!==undefined? item[`connection_${id}`] : item.connection,
                        "registration_package": String(item[`registration_package_${id}`] || item.registration_package),
                        "retry_count": item[`retry_count_${id}`] || item.retry_count,
                        "check_interval": item[`check_interval_${id}`] || item.check_interval,
                        "check_time_period_id": item[`check_time_period_id_${id}`] || item.check_time_period_id,
                        "notifications_time_period_id": item[`notifications_time_period_id_${id}`] || item.notifications_time_period_id,
                        "notifications_interval": item[`notifications_interval_${id}`] || item.notifications_interval,
                        "passive_enable": (item[`passive_enable_${id}`]!==undefined?item[`passive_enable_${id}`]:item.passive_enable) || item[`connection_${id}`],
                        "device_enabled": item[`device_enabled_${id}`]!==undefined?item[`device_enabled_${id}`]:item.device_enabled,
                        "notifications_enable": item[`notifications_enable_${id}`]!==undefined?item[`notifications_enable_${id}`]:item.notifications_enable,
                        "registration_enable": item[`registration_enable_${id}`]!==undefined?item[`registration_enable_${id}`]:item.registration_enable,
                        "protocol": item[`protocol_${id}`] || item.protocol,
                        "driver": item[`driver_${id}`] || item.driver || (item[`protocol_${id}`] || item.protocol),
                        "timeout": item[`timeout_${id}`] || item.timeout,
                        "device_template_id": item[`device_template_id_${id}`] || item.device_template_id || "",
                        "category_id": item[`category_id_${id}`] || item.category_id ,
                        "contact_group_ids": contact_groups_ids,//item[`contact_groups_ids_${id}`] || item.contact_groups_ids,
                        "device_group_ids": device_group_ids,//item[`device_groups_ids_${id}`] || item.device_groups_ids
                        "isNew": item.isNew!==undefined?item.isNew:false,
                        "sort": item[`sort_${id}`]
                    };
                    if(!_item.isNew)
                        delete _item['category_id'];

                    temp.push(_item);

                // }else {
                //     item = this.getSameKeyById(item);
                //     temp.push(item);
                // }
            })
            console.log(temp);
            return temp
        },

        getSameKeyById(item){
            let id = item.id,
                len = id.length+1;
            if(!item || !id) return {};
            for(let key in item) {
                let val = item[key];
                if(key.indexOf(`_${id}`)>-1) {
                    let localKey = key.substring(0, key.length-len);
                    item[localKey] = val;
                    delete item[key];
                }
            }
            return item;
        },

        /**
         *  字符串转数字
         **/
        getStringToNumber(value){
            if(value && typeof value==="string" && /^[0-9]*$/.test(value)){
                return parseInt(value);
            }else if(typeof value === 'number'){
                return value;
            }else{
                return value;
            }
        },

        /**
         * 修改input组件的值
         * @param value
         * @param id
         * @param prefix
         */
        inputName(value,id, prefix){
            prefix = prefix || 'name_';
            let keysTable = this.tableDataByKeys;
            try{
                keysTable[id][`${prefix+id}`] = value;
                keysTable[id]['editing'] = true;
                this.globaEditing = true;
                this.tableData = this.tableData.map(item=>{
                    return keysTable[item.id]
                });
                this.tableDataByKeys = keysTable;
            }catch (e) {
                console.log(e);
            }

        },

        /**
         * 设置联系人，回调
         * @param data type[object]
         */
        getDeviceContact(data) {
            const { id,contactGroups } = data;
            console.log('contactGroups:',contactGroups);
            if(!id) return;
            let arr = [];
            contactGroups.map(item=>arr.push(item.id));
            debugger
            this.inputName(arr, id, 'contact_group_ids_');
            this.inputName(contactGroups, id, 'contact_groups_');
            // console.log(this.tableData);
        },

        /**
         * 监控项
         * @param data
         */
        selectMonitoring(row){
            console.log(row);
        },

        /**
         * 显示更多设置
         * @param row
         */
        showMoreSetting(row){
            this.showMoreSettingFlag = true;
            this.curTdData = row;
        },

        /**
         *  更多设置回调函数，返回 id和 moreSetting。
         **/
        getMoreSetting(data){
            console.log(data);
            let { id, moreSetting } = data;
            if(!id || !moreSetting) return;
            this.tableData.map(item=>{
               if(item.id === id) {
                   for(let key in moreSetting) {
                       if(item[key]!==moreSetting[key]) {
                           item[key] = moreSetting[key];
                           item.editing = true;
                           this.globaEditing = true;
                       }

                   }
               }
            });
        },

        changePage(page){
            this.pages.currentPage = page;
            this.init();
        },

        /**
         * 搜索设备
         * @param data
         */
        searchEvent(data){
            console.log(data);
            let params = {
                category:data.type,
                device_group_id: data.site,
                ...data
            };
            delete params.type;
            delete params.site;
            if(!params.category)
                delete params.category
            this.getDevicesList(params);
        },

        /**
         * 添加设备组件派发事件返回的数据
         * @param data {Object}
         */
        getDeviceInfos(data){
            console.log(data, this.tableDataByKeys);
            let { tableData } = this,
                { newDataList } = data, //新增数据的数据源
                obj = {};
            obj = this.arrayToObjectById(newDataList);
            newDataList.map(item=>{
                if(item.amount>1){
                    for(let k = item.amount; k>0;k--){
                        let localItem = Object.assign({},item,{}); //拷贝item的值到新对象中，localItem 与 item 指向不同的内存地址
                        localItem.id = `${item.id}_${k}`;
                        localItem.name = `${item.name}_${k}`;
                        tableData.unshift(localItem);
                    }
                }else
                    tableData.unshift(item);
            });
            this.tableData = tableData;
            this.tableDataByKeys = this.getPageTableData(tableData)

            //刚添加进来的数据处于选中状态
            // this.tableData.map((item,index)=>{
            //     if(obj[item.id])
            //         setTimeout(()=>{
            //             this.$refs.myTable.toggleRowSelection(this.tableData[index],true);
            //         },30)
            // })
        },

        /**
         * 处于编辑状态的row添加格外的样式
         * @param row
         * @param rowIndex
         * @returns {string}
         */
        rowIsEditing({row}){
            if(!!row&&row.editing)
                return 'editing';
            else
                return ''
        },

        tableChange(val){
            this.tableSelectedData = val;
        },

        /**
         * 设备删除
         */
        deleteDevicesById(){
            this.tableSelectedData.map(item=>{
                let id = item.id;
                if(!id && !/^[0-9]*$/.test(id)) return;
                deleteDevice(id).then(res=>{
                    console.log(res);
                    if(res.status === 'OK'){
                        this.$message.success('删除成功！');
                        this.init();
                    }else
                        this.$message.error('删除失败！')

                }).catch(()=>this.$message.error('删除失败！'))
            });
        },

        /**
         * 点击批量操作功能
         * @return {boolean}
         */
        batchManageHandle(){
            let { tableSelectedData } = this;
            if(tableSelectedData.length<2){
                this.showBatchManageFlag = false;
                this.$message.error('至少选择两项进行操作！');
                return false;
            }
            this.batchManageList = this.tableSelectedData;
            this.showBatchManageFlag = true;
        },

        /**
         * 批量操作，返回数据
         * @param arr
         */
        getBatchMangeData(arr){
            console.log(arr);
        },
    }
}
</script>

<style lang="stylus">
.setting-device-wrap
    padding 40px
    text-align left
    font-size   12px
    .selectCon
        margin 0 8px
    .input-keyword
        width 185px
        margin-right: 8px;
        display inline-block
    .btnIcons
        display inline-block
        float right
    .el-badge__content.is-fixed.is-dot
        right 20px
        top 8px
    .content-tab
        width 100%
        min-height 580px
        margin-top 15px
        table
            font-size   12px
            text-align center
            th
                background-color #54b5ff
                color #fff
                font-weight normal
                text-align center
                font-size 14px
                padding 12px 0
            td
                text-align center
                padding 10px 0
                &:nth-child(1)
                    width 48px
                &:nth-child(2)
                    width 180px
                &:nth-child(3)
                    width 200px
                &:nth-child(4)
                    width 163px
            .el-input
                width 90%
        .editing
            .el-input__inner
                color green
    .pages
        text-align center
        margin-top 20px
        .el-pager li
            font-weight 500
</style>