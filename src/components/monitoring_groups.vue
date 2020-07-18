<template>
    <div class="monitoring-wrap">
        <el-dialog
                class="monitoring-con"
                :title="`【${localData && localData.name || ''}】- ${$t('SETTING.ITEMS.ITEMS')}`"
                :visible="show"
                width="100%"
                top="5vh"
                :close-on-click-modal="false"
                @close="btnCancel">
            <div class="opt">
                <Search type="MONITORINGS" @searchEvent="searchEvent"/>
                <div class="btnIcons">
                    <el-button-group>
                        <el-tooltip effect="dark" content="删除" @click="deleteItemsConfirm">
                            <el-button icon="el-icon-minus"></el-button>
                        </el-tooltip>
                        <el-tooltip effect="dark" content="保存">
                            <el-badge :is-dot="globalEditing" class="item">
                                <el-button class="share-button" icon="el-icon-tickets" @click="saveConfirm"></el-button>
                            </el-badge>
                        </el-tooltip>
                        <el-tooltip effect="dark" content="批量编辑">
                            <el-button icon="el-icon-collection" style="float: right" @click="batchManageHandle"></el-button>
                        </el-tooltip>
                    </el-button-group>
                </div>
            </div>
            <div class="tabCon">
                <el-table
                    ref="myTable"
                    :data="tableData"
                    stripe
                    style="width: 100%"
                    :row-class-name="rowIsEditing"
                    @selection-change="tableChange"
                    border>
                    <el-table-column type="selection"/>
                    <el-table-column :label="$t('SETTING.ITEMS.ITEM_NAME')">
                        <template slot-scope="scope">
                            <el-input
                                    size="small"
                                    v-model="tableObj[scope.row.id][`name_${scope.row.id}`]"
                                    @input="((val)=>{inputName(val, scope.row.id, 'name_')})">
                            </el-input>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('SETTING.ITEMS.ITEM_ID')" prop="id"></el-table-column>
                    <el-table-column :label="$t('SETTING.ITEMS.SCRIPT')" prop="script"></el-table-column>
                    <el-table-column :label="$t('SETTING.ITEMS.CONTACT_GROUP')">
                        <template slot-scope="scope">
                            <div style="cursor:pointer">
                                <i class="el-icon-s-order" @click="selectContactGroups(scope.row)" style="font-size: 16px; color:#54b5ff"></i>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('SETTING.ITEMS.ALARM_THRESHOLD')">
                        <template slot-scope="scope">
                            <div style="cursor:pointer">
                                <i class="el-icon-s-order" @click="selectWarns(scope.row)" style="font-size: 16px; color:#54b5ff"></i>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('SETTING.ITEMS.MORE')">
                        <template slot-scope="scope">
                            <div style="cursor:pointer">
                                <i class="el-icon-s-order" @click="showMoreSetting(scope.row)" style="font-size: 16px;color:#54b5ff"></i>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <el-pagination
                    background
                    layout="prev, pager, next"
                    :total="pages.total"
                    :page-size="pages.pageSize"
                    @current-change = "changePage"
                    :current-page = "this.pages.currentPage"
                    class="pages">
            </el-pagination>
            <div slot="footer" class="dialog-footer">
                <el-button @click.stop="btnCancel" type="primary" size="medium">关 闭</el-button>
            </div>
        </el-dialog>

        <!--        联系人组组件-->
        <ContactGroups
                :show.sync = "showContactGroups"
                :localData = "curTdData"
                @callBack = "getItemsContact" />

        <!--        更多设置组件-->
        <MoreSetting
                :show.sync = "showMoreSettingFlag"
                :localData = "curTdData"
                model="items"
                @callBack = "getMoreSetting"/>

        <WarnSetting
                :show.sync = "showWarnSettingFlag"
                :localData = "curTdData"
                @callBack = "getWarnSetting"/>

        <!--        批量操作-->
        <BatchManage
                :show.sync = "showBatchManageFlag"
                model = "items"
                :list="batchManageList" @callBack="getBatchMangeData"/>

    </div>
</template>

<script>
import Search from './items_search'
import ContactGroups from './contact_groups'
import MoreSetting from './more_setting'
import WarnSetting from './warn_setting'
import BatchManage from '../components/batch_manage'
import { Dialog, Button, Checkbox, Input, TableColumn, Table, Pagination, Tooltip,Badge} from 'element-ui'
import {getItems, updateItem, deleteItemById, getItemsById} from '../services/services'
import globalMixin from "../mixins/globalMixin";
import Const from "../utils/const";
export default {
    name: 'monitoring_groups',
    mixins:[globalMixin],
    props:{
        show: {
            type: Boolean,
            default: false
        },
        //设备id
        localData:{
            type: Object,
            default: ()=>{}
        }
    },
    components:{
        [Dialog.name]: Dialog,
        [Button.name]: Button,
        [Checkbox.name]: Checkbox,
        [Input.name]: Input,
        [Table.name]: Table,
        [TableColumn.name]: TableColumn,
        [Pagination.name]: Pagination,
        [Tooltip.name]: Tooltip,
        [Badge.name]: Badge,
        Search,
        ContactGroups,
        MoreSetting,
        WarnSetting,
        BatchManage
    },
    watch:{
        show(newVal){
            if(newVal===true){
                this.getItemList({ device_id: this.localData.id});
            }
        }
    },
    data(){
        return {
            tableData: [],          /*表单数据*/
            tableObj:{},            /*表单数据model*/
            curTdData:{},           /*当前操作的表格行数据*/
            tableSelectedData:[],   /*选中的数据*/
            batchManageList:[],     /*参加批量操作的数据*/
            pages: {
                total: 6,
                pageSize: 6,
                currentPage:1
            },
            globalEditing: false,       //全局编辑中
            showContactGroups: false,   //选择联系人开关
            showMoreSettingFlag: false, //更多设置开关
            showWarnSettingFlag: false, //告警阈值显示开关
            showBatchManageFlag: false  //批量操作显示开关
        }
    },
    methods: {
        /**
         * 搜索返回参数
         * @param data
         */
        searchEvent(data){
            console.log(data);
            let params = {
                device_id: this.localData.id,
                ...data
            };
            this.getItemList(params);
        },

        /**
         * 关闭按钮
         */
        btnCancel(){
            this.pages.currentPage = 1;
            this.tableData = [];
            this.tableObj = {};
            this.curTdData = {};
            this.tableSelectedData = [];
            this.batchManageList = [];
            this.globalEditing = false;
            this.$emit('update:show', false);
        },

        /**
         * 获取监控项列表
         * @return {Promise<void>}
         */
        async getItemList(params = {}){
            const { pages } = this;
            const _params = {
                limit: pages.pageSize,
                page: pages.currentPage,
                ...params
            };
            const res = await getItems(_params).then(res=>res);
            this.pages.total = res.total;
            this.tableData = res.data;
            let temp = this.copyKeysByParam(res.data, 'id',['name']);
            this.tableObj = this.arrayToObjectById(temp);
            console.log(this.tableObj)
        },
        /**
         * 修改input组件的值
         * @param value
         * @param id
         * @param prefix
         */
        inputName(value,id, prefix){
            prefix = prefix || 'name_';
            let keysTable = this.tableObj;
            try{
                keysTable[id][`${prefix+id}`] = value;
                keysTable[id]['editing'] = true;
                this.globalEditing = true;
                this.tableData = this.tableData.map(item=>{
                    return keysTable[item.id]
                });
                this.tableObj = keysTable;
            }catch (e) {
                console.log(e);
            }

        },

        /**
         * 分页操作
         * @param curPage
         */
        changePage(curPage){
            this.pages.currentPage = curPage;
            this.getItemList({device_id: this.localData.id});
        },
        /**
         * 点击打开选择联系人组
         */
        async selectContactGroups(obj){
            if(!obj) return;
            this.curTdData= obj;
            //如果没有数据，去api里获取，并更新数据
            if(obj.contact_groups.length<=0) {
                let { tableData } = this;
                let data = await getItemsById(obj.id);
                obj.contact_groups = data.contact_groups;
                tableData.map(item=>{
                    if(item.id === obj.id)
                        item.contact_groups = data.contact_groups;
                });
                this.resetData(tableData);
            }
            this.showContactGroups = true;
        },

        /**
         * 设置联系人组
         * @param data
         */
        getItemsContact(data){
            const { id,contactGroups } = data;
            let { tableData } = this;
            if(id===undefined || contactGroups===undefined || contactGroups.length<=0) return;
            tableData.map(item=>{
                if(item.id === id){
                    item.contact_groups = contactGroups;
                    item.editing = true;
                    this.globalEditing = true;
                }
            })
            this.resetData(tableData);
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
            let { tableData } = this;
            tableData.map(item=>{
                if(item.id === id) {
                    item.editing = true;
                    for(let key in moreSetting) {
                        if(item[key]!==moreSetting[key]) {
                            item[key] = moreSetting[key];
                            this.globalEditing = true;
                        }
                    }
                }
            });
            this.resetData(tableData);
            // this.tableData = tableData;
            // this.tableObj = this.arrayToObjectById(tableData);
        },

        /**
         * 告警阈值组件控制
         * @param data
         */
        async selectWarns(obj){

            this.curTdData = obj;
            //如果没有数据，去api里获取，并更新数据
            if(obj.thresholds.length<=0) {
                let { tableData } = this;
                let data = await getItemsById(obj.id);
                obj.thresholds = data.thresholds;
                tableData.map(item=>{
                    if(item.id === obj.id)
                        item.thresholds = data.thresholds;
                });
                this.resetData(tableData);
            }
            this.showWarnSettingFlag = true;
        },

        /**
         * 获取告警选择
         * @param data
         */
        getWarnSetting({id, list}){
            console.log('list:',list);
            if(!id) throw 'id 不存在!'
            if(list && list.length>0) {
                let keysTable = Object.assign({},this.tableObj, {}) ;
                keysTable[id]['thresholds'] = list;
                this.tableData = this.tableData.map(item=>{
                    if(item.id===id)
                        item.editing = true;
                    return keysTable[item.id];
                });
                this.tableObj = keysTable;
                this.globalEditing = true;
            }
        },
        /**
         * 刷新数组，model数据
         * @param arr
         */
        resetData(arr){
            if( arr===undefined || Object.prototype.toString.call(arr) !== "[object Array]") return ;
            this.tableData = arr;
            let temp = this.copyKeysByParam(arr.slice(), 'id', ['name']);
            this.tableObj = this.arrayToObjectById(temp);
        },

        /**
         *  保存数据确认框
         **/
        saveConfirm(){
            if(!this.globalEditing) return;
            this.confirmPop({
                title: '保存监控项',
                message: '确定保存修改的监控项信息吗？',
                success:()=>this.saveHandle()
            })
        },

        /**
         * 保存更新监控项内容
         * */
        saveHandle(){
            let { tableData } = this;
            const insertList = this.getSaveList(tableData);
            let counter = insertList.length;
            if(!this.checkFormData(insertList)) return false;
            insertList.map(item=>{
                updateItem(item).then(res=>{
                    counter--;
                    let data = res.data;
                    if(data && data.status === 'OK'){
                        this.$message.success(`【${item.name}】 更新成功！`);
                        this.globalEditing = false;
                    }else{
                        this.$message.error(`【${item.name}】 更新失败！`);
                    }
                    setTimeout(()=>{
                        if(counter<=0)
                            this.getItemList({ device_id: this.localData.id});
                    }, 30)
                }).catch(()=>{
                    counter--;
                    this.$message.error(`【${item.name}】 更新失败！`);
                    if(counter<=0)
                        this.getItemList({ device_id: this.localData.id});
                })
            })
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
            arr.map( (item)=>{
                let id = item.id;
                let contact_group_ids = [],
                    thresholds = [...item.thresholds] || [];
                item.contact_groups.map(contact=>{
                    contact_group_ids.push(contact.id);
                });
                if(thresholds.length>0){
                    thresholds.map(threshold=>{
                        console.log('threshold', threshold);
                        if(threshold.alarm_level)
                            delete threshold['alarm_level'];
                        if(threshold[""])
                            delete threshold[""];
                        if(threshold.id)
                            delete threshold.id;
                    })
                }
                let _item = {
                    id:id,
                    "name": item[`name_${item.id}`] || item.name,
                    "description": item.cell_hook || "",
                    "cell_hook": item.cell_hook || "",
                    "retry_count": item.retry_count,
                    "item_enable": item.item_enable,
                    "check_interval": item.check_interval,
                    "check_time_period_id": item.check_time_period_id,
                    "notification_time_period_id": item.notification_time_period_id,
                    "notification_interval": item.notification_interval,
                    "notification_enable": item.notification_enable,
                    "threshold_type": item.threshold_type,
                    "unit": item.unit,
                    "contact_group_ids":contact_group_ids,
                    "thresholds": thresholds
                };
                temp.push(_item);
            })
            console.log(temp);
            return temp
        },

        /**
         * 表单数据验证
         * @param list
         * @return Boolean
         */
        checkFormData(list){
            if(list && list.length<=0) return false;
            let flag = true;
            list.map(item=>{
                let name = item[`name_${item.id}`] || item.name,
                    contact_groups_ids = item[`contact_group_ids_${item.id}`] || item.contact_group_ids,
                    thresholds = item.thresholds;
                if(name===undefined || !name || name=="") {
                    this.$message.error('监控项名不能为空！')
                    flag = false;
                    return false;
                }else if(Const.regExp.CHARACTERS.test(name)){
                    this.$message.error('设备名不能包含特殊字符！')
                    flag = false;
                    return false;
                }else if (!!contact_groups_ids && contact_groups_ids.length <= 0){
                    this.$message.error(`【${name}】请选择联系人组！`);
                    flag = false;
                    return false;
                }else if (!!thresholds && thresholds.length <= 0){
                    this.$message.error(`【${name}】请设置告警阈值！`);
                    flag = false;
                    return false;
                }
            });
            return flag;
        },


        /**
         *  删除框确认
         **/
        deleteItemsConfirm(){
            let { tableSelectedData } = this;
            if(tableSelectedData.length<=0){
                this.$message.error('请选中要删除的数据！');
                return false
            }
            this.confirmPop({
                message: '此操作将永久删除该监控项, 是否继续？',
                success:()=>this.deleteItems(),
                error:()=>{}
            });
        },

        /**
         * 删除选中监控项
         */
        deleteItems(){
            let selectTab = [...this.tableSelectedData],
                len = selectTab.length;
            selectTab.map(item=>{
                let id = item.id;
                if(!id && !/^[0-9]*$/.test(id)) return;
                deleteItemById(id).then(res=>{
                    len--;
                    if(res.status === 'OK'){
                        this.$message.success(`【${item.name}】删除成功！`);
                    }else
                        this.$message.error(`【${item.name}】删除失败！`);
                    if(len<=0)
                        this.getItemList({ device_id: this.localData.id});
                }).catch(()=>{
                    len--;
                    this.$message.error(`【${item.name}】删除失败！`);
                    if(len<=0)
                        this.getItemList({ device_id: this.localData.id});
                })
            })
        },
        /**
         * 表格选中项事件
         **/
        tableChange(val){
            this.tableSelectedData = val;
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
            this.batchManageList = [...this.tableSelectedData];
            this.showBatchManageFlag = true;
        },

        getBatchMangeData(arr){
            console.log(arr);
            let { tableData } = this;
            arr.map(item=>{
                tableData = this.mergeChangeArr(tableData,item);
            });
            this.resetData(tableData);
            this.saveHandle();
        },

    }
}
</script>

<style lang="stylus">
.monitoring-wrap
    font-size 12px
    .monitoring-con
        width 1440px
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
        .tabCon
            margin 15px 0
            /*height 400px*/
            height 35vh
            overflow-x hidden
            overflow-y auto
            table
                font-size 12px
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
                .editing
                    td
                        color green
                    .el-input__inner
                        color green
    .el-badge__content.is-fixed.is-dot
        right 20px
        top 8px
    .el-badge
        vertical-align baseline
</style>