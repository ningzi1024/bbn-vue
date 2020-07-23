<template>
    <div class="contain">
        <div class="station-search trend-search">
            <el-select v-model="item" @change="changeItem" class="selectCommon" placeholder="选择监控项">
                <el-option
                        v-for="item in this.itemsArr"
                        :key="item.id"
                        :label="item.value"
                        :value="item.id">
                </el-option>
            </el-select>
            <el-select v-model="searchParams.type" placeholder="选择时间" @change="changeTime" class="selectCommon" style="margin: 0 10px">
                <el-option
                        v-for="item in this.timeTypeArr"
                        :key="item.id"
                        :label="item.value"
                        :value="item.id">
                </el-option>
            </el-select>
            <el-date-picker
                    v-if="searchParams.type===5"
                    style="margin-right: 10px;"
                    v-model="datePicker"
                    type="datetimerange"
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
            </el-date-picker>
            <el-button type="primary" icon="el-icon-search" @click="btnSearch">{{ $t('COMMON.SEARCH') }}</el-button>
        </div>
        <div class="trends">
            <div class="myTrends" ref="myTrends" style="width: 1200px;height: 720px"></div>
        </div>
    </div>
</template>

<script>
import { Select, Option, Button, DatePicker } from 'element-ui';
import { getItemTrend, stationItems } from "../../services/services";
import echarts from 'echarts'
import globalMixin from "../../mixins/globalMixin";
export default {
    name: 'trends',
    mixins:[globalMixin],
    props:{
        deviceId: {
            type: Number,
            default:0
        }
    },
    components: {
        [Select.name]: Select,
        [Option.name]: Option,
        [Button.name]: Button,
        [DatePicker.name]: DatePicker
    },
    created() {
        this.timeTypeArr = [
            {id: 0, value: '4小时'},
            {id: 1, value: '24小时'},
            {id: 2, value: '本周'},
            {id: 3, value: '本月'},
            {id: 4, value: '本年'},
            {id: 5, value: '自定义'},
        ];
        this.getItemsList();
    },
    watch:{
        deviceId(newVal){
            console.log(newVal);
            this.getItemsList();
        }
    },
    data(){
        return {
            myChart:null,
            item: '',
            itemsArr:[],
            searchParams: {
                type: 0 , //时间段，0=>4小时、1=>24小时、2=>一周、3=>一个月、4=>一年、5=>自定义时间
                item_id: '',
                start: '',
                end: ''
            },
            data: [],
            datePicker: '',
            trendData: {}
        }
    },
    methods: {
        changeItem(){
            console.log('==================')
        },
        changeTime(){

        },

        async getItemsList(){
            const params = {
                device_id: this.deviceId,
            };
            let list = await stationItems(params).then(res=>res.data);
            let temp = [];
            if(list.length<=0) return ;
            list.map(item=>{
                temp.push({
                    id: item.item_id,
                    value: item.item_name
                })
            })
            this.item = temp[0].id;
            this.itemsArr = temp;
            this.getTrendData();
        },
        getTrendData(){
            this.searchParams.item_id = this.item;
            if(this.searchParams.type===5 && this.datePicker) {
                this.searchParams.start = this.momentFormat(this.datePicker[0], 'X');
                this.searchParams.end = this.momentFormat(this.datePicker[1], 'X');
            }else{
                this.searchParams.start = '';
                this.searchParams.end = '';
            }
            getItemTrend(this.searchParams).then(res=>{
               this.trendData = res;
               this.renderChart();
            });
        },
        btnSearch(){
            this.getTrendData();
        },
        renderChart(){
            let { trendData } = this;
            let xAxisData = [],
                yAxisData = [];
            if(trendData.Data.length<=0) return;
            let data = trendData.Data;
            data.map(item=>{
                xAxisData.push(this.momentFormat(item.time_stamp));
                yAxisData.push(item.value);
            });
            let option = {
                xAxis: {
                    type: "category",
                    data: xAxisData
                },
                yAxis: {
                    type: 'value',
                    boundaryGap: [0, '100%'],
                    splitLine: {
                        show: false
                    }
                },
                series: [{
                    name: '模拟数据',
                    type: 'line',
                    showSymbol: false,
                    hoverAnimation: false,
                    data: yAxisData
                }]
            };
            this.myChart.setOption(option);
        }
    },
    mounted() {
        this.myChart = echarts.init(this.$refs.myTrends);
    }
}
</script>

<style lang="stylus">
.trend-search
    .selectCommon
        width 210px
</style>