<template>
    <el-dialog
            class="warn-setting-wrap"
            width="100%"
            :title="`【${localData && localData.name || ''}】- 告警阈值`"
            :visible="show"
            :close-on-click-modal="false"
            @close="btnCancel">
        <div class="warn-btnIcons">
            <el-button-group>
                <el-tooltip effect="dark" content="删除"  @click="deleteHandle">
                    <el-button icon="el-icon-minus" size="small"></el-button>
                </el-tooltip>
                <el-tooltip effect="dark" content="增加">
                    <el-badge is-dot class="item">
                        <el-button class="share-button"  size="small" icon="el-icon-plus" @click="addHandle"></el-button>
                    </el-badge>
                </el-tooltip>
            </el-button-group>
        </div>
        <div class="tabCon">
            <el-table
                    ref="myTable"
                    :data="tableData"
                    stripe
                    style="width: 100%"
                    @selection-change="tableChange">
                <el-table-column type="selection"/>
                <el-table-column label="类型">
                    <template slot-scope="scope">
                        <span>{{ getType(localData.threshold_type) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="参数" width="160">
                    <template slot-scope="scope">
                        <div class="input-line">
                            <span>最大值</span>
                            <el-input
                                size="small"
                                v-model="tableObj[scope.row.id][`max_${scope.row.id}`]"
                                @input="((val)=>{inputName(val, scope.row.id, 'max_')})">
                            </el-input>
                        </div>
                        <div class="input-line">
                            <span>最小值</span>
                            <el-input
                                size="small"
                                v-model="tableObj[scope.row.id][`min_${scope.row.id}`]"
                                @input="((val)=>{inputName(val, scope.row.id, 'min_')})">
                            </el-input>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="告警等级">
                    <template slot-scope="scope" v-if="tableObj[scope.row.id][`max_${scope.row.id}`] && tableObj[scope.row.id][`min_${scope.row.id}`]">
                        <el-select
                                size="small"
                                v-model="tableObj[scope.row.id][`alarm_level_${scope.row.id}`][`id`]"
                                @change="(val)=>inputName(val,scope.row.id, 'alarm_level_')"
                                placeholder="告警级别">
                            <el-option
                                    v-for="item in levels"
                                    :key="item.name"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button @click.stop="btnCancel">取 消</el-button>
            <el-button type="primary" @click="btnSure">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>
import { getItemsById, alarmLevels } from '../services/services'
import { Dialog, Button, Select, Option, Input, TableColumn, Table} from 'element-ui'
import globalMixin from "../mixins/globalMixin";
import { THRESHOLD_TYPE } from '../utils/commonMap'
export default {
    name: '',
    mixins:[globalMixin],
    props:{
        show:{
            type: Boolean,
            default: false
        },
        localData: {
            type: Object,
            default: ()=>{}
        }
    },
    data(){
        return {
            tableData:[],
            tableObj: {},
            itemData: {},
            tableSelectedData: [],
            levels:[],
            checkFlag: true //表单验证开关
        }
    },
    watch:{
        show(newVal){
            if(newVal===true){
                if(this.localData.thresholds && this.localData.thresholds.length>0){
                    this.resetData(this.localData.thresholds);

                }else
                    this.getSingleItem();
                this.getAlarmLevels();
            }
        }
    },
    components:{
        [Dialog.name]:Dialog,
        [Button.name]:Button,
        [Select.name]:Select,
        [Option.name]:Option,
        [Input.name]:Input,
        [Table.name]:Table,
        [TableColumn.name]:TableColumn
    },
    methods:{
        /**
         * 关闭按钮事件
         */
        btnCancel(){
            this.$emit('update:show', false);
        },
        /**
         * 确认按钮事件
         */
        btnSure(){
            let { tableData } = this;
            tableData.map(item=>{
                return this.getSameKeyById(item);
            });
            if(!this.formChecked(tableData)) return false;
            let params = {
                id: this.localData.id,
                list: tableData
            };
            this.$emit('callBack', params);
            this.btnCancel();
        },

        /**
         * @param tableData {Array}
         *@return {Boolean}
         **/
        formChecked(tableData){
            let flag = true;
            tableData.map(item=>{
               if(!item.max){
                   this.$message.error('最大值不能为空！');
                   flag = false;
                   return false;
               }
               if(!item.min){
                   this.$message.error('最小值不能为空！');
                   flag = false;
                   return false;
               }
               if(item.min>=item.max){
                   flag = false;
                   this.$message.error('数据不规范 最大值不能小于最小值！');
                   return false;
               }
               if(!item.alarm_level_id){
                   flag = false;
                   this.$message.error('请选择告警等级！');
                   return false;
               }
            });
            return flag;
        },
        /**
         * 获取当前监控项目的警告阈值
         * @return {Promise<void>}
         */
        async getSingleItem(){
            let id = this.localData.id;
            if(id===undefined) return;
            let list = await getItemsById(id).then(res=>res.thresholds);
            this.itemData = list;
            this.resetData(list);
        },
        /**
         * 表格选中项变化
         * @param val
         */
        tableChange(val){
            this.tableSelectedData = val;
        },
        /**
         * 获取类型名称
         * @param id
         * @return {*}
         */
        getType(id){
            return THRESHOLD_TYPE[id]
        },
        /**
         * 获取告警等级数据
         * @return {Promise<void>}
         */
        async getAlarmLevels(){
            this.levels = await alarmLevels().then(res=>res.data)
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
            let tableData = this.tableData;
            try{
                if(prefix==='alarm_level_'){
                    let data = {};
                    this.levels.map(item=>{
                        if(item.id===value)
                            data = item;
                    });
                    keysTable[id][`${prefix+id}`] = data;
                    keysTable[id][`alarm_level_id`] = data.id;
                    // keysTable[id][`${prefix.substr(0, prefix.length-1)}`] = data;
                }
                else
                    keysTable[id][`${prefix+id}`] = value;
                tableData = tableData.map(item=>{
                    return keysTable[item.id]
                });
                this.resetData(tableData);
            }catch (e) {
                console.log(e);
            }

        },
        /**
         *  删除操作
         **/
        deleteHandle(){
            let selectTab = this.tableSelectedData;
            if(!selectTab || selectTab.length<=0) return;
            let tableData = this.tableData;
            let selectObj = this.arrayToObjectById(selectTab);
            tableData = tableData.filter(item=>!selectObj[item.id]);
            this.resetData(tableData);
        },

        /**
         *  增加操作
         * */
        addHandle(){
            let tableData = [...this.tableData];
            let newData = {
                alarm_level:{},
                alarm_level_id: "",
                contains_threshold: true,
                description: "",
                id: `new_${tableData.length}`,
                item: null,
                item_id: this.localData.id,
                max: '',
                min: '',
                name: ""
            };
            tableData.push(newData);
            this.resetData(tableData);
        },

        /**
         * 刷新数组，model数据
         * @param arr
         */
        resetData(arr){
            if( arr===undefined || Object.prototype.toString.call(arr) !== "[object Array]") return ;
            this.tableData = arr;
            let temp = this.copyKeysByParam([...arr], 'id', ['max', 'min', 'alarm_level']);
            this.tableObj = this.arrayToObjectById(temp);
            console.log('hahaha',this.tableData);
        },
    }
}
</script>

<style lang="stylus">
.warn-setting-wrap
    width 500px
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
    .warn-btnIcons
        float left
        margin 10px 0

    .tabCon
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
            .input-line
                text-align left
                overflow hidden
                margin-bottom 10px
                span
                    float left
                    margin-top 8px
                .el-input
                    float right
                    width 90px






</style>