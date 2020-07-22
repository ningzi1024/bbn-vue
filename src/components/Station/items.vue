<template>
    <div class="contain">
        <div class="station-search">
            <el-select v-model="statusId" placeholder="请选择监控项状态" @change="changeStatus">
                <el-option
                        v-for="item in statusArr"
                        :key="item.id"
                        :label="item.value"
                        :value="item.id">
                </el-option>
            </el-select>
            <el-input v-model="itemsParams.item_name" placeholder="请输入监控项名称" class="input-search"/>
            <el-button type="primary" icon="el-icon-search" @click="btnSearch">搜索</el-button>
            <div class="warning-excel">{{ $t('STATION.OUT_EXCEL') }}</div>
        </div>
        <div class="tables">
            <table>
                <tr>
                    <th><el-checkbox v-model="selectAll"/></th>
                    <th>监控项</th>
                    <th>状态</th>
                    <th>最近检查</th>
                    <th>持续时间</th>
                    <th>报警缓冲</th>
                    <th>信息</th>
                </tr>
                <tr v-for="item in itemsArr" :key="item.id">
                    <td>
                        <el-checkbox v-model="item[`checked_${item.item_id}`]"/>
                    </td>
                    <td>{{ item.item_name }}</td>
                    <td><span :class="getStatus(item.status_id)">{{ item.status_label }}</span></td>
                    <td>{{ momentFormat(item.last_check) }}</td>
                    <td>{{ getDurationString(item.duration) }}</td>
                    <td>{{ item.panding }}</td>
                    <td>{{ item.info }}</td>
                </tr>
                <tr class="noDataTxt" v-if="itemsArr.length<=0">
                    <td colspan="7"><span>--暂无数据--</span></td>
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
import { Checkbox, Pagination, Select, Input, Option, Button } from 'element-ui'
import {stationItems} from "../../services/services";
import globalMixin from "../../mixins/globalMixin";

export default {
    name: 'station-items',
    props:{
        deviceId:{
            type: Number,
            default: 0
        }
    },
    components:{
        [Checkbox.name]: Checkbox,
        [Pagination.name]: Pagination,
        [Select.name]: Select,
        [Option.name]: Option,
        [Input.name]: Input,
        [Button.name]: Button
    },
    mixins:[globalMixin],
    data(){
        return {
            checked: false,
            selectAll: false,
            pagesParams:{
                pages: 10,
                curPage: 1,
                total: 10
            },
            itemsParams: {
                device_id: 0,
                page: 1,
                limit: 10,
                status_id: '',
                item_name: ''
            },
            statusArr:[
                {id:1, value:'正常'},
                {id:2, value:'警告'},
                {id:3, value:'抖动'}
            ],
            statusId:'',
            itemsArr: []     //监控项列表
        }
    },
    methods: {
        /**
         * 分页变化时触发事件
         * @param page
         */
        curPageChange(page){
            this.pagesParams.curPage = page;
        },
        getItemsList(){
            this.itemsParams.device_id = this.deviceId;
            this.itemsParams.page = this.pagesParams.curPage;
            this.itemsParams.limit = this.pagesParams.pages;
            this.itemsParams.status_id = this.statusId;
            stationItems(this.itemsParams).then(res=>{
                let list = res.data;
                list.map(item=>{
                    item[`checked_${item.item_id}`] = false;
                })
                this.itemsArr = list;
            })
        },
        getStatus(id){
            if(id===1)
                return 'normal';
            else
                return 'error';
        },
        btnSearch(){
            let keyword = this.itemsParams.item_name;
            if(keyword!==undefined && keyword.trim()!=="")
                this.getItemsList();
        },
        changeStatus(id){
            this.statusId = id;
            this.getItemsList();
        }
    },
    watch:{
        deviceId(newVal){
            if(newVal){
                this.itemsArr = [];
                this.getItemsList();
            }
        }
    },
    mounted() {
        this.getItemsList();
    }
}
</script>

<style lang="stylus">
.contain
    .station-search
        display flex
        margin 10px 0 0 25px;
        .input-search
            width 250px
            margin 0 10px
        .warning-excel
            display inline-block
            color #428bca!important
            background url('../../assets/images/excel-output.png') no-repeat 0
            background-size: auto 100%
            padding 0 0 0 30px
            margin 10px 27px
            cursor pointer
    .noDataTxt
        /*background #fff!important*/
        span
            color #999
</style>