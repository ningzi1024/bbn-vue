<template>
    <div class="monitoring-wrap">
        <el-dialog
                :title="`【${localData && localData.name || ''}】- 监控项`"
                :visible="show"
                width="1440px"
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
                            <el-badge is-dot class="item">
                                <el-button class="share-button" icon="el-icon-tickets" @click="saveHandle"></el-button>
                            </el-badge>
                        </el-tooltip>
                        <el-tooltip effect="dark" content="批量编辑">
                            <el-button icon="el-icon-collection" style="float: right"></el-button>
                        </el-tooltip>
                    </el-button-group>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click.stop="btnCancel" type="primary" size="medium">关 闭</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import Search from './items_search'
import { Dialog, Button, Checkbox, Input } from 'element-ui'
export default {
    name: 'monitoring_groups',
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
        Search
    },
    watch:{
        show(newVal){
            if(newVal===true){
                this.id = this.localData && this.localData.id
            }
        }
    },
    data(){
        return {
            id: 0
        }
    },
    methods: {
        searchEvent(data){
            console.log(data);
        },
        btnCancel(){
            this.$emit('update:show', false);
        }
    }
}
</script>

<style lang="stylus">
.monitoring-wrap
    font-size 12px
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
</style>