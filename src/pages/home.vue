<template>
    <div class="setting-device-wrap">
        <div class="opts">
            <el-select v-model="searchParams.site" placeholder="查找站点">
                <el-option
                        v-for="item in searchParams.sites"
                        :key="item.name"
                        :label="item.name"
                        :value="item.id">
                </el-option>
            </el-select>
            <el-select v-model="searchParams.types" placeholder="查找类型" class="selectCon">
                <el-option
                        v-for="item in searchParams.types"
                        :key="item.value"
                        :label="item.value"
                        :value="item.value">
                </el-option>
            </el-select>
            <div class="input-keyword">
                <el-input placeholder="请输入内容" v-model="searchParams.keywords" class="input-with-select">
                    <el-button slot="append" icon="el-icon-search"></el-button>
                </el-input>
            </div>
            <el-button icon="el-icon-delete">清除</el-button>
            <div class="btnIcons">
                <el-button-group>
                    <el-tooltip effect="dark" content="增加">
                        <el-button icon="el-icon-plus"></el-button>
                    </el-tooltip>
                    <el-tooltip effect="dark" content="删除">
                        <el-button icon="el-icon-minus"></el-button>
                    </el-tooltip>
                    <el-tooltip effect="dark" content="保存">
                        <el-badge is-dot class="item">
                            <el-button class="share-button" icon="el-icon-tickets" @click="saveHandle"></el-button>
                        </el-badge>
                    </el-tooltip>
                    <el-tooltip effect="dark" content="批量编辑">
                        <el-button icon="el-icon-collection" style="float: right"></el-button>
                    </el-tooltip>
                </el-button-group>
            </div>
        </div>
        <div class="content-tab">
            <el-table
                   :data="tableData"
                   style="width: 100%"
                   border>
                <el-table-column type="selection"/>
                <el-table-column
                       label="设备名称">
                    <template slot-scope="scope">
                        <el-input
                                v-model="tableDataByKeys[scope.row.id][`name_${scope.row.id}`]"
                                class="input-with-select"
                                @input="((val)=>{inputName(val, scope.row.id, 'name_')})">
                        </el-input>
                    </template>
                </el-table-column>
                <el-table-column label="站点">
                    <template slot-scope="scope">
                        <el-select v-model="tableDataByKeys[scope.row.id][`device_group_id_${scope.row.id}`]" placeholder="请选择机房">
                            <el-option
                                    v-for="item in scope.row.device_groups"
                                    :key="item.name"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column label="分类">
                    <template slot-scope="scope">
                        <el-input
                                v-model="tableDataByKeys[scope.row.id][`sort_${scope.row.id}`]"
                                @input="((val)=>{inputName(val, scope.row.id, 'sort_')})">
                        </el-input>
                    </template>
                </el-table-column>
                <el-table-column label="IP地址">
                    <template slot-scope="scope">
                        <el-input
                                v-model="tableDataByKeys[scope.row.id][`ip_address_${scope.row.id}`]"
                                @input="((val)=>{inputName(val, scope.row.id, 'ip_address_')})">
                        </el-input>
                    </template>
                </el-table-column>
                <el-table-column label="端口号">
                    <template slot-scope="scope">
                        <el-input
                                v-model="tableDataByKeys[scope.row.id][`port_${scope.row.id}`]"
                                @input="((val)=>{inputName(val, scope.row.id, 'port_')})">
                        </el-input>
                    </template>
                </el-table-column>
                <el-table-column label="协议ID">
                    <template slot-scope="scope">
                        <el-input
                                v-model="tableDataByKeys[scope.row.id][`485_address_${scope.row.id}`]"
                                @input="((val)=>{inputName(val, scope.row.id, '485_address_')})">
                        </el-input>
                    </template>
                </el-table-column>
                <el-table-column label="被动连接注册包">
                    <template slot-scope="scope">
                        <el-input
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
                            <i class="el-icon-s-order" @click="selectContactGroups(scope.row)" style="font-size: 16px"></i>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="监控项">
                    <template slot-scope="scope">
                        <div style="cursor:pointer">
                            <i class="el-icon-s-order" @click="selectMonitoring(scope.row)" style="font-size: 16px"></i>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="更多">
                    <template slot-scope="scope">
                        <div style="cursor:pointer">
                            <i class="el-icon-s-order" @click="showMoreSetting(scope.row)" style="font-size: 16px"></i>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <ContactGroups 
            :show.sync = "contactGroupsShow"
            :localData = 'curTdData'
            @callBack = "getDeviceContact" />
    </div>
</template>

<script>
import { getDevices } from '../services/services'
import ContactGroups from '../components/contact_groups'
import { Select, Option, Input, Button, ButtonGroup, Badge, Tooltip, Table, TableColumn, Checkbox } from 'element-ui'
export default {
    name: 'home',
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
        ContactGroups
    },
    data(){
        return {
            searchParams: {
                site: '',
                type: '',
                keywords: ''
            },
            sites: [],                  //站点数据
            types: [],                  //类型数据
            tableData: [
                // {
                //     "id": 24,
                //     "name": "新建主机1",
                //     "device_group": "",
                //     "device_group_id": 0,
                //     "sort": "",
                //     "port": 1985,
                //     "ip_address": "192.168.1.110",
                //     "485_address": 0,
                //     "connection": true,
                //     "registration_package": "3",
                //     "device_groups": [
                //         {
                //             "id": 8,
                //             "name": "广东总部机房"
                //         },
                //         {
                //             "id": 7,
                //             "name": "1513512"
                //         },
                //         {
                //             "id": 6,
                //             "name": "新增项3"
                //         },
                //         {
                //             "id": 3,
                //             "name": "东莞机房"
                //         },
                //         {
                //             "id": 2,
                //             "name": "广东机房"
                //         },
                //         {
                //             "id": 1,
                //             "name": "北京机房"
                //         }
                //     ],
                //     "check_interval": 10,
                //     "retry_count": 3,
                //     "check_time_period": "",
                //     "check_time_period_id": 3,
                //     "notifications_time_period": "",
                //     "notifications_time_period_id": 2,
                //     "notifications_interval": 3600,
                //     "protocol": "cell",
                //     "passive_enable": true,
                //     "notifications_enable": true,
                //     "device_enabled": true,
                //     "zigbee_enabled": false,
                //     "physical_address": "",
                //     "contact_groups": []
                // }
            ],              //表格数据
            tableDataByKeys:{},          //以id为key，对应表格数据的map，核心数据
            contactGroupsShow: false,    //打开选择联系人弹框
            curTdData: null,
            showMoreSettingFlag: false     //显示更多设置开关
        }
    },
    mounted() {
        this.init();
    },
    methods: {
        /**
         * 获取初始化数据
         */
        init(){
            getDevices().then(res=>{
                this.tableData = res.data;
                this.tableDataByKeys = this.getPageTableData(res.data);
                // console.log(this.tableDataByKeys);
            })

            // this.tableDataByKeys = this.getPageTableData(this.tableData);
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
                console.log(item['passive_enable']);
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
            keysTable[id][`${prefix+id}`] = value;
            this.tableData = this.tableData.map(item=>{
                return keysTable[item.id]
            });
            // console.log(this.tableData);
            this.tableDataByKeys = keysTable;
        },

        /**
         * 设置联系人，回调
         * @param data type[object]
         */
        getDeviceContact(data) {
            console.log(data);
            const { id,contactGroups } = data;
            if(!id) return;
            this.inputName(contactGroups,id, 'contact_groups_');
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
            console.log(row);
        }
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
        margin-top 15px
        table
            font-size   12px
            text-align center
            th
                background-color #54b5ff
                color #fff
                font-weight normal
                text-align center
                padding 10px 0
            td
                text-align center
                padding 8px 0
            .el-input
                width 80%
</style>