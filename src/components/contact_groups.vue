<template>
    <div class="contact_groups">
        <el-dialog title="收货地址" :visible.sync="show" width="30%">
            <h1>请选择联系人组</h1>
            <div slot="footer" class="dialog-footer">
                <el-button @click="btnCancel">取 消</el-button>
                <el-button type="primary" @click="btnSure">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { Dialog, Button } from 'element-ui'
export default {
    name: 'contact_groups',
    props:{
        show: {
            type: Boolean,
            default: false
        }
    },
    components:{
        [Dialog.name]: Dialog,
        [Button.name]: Button
    },
    data(){
        return{
            dialogVisible: false
        }
    },
    watch:{
        show(newVal){
            console.log(newVal);
        }
    },
    methods:{
        btnCancel(){
            this.$emit('callBack', {show: false});
        },
        btnSure(){
            let data = {
                show: false
            };
            this.$emit('callBack', data);
        }
    }
}
</script>

<style lang="stylus">
.contact_groups
    width 600px;
    height auto;
</style>