<template>
    <div class="more-setting-wrap">
        <el-dialog
                title="更多设置"
                :visible="dialogVisible"
                width="320px"
                @close="btnCancel"
                :close-on-click-modal="false">
            <table class="more-setting-tab">
                <tr>
                    <td>检查间隔/秒</td>
                    <td></td>
                </tr>
                <tr>
                    <td>重复次数/次</td>
                    <td></td>
                </tr>
                <tr>
                    <td>检查时间段</td>
                    <td></td>
                </tr>
                <tr>
                    <td>通知时间段</td>
                    <td></td>
                </tr>
                <tr>
                    <td>通知事件/秒</td>
                    <td></td>
                </tr>
                <tr>
                    <td>驱动</td>
                    <td></td>
                </tr>
                <tr>
                    <td>启用通知</td>
                    <td></td>
                </tr>
                <tr>
                    <td>启用 zigbee</td>
                    <td></td>
                </tr>
                <tr>
                    <td>禁用设备</td>
                    <td></td>
                </tr>
            </table>
        </el-dialog>
    </div>
</template>

<script>
import { Dialog, Button, Checkbox } from 'element-ui'
export default {
    name: 'more-setting',
    props:{
        //弹窗显示开关
        show:{
            type: Boolean,
            default: false
        },
        //弹窗所需要的数据
        data:{
            type: Object,
            default: ()=>{}
        }
    },
    components:{
        [Dialog.name]: Dialog,
        [Button.name]: Button,
        [Checkbox.name]: Checkbox
    },
    data(){
        return {

        }
    },
    methods: {
        /**
         * 关闭弹窗
         */
        btnCancel(){
            this.$emit('update:show', false);
        }
    }
}
</script>

<style lang="stylus">
.more-setting-wrap
    font-size 12px
</style>