<template>
    <el-dialog
        class="add-device-wrap"
        width="100%"
        title="添加设备"
        :visible="show"
        :close-on-click-modal="false"
        @close="btnCancel">
        <div class="templateCon">
            <div class="treeCon">
                <el-tree
                    :data="treeData"
                    @check-change="treeChange"
                    show-checkbox
                    node-key="id"
                    ref="myTree"
                    highlight-current>
                </el-tree>
            </div>
            <div class="opts">
                <el-button type="primary" icon="el-icon-arrow-right" size="mini" @click="joinToTable" >加入</el-button>
                <el-button type="warning" icon="el-icon-arrow-left"  size="mini" @click="removeTabData">移除</el-button>
            </div>
            <div class="new-devices-tab">
                <el-table
                        :data="tableData"
                        stripe
                        border
                        @selection-change = "selectDataChange"
                        ref="multipleTable"
                        style="width: 100%" height="300px">
                    <el-table-column type="selection"/>
                    <el-table-column label="设备名称">
                        <template slot-scope="scope">
                            <el-input
                                    size="small"
                                    v-model="tabObj[scope.row.id][`model_${scope.row.id}`]"
                                    @input="((val)=>{inputName(val, scope.row.id, `model_${scope.row.id}`)})">
                            </el-input>
                        </template>
                    </el-table-column>
                    <el-table-column label="数量">
                        <template slot-scope="scope">
                            <el-input
                                    size="small"
                                    v-model="tabObj[scope.row.id][`amount_${scope.row.id}`]"
                                    @input="((val)=>{inputName(val, scope.row.id, `amount_${scope.row.id}`)})">
                            </el-input>
                        </template>
                    </el-table-column>
                    <el-table-column label="IP地址">
                        <template slot-scope="scope">
                            <el-input
                                    size="small"
                                    v-model="tabObj[scope.row.id][`ipv4_${scope.row.id}`]"
                                    @input="((val)=>{inputName(val, scope.row.id, `ipv4_${scope.row.id}`)})">
                            </el-input>
                        </template>
                    </el-table-column>
                    <el-table-column label="协议ID">
                        <template slot-scope="scope">
                            <el-input
                                    size="small"
                                    v-model="tabObj[scope.row.id][`protocol_id_${scope.row.id}`]"
                                    @input="((val)=>{inputName(val, scope.row.id, `protocol_id_${scope.row.id}`)})">
                            </el-input>
                        </template>
                    </el-table-column>
                    <el-table-column label="站点" >
                        <template slot-scope="scope">
                            <el-select
                                    v-model="tabObj[scope.row.id][`device_${scope.row.id}`]"
                                    placeholder="选择站点"
                                    size="small"
                                    @change="(val)=>selectChange(val, scope.row.id)">
                                <el-option
                                        v-for="item in deviceGroups"
                                        :key="item.name"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
<!--                    <el-table-column label="联系人组">-->
<!--                        <template slot-scope="scope">-->
<!--                            <div style="cursor:pointer">-->
<!--                                <i class="el-icon-s-order" @click="selectContactGroups(scope.row)" style="font-size: 16px; color:#54b5ff"></i>-->
<!--                            </div>-->
<!--                        </template>-->
<!--                    </el-table-column>-->

                </el-table>
            </div>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button @click.stop="btnCancel">取 消</el-button>
            <el-button type="primary" @click="btnSure">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>
import { Dialog, Button, Table, TableColumn, Tree, Input, Select, Option } from 'element-ui'
import { getDeviceTemplates } from '../services/services'
import globalMixin from '../mixins/globalMixin'
import Const from '../utils/const'
export  default {
    name: 'addDevice',
    mixins:[globalMixin],
    props: {
        // 弹窗开关
        show: {
            type: Boolean,
            default: true
        },
        //站点列表
        deviceGroups: {
            type: Array,
            default: ()=>[]
        }
    },
    components: {
        [Dialog.name]: Dialog,
        [Button.name]: Button,
        [Table.name]: Table,
        [TableColumn.name]: TableColumn,
        [Tree.name]: Tree,
        [Input.name]: Input,
        [Select.name]: Select,
        [Option.name]: Option
    },
    data(){
        return {
            tableData: [],      //右侧表格事件
            tabObj: {},
            tempTabData: [],
            treeData: [],       //左侧树形结构数据
            treeDataSelected: [], //树形菜单选中的数据
            selectTabData: []   //表格选中的数据
        }
    },
    watch:{
        show(newVal){
         if(newVal===true)
             this.deviceTemplates();
        }
    },
    mounted() {
        // this.deviceTemplates();
    },
    methods: {
        /**
         *  取消按钮
         */
        btnCancel() {
            this.tableData = [];
            this.tabObj = {};
            this.tempTabData = [];
            this.treeData = [];
            this.selectTabData = [];
            this.$emit('update:show', false);
        },

        /**
         * 确定按钮事件
         */
        btnSure(){
            let { tableData } = this;
            let data = {}, tabList = [], flag = true;
            tableData.map((item)=>{
                if(!this.checkForm(item)){
                    flag = false;
                    return;
                }
                let id = item.id;
                tabList.push({
                    amount: item[`amount_${id}`],
                    device_group_id: item[`device_${id}`],
                    id: item.id,
                    name: item[`model_${id}`],
                    ipv4: item[`ipv4_${id}`],
                    ip_address: item[`ipv4_${id}`],
                    port: item[`port_${id}`],
                    protocol_version: item.protocol_version||'1',
                    connection_type: item.connection_type||1,
                    registration_package: item.registration_package||'1',
                    retry_count: item.retry_count||3,
                    check_interval: item.check_interval||3,
                    check_time_period_id: item.check_time_period_id||3,
                    notifications_time_period_id: item.notifications_time_period_id||2,
                    notifications_interval: item.notifications_interval||3600,
                    passive_enable: item.passive_enable!==undefined? item.passive_enable : true,
                    device_enabled:item.device_enabled!==undefined ? item.device_enabled : true,
                    notifications_enable: item.notifications_enable!==undefined?item.notifications_enable:true,
                    registration_enable: item.registration_enable!==undefined?item.registration_enable:true,
                    protocol: item.driver||'',
                    driver: item.driver,
                    timeout: item.timeout||100,
                    device_template_id: item.type,
                    category_id: item[`category_id_${id}`],
                    contact_group_ids: [],
                    // items:[],
                    device_group_ids: [item[`device_${id}`]],
                    connection: item.connection!==undefined?item.connection:false,
                    contact_groups:[],
                    "485_address": item[`protocol_id_${id}`] || "",
                    protocol_id: item[`protocol_id_${id}`] || "",
                    sort: item[`category_${id}`] || "",
                    editing: true,      //编辑状态
                    device_groups: this.deviceGroups,  //机房信息
                    isNew: true         //是否是新添加的数据
                });
            });
            if(!flag) return;
            // console.log(tabList);
            data.newDataList = tabList;
            this.$emit('callBack', data);
            this.btnCancel();
        },

        /**
         * 获取设备模板
         */
        async deviceTemplates(){
            // let data = [{
            //     "id": 5,
            //     "category_id": 2,
            //     "category": "UPS",
            //     "brand_id": 1,
            //     "brand": "大榕树",
            //     "subject": "配电",
            //     "model": "ea_ups",
            //     "name": "UPS",
            //     "ipv4": "192.168.1.121",
            //     "ipv6": "",
            //     "port": 1985,
            //     "protocol_id": 1,
            //     "protocol_version": "1",
            //     "connection_type": 0,
            //     "registration_package": "1",
            //     "retry_count": 2,
            //     "check_interval": 3,
            //     "check_time_period_id": 1,
            //     "notification_time_period_id": 1,
            //     "notification_interval": 1,
            //     "passive_enable": true,
            //     "check_enable": true,
            //     "notification_enable": true,
            //     "registration_enable": true,
            //     "driver": "ea_ups",
            //     "timeout": 10
            // }];
            let data = await getDeviceTemplates().then(res=>res.data);
            this.treeData = this.arrayToTree(data);
        },

        /**
         * 修改数据
         * @param val
         * @param id
         * @param name
         */
        inputName(val, id ,name){
            let { tabObj,tableData } = this;
            tabObj[id][name] = val;
            this.tabObj = tabObj;
            this.tableData = tableData.map(item=>{
                return tabObj[item.id]
            });
        },

        selectContactGroups(data){
            console.log(data);
        },

        /**
         * 表格选中项目
         * @param data
         */
        selectDataChange(data){
            console.log(data);
            this.selectTabData = data;
        },

        /**
         * 选中数据加入到表格中
         */
        joinToTable(){
            // debugger
            let { tempTabData, treeDataSelected } = this;
            let checkNodes = treeDataSelected;//this.$refs.myTree.getCheckedNodes();
            // let arr = checkNodes.filter(item=>item.id>0);
            console.log(this.treeDataSelected);
            let arr2 = Object.assign([],checkNodes,[]);

            arr2.map(item=>{
                if(!item.amount)
                    item.amount = 1;
                if(!item.device)
                    item.device = 1;
            });
            arr2 = this.replaceKey(Object.assign([],arr2,[]),'id','type');
            arr2  = this.copyKeysByParam(Object.assign([],arr2,[]), 'id');
            this.tempTabData = tempTabData.concat(Object.assign([],arr2,[]));
            this.tabObj = this.arrayToObjectById(this.tempTabData);
            this.tableData = this.tableData.concat(Object.assign([],arr2,[]));
            // this.$refs.myTree.setCheckedKeys([])
            // this.deviceTemplates();
        },
        /**
         * 移除表格选中项数据
         */
        removeTabData(){
            let { selectTabData, tableData} = this;
            let selectTabObj = {};
            selectTabData.map(item=>{
                if(!selectTabObj[item.id])
                    selectTabObj[item.id] = item;
            });
            this.tableData = tableData.filter(item=> !selectTabObj[item.id]);
        },

        /**
         * 选择站点change事件
         * @param data
         */
        selectChange(selectId, id){
            console.log('selectChange', selectId);
            this.inputName(selectId,id, `device_${id}`)
        },

        /**
         * 表单验证，不能为空
         * @param data
         * @returns {boolean}
         */
        checkForm(data){
            let id = data.id;
            if(!data[`model_${id}`]){
                this.$message.error('请填写设备名称！');
                return false;
            }else if(!data[`amount_${id}`]){
                this.$message.error('请填写设备数量！');
                return false;
            }else if(!Const.regExp.INTEGER.test(data[`amount_${id}`])){
                this.$message.error('设备数量必须是正整数！');
                return false;
            }else if(!data[`ipv4_${id}`]){
                this.$message.error('请填写IP地址！');
                return false;
            }else if(!Const.regExp.IP.test(data[`ipv4_${id}`])){
                this.$message.error('请填写正确的IP地址！');
                return false;
            }else if(!data[`protocol_id_${id}`]){
                this.$message.error('请填写协议ID！');
                return false;
            }else if(!Const.regExp.INTEGER.test(data[`protocol_id_${id}`])){
                this.$message.error('协议ID必须是正整数！');
                return false;
            }else if(!data[`device_${id}`]){
                this.$message.error('请选择站点！');
                return false;
            }
            return true;
        },

        treeChange(obj, selected, childrenSelected){
            let selectedData = this.$refs.myTree.getCheckedNodes();
            this.treeDataSelected = selectedData.filter(item=>item.id>0);
            // console.log(this.treeDataSelected);
        }
    }
}
</script>

<style lang="stylus">
.add-device-wrap
    font-size 12px
    width 1260px
    margin 0 auto
    .el-dialog__header
        background #2fa1f7
        padding 12px 20px 8px
        .el-dialog__title
            color #fff
            font-size 15px
        .el-dialog__headerbtn
            top 12px
            .el-dialog__close
                color #fff
    .templateCon
        width 100%
        padding 20px 10px
        position: relative
        .treeCon
            width 230px
            height 315px
            overflow-x hidden
            overflow-y auto
            border 1px solid #c8c8ca
            display inline-block
        .opts
            display inline-block
            width 100px
            height 315px
            position: relative;
            .el-button
                position absolute
                &:nth-child(1)
                    top 35%
                    left 50%
                    margin-left -28px
                &:nth-child(2)
                    top 52%
                    left 50%
                    margin-left -28px
            .el-button--mini, .el-button--mini.is-round
                padding 7px 9px        
        .new-devices-tab
            width 860px
            height 315px
            display inline-block
            /*float right*/
            border 1px solid #c8c8ca
            overflow-x hidden
            overflow-y auto
            position absolute
            right 0
            table
                font-size   12px
                text-align center
                width 100%
                th
                    background-color #54b5ff
                    color #fff
                    font-weight normal
                    text-align center
                    font-size 14px
                    padding 12px 0
                td
                    text-align center
</style>