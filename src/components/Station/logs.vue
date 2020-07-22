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
    name: 'logs',
    mixins:[globalMixin],
    components:{
        [Checkbox.name]: Checkbox,
        [Pagination.name]: Pagination,
        [Select.name]: Select,
        [Option.name]: Option,
        [Input.name]: Input,
        [Button.name]: Button
    },
    data(){
        return {
            itemsArr:[]
        }
    }
}
</script>

<style lang="stylus">

</style>
