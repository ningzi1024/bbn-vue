<template>
    <div class="more-setting-wrap">
        <el-dialog
                title="更多设置"
                :visible="show"
                width="320px"
                @close="btnCancel"
                :close-on-click-modal="false">
            <table class="more-setting-tab">
                <tr>
                    <td>检查间隔/秒</td>
                    <td>
                        <el-input
                            v-model="moreData.check_interval"
                            @input="inputName">
                        </el-input>
                    </td>
                </tr>
                <tr>
                    <td>重复次数/次</td>
                    <td>
                        <el-input
                            v-model="moreData.retry_count"
                            @input="inputName">
                        </el-input>
                    </td>
                </tr>
                <tr>
                    <td>检查时间段</td>
                    <td>
                        <el-select v-model="moreData.check_time_period_id">
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
                        <el-select v-model="moreData.notifications_time_period_id">
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
                            @input="inputName">
                        </el-input>
                    </td>
                </tr>
                <tr>
                    <td>驱动</td>
                    <td>
                        <el-input
                            v-model="moreData.protocol"
                            @input="inputName">
                        </el-input>
                        
                    </td>
                </tr>
                <tr>
                    <td>启用通知</td>
                    <td>
                        <el-checkbox v-model="moreData.notifications_enable"/>
                    </td>
                </tr>
                <tr>
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
                protocol:'',
                notifications_enable: true,
                zigbee_enabled: false,

            },
            check_time_period:[],
            notifications_time_period:[]
        }
    },
    methods: {
        /**
         * 关闭弹窗
         */
        btnCancel(){
            this.moreData = {};
            this.$emit('update:show', false);
        },
        btnSure(){
            if(!this.localData.id) return;
            let data = {
                id: this.localData.id,
                moreSetting: this.moreData
            };
            this.$emit('callBack', data);
            this.btnCancel();
        },

        inputName(val, key){
            if(val){
                this.moreData[key] = val;
                console.log(val);
            }
        }
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
        padding 15px 8px
</style>