<template>
    <div class="monitorings-wrap">
        <el-dialog
                :title="`更多设置 【${localData && localData.name}】`"
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
                <el-button @click.stop="btnCancel">关 闭</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import Search from './search'
import { Dialog, Button, Checkbox, Input } from 'element-ui'
export default {
    name: 'monitoring_groups',
    props:{
        //设备id
        id:{
            type: Number,
            default: 0
        }
    },
    components:{
        [Dialog.name]: Dialog,
        [Button.name]: Button,
        [Checkbox.name]: Checkbox,
        [Input.name]: Input,
        Search
    },
    data(){
        return {

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
.monitorings-wrap
    font-size 12px
</style>