<template>
    <div class="more-setting-wrap">
        <el-dialog
                :title="`更多设置 【${localData && localData.name}】`"
                :visible="show"
                width="360px"
                :close-on-click-modal="false"
                @close="btnCancel">
            <table class="more-setting-tab">
                <tr>
                    <td width="25%">检查间隔/秒</td>
                    <td>
                        <el-input
                            v-model="moreData.check_interval"
                            @input="(val)=>inputName(val, 'check_interval')">
                        </el-input>
                    </td>
                </tr>
                <tr>
                    <td>重复次数/次</td>
                    <td>
                        <el-input
                            v-model="moreData.retry_count"
                            @input="(val)=>inputName(val, 'retry_count')">
                        </el-input>
                    </td>
                </tr>
                <tr>
                    <td>检查时间段</td>
                    <td>
                        <el-select
                                v-model="check_time_period_name"
                                @change="(val)=>selectVal(val, 'check_time_period_id')">
                            <el-option
                                    v-for="item in check_time_period"
                                    :key="item.name"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </td>
                </tr>
                <tr>
                    <td>通知时间段</td>
                    <td>
                        <el-select
                                v-model="notifications_time_period_name"
                                @change="(val)=>selectVal(val, 'notifications_time_period_id')">
                            <el-option
                                    v-for="item in notifications_time_period"
                                    :key="item.name"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </td>
                </tr>
                <tr>
                    <td>通知事件/秒</td>
                    <td>
                        <el-input
                            v-model="moreData.notifications_interval"
                            @input="(val)=>inputName(val, 'notifications_interval')">
                        </el-input>
                    </td>
                </tr>
                <tr  v-if="model==='devices'">
                    <td>驱动</td>
                    <td>
                        <el-input
                            v-model="moreData.driver"
                            @input="(val)=>inputName(val, 'driver')">
                        </el-input>
                        
                    </td>
                </tr>
                <tr>
                    <td>启用通知</td>
                    <td>
                        <el-checkbox v-model="moreData.notifications_enable"/>
                    </td>
                </tr>
                <tr v-if="model==='devices'">
                    <td>启用 zigbee</td>
                    <td>
                        <el-checkbox v-model="moreData.zigbee_enabled"/>
                    </td>
                </tr>
                <tr>
                    <td>禁用设备</td>
                    <td>
                        <el-checkbox v-model="moreData.device_enabled"/>
                    </td>
                </tr>
            </table>
            <div slot="footer" class="dialog-footer">
                <el-button @click.stop="btnCancel">取 消</el-button>
                <el-button type="primary" @click="btnSure">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { Dialog, Button, Checkbox, Input,Select, Option } from 'element-ui'
import { timePeriods } from '../services/services'
export default {
    name: 'more-setting',
    props:{
        //弹窗显示开关
        show:{
            type: Boolean,
            default: false
        },
        //弹窗所需要的数据
        localData:{
            type: Object,
            default: ()=>{}
        },
        model: {
            type: String,
            default: 'devices'  //items: 监控项更多设置， devices: 设备项更多设置
        }
    },
    components:{
        [Dialog.name]: Dialog,
        [Button.name]: Button,
        [Checkbox.name]: Checkbox,
        [Input.name]: Input,
        [Select.name]: Select,
        [Option.name]: Option
    },
    data(){
        return {
            moreData:{
                check_interval: 0,
                retry_count:0,
                check_time_period_id: 0,
                notifications_time_period_id:0,
                notifications_interval:3600,
                driver:'',
                notifications_enable: true,
                zigbee_enabled: false,
            },
            check_time_period:[],
            check_time_period_name: '',
            notifications_time_period:[],
            notifications_time_period_name:''
        }
    },
    mounted() {

    },
    watch: {
        show(newVal){
            if(newVal===true){
                let { localData, moreData } = this;
                if(localData){
                    for(let key in moreData){
                        moreData[key] = localData[key];
                    }
                    this.moreData = moreData;
                }
                this.getTimePeriods();
            }
        }
    },
    methods: {
        /**
         * 关闭弹窗
         */
        btnCancel(){
            this.resetData();
            this.$emit('update:show', false);
        },

        /**
         * 确认按钮事件，向父组件派发事件
         */
        btnSure(){
            if(!this.localData.id) return;
            if(this.checkData()){
                let data = {
                    id: this.localData.id,
                    moreSetting: this.moreData
                };
                this.$emit('callBack', data);
                this.btnCancel();
            }
        },

        /**
         * 更新input组件的model
         * @param val
         * @param key
         */
        inputName(val, key){
            if(val){
                this.moreData[key] = val;
            }
        },

        /**
         * 获取时间段
         */
        getTimePeriods(){
            timePeriods().then(res=>{
                let data = res.data;
                if(data){
                    this.check_time_period = data;
                    this.notifications_time_period = data;
                    data.map(item=>{
                       if(item.id === this.localData.check_time_period_id){
                         this.check_time_period_name = item.name;
                       }
                        if(item.id === this.localData.notifications_time_period_id){
                            this.notifications_time_period_name = item.name;
                        }
                    });
                }
            }).catch(()=>{
                console.log('网络异常');
            })
        },

        /**
         * 组件数据回到初始化设置
         */
        resetData(){
            //清空组件数据
            this.moreData = {
                check_interval: 0,
                retry_count:0,
                check_time_period_id: 0,
                notifications_time_period_id:0,
                notifications_interval:3600,
                driver:'',
                notifications_enable: true,
                zigbee_enabled: false,
            };
            this.check_time_period = [];
            this.check_time_period_name = '';
            this.notifications_time_period = [];
            this.notifications_time_period_name = '';
        },

        /**
         * 下拉框更新数据
         * @param val
         * @param prefix
         */
        selectVal(val, prefix){
            if(val && prefix){
                this.moreData[prefix] = val;
            }
            console.log(val, prefix);
        },

        checkData(){
            let { moreData } = this;
            if(!moreData.check_time_period_id){
                this.$message.error('请选择检查时间段！');
                return false
            }else if(!moreData.notifications_time_period_id){
                this.$message.error('请选择通知时间段！');
                return false
            }
            return true;
        }
    },
    beforeDestroy() {
        this.resetData();
    }
}
</script>

<style lang="stylus">
.more-setting-wrap
    font-size 12px
    .el-dialog__header
        background #2fa1f7
        padding 10px 20px 10px
        .el-dialog__title
            color #fff
            font-size 15px
        .el-dialog__headerbtn 
            top 13px
            .el-dialog__close
                color #fff
    .el-dialog__body
        padding 15px
    .more-setting-tab
        text-align left
        padding 5px 20px
        overflow hidden
        td
            padding 6px 0
            &:nth-child(1)
                text-align right
            &:nth-child(2)
                padding-left 15px
</style>