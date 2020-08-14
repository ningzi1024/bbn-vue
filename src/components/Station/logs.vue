<template>
    <div class="contain">
        <div class="station-search">
            <el-select v-model="itemType" @change="changeItemType" class="selectCommon" style="margin-right: 10px">
                <el-option
                        v-for="item in this.itemTypeArr"
                        :key="item.id"
                        :label="item.value"
                        :value="item.id">
                </el-option>
            </el-select>
            <el-select v-model="searchParams.type" placeholder="选择时间" @change="changeTime" class="selectCommon">
                <el-option
                        v-for="item in this.timeTypeArr"
                        :key="item.id"
                        :label="item.value"
                        :value="item.id">
                </el-option>
            </el-select>
            <el-select v-model="searchParams.value_type" placeholder="选择搜索类型" class="selectCommon" style="margin-left: 10px">
                <el-option
                        v-for="item in this.valueTypeArr"
                        :key="item.id"
                        :label="item.value"
                        :value="item.id">
                </el-option>
            </el-select>
            <el-input v-model="searchParams.value" placeholder="请输入搜索内容" class="input-search" style="width: 200px"/>
            <el-date-picker
                    v-if="searchParams.type===4"
                    style="margin-right: 10px;width: 360px"
                    v-model="datePicker"
                    type="datetimerange"
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
            </el-date-picker>
            <el-button type="primary" icon="el-icon-search" @click="btnSearch">{{ $t('COMMON.SEARCH') }}</el-button>
            <div class="warning-excel" @click="exportItemExcel">{{ $t('STATION.OUT_EXCEL') }}</div>
<!--            <OutTable :id="outTableData.id" :name="outTableData.name"/>-->

        </div>
        <div class="tables">
            <table v-show="itemType===1">
                <tr>
                    <th width="3%"><el-checkbox v-model="selectAll"/></th>
                    <th width="18%">时间</th>
                    <th width="12%">设备名称</th>
                    <th width="12%">触发的监控项</th>
                    <th width="10%">触发时的状态</th>
                    <th width="8%">尝试次数</th>
                    <th width="15%">详细信息</th>
                    <th>阀值</th>
                </tr>
                <tr v-for="item in tableData" :key="item.time">
                    <td><el-checkbox v-model="item[`checked_${item.time}`]"/></td>
                    <td>{{ item.time }}</td>
                    <td>{{ item.device }}</td>
                    <td>{{ item.item }}</td>
                    <td>{{ item.status_label }}</td>
                    <td>{{ item.panding }}</td>
                    <td>{{ item.info }}</td>
                    <td>{{ item.threshold }}</td>
                </tr>
                <tr class="noDataTxt" v-if="tableData.length<=0">
                    <td colspan="8"><span>--暂无数据--</span></td>
                </tr>
            </table>
            <table v-show="itemType===2">
                <tr>
                    <th width="3%"><el-checkbox v-model="selectAll"/></th>
                    <th width="15%">时间</th>
                    <th width="10%">联系人名称</th>
                    <th width="12%">设备名称</th>
                    <th width="10%">触发的监控项</th>
                    <th width="10%">触发时的状态</th>
                    <th width="10%">执行的动作</th>
                    <th width="15%">详细信息</th>
                    <th>阀值</th>
                </tr>

                <tr v-for="item in tableData" :key="item.time">
                    <td><el-checkbox v-model="item[`checked_${item.time}`]"/></td>
                    <td>{{ item.time }}</td>
                    <td>{{ item.name }}</td>
                    <td>{{ item.device }}</td>
                    <td>{{ item.item }}</td>
                    <td>{{ item.status_label }}</td>
                    <td>{{ item.cmd }}</td>
                    <td>{{ item.info }}</td>
                    <td>{{ item.threshold }}</td>
                </tr>
                
                <tr class="noDataTxt" v-if="tableData.length<=0">
                    <td colspan="9"><span>--暂无数据--</span></td>
                </tr>
            </table>
        </div>
        <div class="pages">
            <el-pagination
                    background
                    layout="prev, pager, next"
                    :total="pagesParams.total" @current-change="curPageChange">
            </el-pagination>
        </div>
    </div>
</template>

<script>
import { Checkbox, Pagination, Select, Input, Option, Button, DatePicker } from 'element-ui';
import { warnLogs, alarmlog } from "../../services/services";
import globalMixin from "../../mixins/globalMixin";
import { exportExcel } from "../../utils/xlsxUtil";
export default {
    name: 'logs',
    mixins:[globalMixin],
    props:{
        deviceId: {
            type: Number,
            default:0
        }
    },
    components:{
        [Checkbox.name]: Checkbox,
        [Pagination.name]: Pagination,
        [Select.name]: Select,
        [Option.name]: Option,
        [Input.name]: Input,
        [Button.name]: Button,
        [DatePicker.name]: DatePicker
    },
    created() {
        this.valueTypeArr = [
            {id:0, value:'设备名称'},
            {id:1, value:'监控项名称'},
            {id:2, value:'重试次数'},
            {id:3, value:'状态'},
            {id:4, value:'信息'},
            {id:5, value:'阈值'}
        ];
        this.timeTypeArr = [
            {id:0, value:'今天'},
            {id:1, value:'本周'},
            {id:2, value:'本月'},
            {id:3, value:'本年'},
            {id:4, value:'自定义'}
        ];
        this.itemTypeArr = [
            {id: 1, value: '告警日志'},
            {id: 2, value: '通知日志'},
        ];
    },
    data(){
        return {
            selectAll:false,
            tableData: [],
            timeType: '',
            itemType: 1,
            pagesParams:{
                pages: 10,
                curPage: 1,
                total: 10
            },
            searchParams: {
                page: 1,
                limit: 10,
                search:0,
                type: 0,    //时间段，0=>今天、1=>本周、2=>本月、3=>本年、4=>自定义时间
                value_type: '', //类型，0=>设备名称、1=>监控项名称、2=>重试次数、3=>状态、4=>信息、5=>阈值
                value: '',
                start: '', //开始时间戳
                end: ''  //结束时间戳
            },
            datePicker:''
        }
    },
    watch: {
        deviceId(newVal){
            if(newVal){
                this.pagesParams.curPage = 1;
                this.pagesParams.total = 10;
                this.getPageList();
            }
        }
    },
    mounted() {
        if(this.deviceId)
            this.getPageList();
    },
    methods: {
        /**
         * 选择类别
         */
        changeItemType(){
            this.searchParams = {
                page: 1,
                limit: 10,
                search:0,
                type: 0,
                value_type: '',
                value: '',
                start: '',
                end: ''
            };
            this.pagesParams = {
                pages: 10,
                curPage: 1,
                total: 10
            };
            this.getPageList();
        },

        /**
         * 选择时间
         * @param val
         */
        changeTime(val){
            if(val!==4){
                this.datePicker = "";
                this.pagesParams.curPage = 1;
                this.pagesParams.total = 10;
                this.searchParams.start = '';
                this.searchParams.end = '';
                this.getPageList();
            }
        },

        curPageChange(page){
            this.pagesParams.curPage = page;
            this.getPageList();
        },

        /**
         * 搜索事件
         */
        btnSearch(){
            this.pagesParams.curPage = 1;
            this.pagesParams.total = 10;
            this.getPageList();
        },
        /**
         * 获取当前页数据
         */
        getPageList(){
            let type = this.itemType;
            this.tableData = [];
            if(type===1)
                this.getWarnLogs();
            else if(type===2)
                this.getAlarmLogs();
        },

        /**
         * 获取告警日志
         */
        getWarnLogs(){
            let searchParams = this.getParams();
            warnLogs(searchParams).then(res=>{
                res.data && res.data.map(item=>{
                    item[`checked_${item.time}`] = false;
                    item.time = this.momentFormat(item.time)
                })
                this.tableData = res.data;
                this.pagesParams.total = res.total;
            })
        },
        getAlarmLogs(){
            let searchParams = this.getParams();
            alarmlog(searchParams).then(res=>{
                res.data && res.data.map(item=>{
                    item[`checked_${item.time}`] = false;
                    item.time = this.momentFormat(item.time)
                })
                this.tableData = res.data;
                this.pagesParams.total = res.total;
            });
        },
        /**
         * 获取请求参数
         * @returns {default.methods.searchParams}
         */
        getParams(){
            let { searchParams, pagesParams, datePicker } = this;
            searchParams.limit = pagesParams.pages;
            searchParams.page = pagesParams.curPage;
            searchParams.device_group_id = this.deviceId;
            if(searchParams.value_type && searchParams.value)
                searchParams.search = 1;
            else
                searchParams.search = 0;
            if(searchParams.type==4 && datePicker!=undefined && datePicker!=""){
                searchParams.start = this.momentFormat(datePicker[0], 'X');
                searchParams.end = this.momentFormat(datePicker[1], 'X');
            }else{
                searchParams.start = '';
                searchParams.end = '';
            }
            return searchParams;
        },
        /**
         * 导出Excel表
         */
        exportItemExcel(){
            let fileName = this.itemType===1?'告警日志':'通知日志';
            const warnHeader = {
                time: '时间',
                device: '设备名称',
                item: '触发的监控项',
                status_label: '触发时的状态',
                panding: '尝试次数',
                info: '详细信息',
                threshold: '阈值'
            };
            const noticeHeader = {
                time: '时间',
                name: '联系人名称',
                device: '设备名称',
                item: '触发的监控项',
                status_label: '触发时的状态',
                cmd: '执行的动作',
                info: '详细信息',
                threshold: '阈值'
            };
            let header = this.itemType ===1?warnHeader:noticeHeader;
            exportExcel(this.tableData, header, fileName+'.xlsx', {});
        }
    }
}
</script>

<style lang="stylus">
.station-search
    >.selectCommon
        width 150px
</style>
