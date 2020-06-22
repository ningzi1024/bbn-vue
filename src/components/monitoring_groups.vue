<template>
    <div class="monitoring-wrap">
        <el-dialog
                class="monitoring-con"
                :title="`【${localData && localData.name || ''}】- 监控项`"
                :visible="show"
                width="100%"
                :close-on-click-modal="false"
                @close="btnCancel">
            <div class="opt">
                <Search type="MONITORINGS" @searchEvent="searchEvent"/>
                <div class="btnIcons">
                    <el-button-group>
                        <el-tooltip effect="dark" content="删除">
                            <el-button icon="el-icon-minus"></el-button>
                        </el-tooltip>
                        <el-tooltip effect="dark" content="保存">
                            <el-badge :is-dot="globalEditing" class="item">
                                <el-button class="share-button" icon="el-icon-tickets" @click="saveCofirm"></el-button>
                            </el-badge>
                        </el-tooltip>
                        <el-tooltip effect="dark" content="批量编辑">
                            <el-button icon="el-icon-collection" style="float: right"></el-button>
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
                    <el-table-column label="监控项名称">
                        <template slot-scope="scope">
                            <el-input
                                    size="small"
                                    v-model="tableObj[scope.row.id][`name_${scope.row.id}`]"
                                    @input="((val)=>{inputName(val, scope.row.id, 'name_')})">
                            </el-input>
                        </template>
                    </el-table-column>
                    <el-table-column label="监控项ID" prop="id"></el-table-column>
                    <el-table-column label="脚本" prop="script"></el-table-column>
                    <el-table-column label="联系人组">
                        <template slot-scope="scope">
                            <div style="cursor:pointer">
                                <i class="el-icon-s-order" @click="selectContactGroups(scope.row)" style="font-size: 16px; color:#54b5ff"></i>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="告警阈值">
                        <template slot-scope="scope">
                            <div style="cursor:pointer">
                                <i class="el-icon-s-order" @click="selectWarns(scope.row)" style="font-size: 16px; color:#54b5ff"></i>
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


    </div>
</template>

<script>
import Search from './items_search'
import ContactGroups from './contact_groups'
import MoreSetting from './more_setting'
import WarnSetting from './warn_setting'
import { Dialog, Button, Checkbox, Input, TableColumn, Table, Pagination} from 'element-ui'
import { getItems } from '../services/services'
import globalMixin from "../mixins/globalMixin";
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
        Search,
        ContactGroups,
        MoreSetting,
        WarnSetting
    },
    watch:{
        show(newVal){
            if(newVal===true){
                this.id = this.localData && this.localData.id
                this.getItemList({ device_id: this.localData.id});
            }
        }
    },
    data(){
        return {
            id: 0,
            tableData: [],
            tableObj:{},
            curTdData:{},
            pages: {
                total: 6,
                pageSize: 6,
                currentPage:1
            },
            globalEditing: true,       //全局编辑中
            showContactGroups: false,   //选择联系人开关
            showMoreSettingFlag: false, //更多设置开关
            showWarnSettingFlag: false
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
        selectContactGroups(obj){
            if(!obj) return;
            this.curTdData= obj;
            this.showContactGroups = true;
        },

        /**
         * 设置联系人组
         * @param data
         */
        getItemsContact(data){
            debugger
            const { id,contactGroups } = data;
            let { tableData } = this;
            if(id===undefined || contactGroups===undefined || contactGroups.length<=0) return;
            tableData.map(item=>{
                if(item.id === id){
                    item.contact_groups = contactGroups;
                    item.editing = true;
                }
            })
            this.resetData(tableData);
            // this.tableData = tableData;
            // this.tableObj = this.arrayToObjectById(tableData);
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
         * 告警阈值组件显示控制
         * @param data
         */
        selectWarns(data){
            this.showWarnSettingFlag = true;
            this.curTdData = data;
        },

        /**
         * 获取告警选择
         * @param data
         */
        getWarnSetting({id, list}){
            if(!id) throw 'id 不存在!'
            if(list && list.length>0) {
                let keysTable = Object.assign({},this.tableObj, {}) ;
                keysTable[id]['thresholds'] = list;
                this.tableData = this.tableData.map(item=>{
                    return keysTable[item.id]
                });
                this.tableObj = keysTable;
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
        saveCofirm(){
            debugger
            if(!this.globalEditing) return;
            this.confirmPop({
                title: '保存监控项',
                message: '确定保存或更新监控项信息吗？',
                success:()=>this.saveHandle()
            })
        },
        
        saveHandle(){

        }
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
            margin 20px 0
            height 400px
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
</style>