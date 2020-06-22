<template>
    <div class="contact_groups">
        <el-dialog
                :title="`选择联系组 【${localData && localData.name}】`"
                :visible="dialogVisible"
                width="370px"
                @close="btnCancel"
                :close-on-click-modal="false">
            <el-table
                    :data="tableData"
                    @selection-change = "selectDataChange"
                    ref="multipleTable"
                    style="width: 100%" height="300px">
                <el-table-column type="selection"/>
                <el-table-column
                        label="联系人组"
                        prop="name">
                </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button @click.stop="btnCancel">取 消</el-button>
                <el-button type="primary" @click="btnSure">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { getContactGroups } from '../services/services'
import {Dialog, Button, Table, TableColumn, Checkbox} from 'element-ui'
export default {
    name: 'contact_groups',
    props:{
        show: {
            type: Boolean,
            default: false
        },
        localData:{
            type: Object,
            default: ()=>{}
        }
    },
    components:{
        [Dialog.name]: Dialog,
        [Button.name]: Button,
        [Table.name]: Table,
        [TableColumn.name]: TableColumn,
        [Checkbox.name]: Checkbox,
    },
    data(){
        return{
            dialogVisible: false,
            tableData: [],
            selectData:[]
        }
    },
    watch:{
        show(newVal){
            this.dialogVisible = newVal;
            if(newVal===true){
                this.getContactGroups();
            }
        }
    },
    methods:{
        /**
         * 关闭事件
         */
        btnCancel(){
            this.selectData = [];
            this.$emit('update:show', false);
        },

        /**
         * 确定事件，向父组件返回数据
         */
        btnSure(){
            let data = {
                id: this.localData && this.localData.id,
                contactGroups: this.selectData
            };
            this.$emit('callBack', data);
            this.btnCancel();

        },

        /**
         *  获取联系组列表
         */
        getContactGroups(){
            getContactGroups().then(res=>{
                let localDataObj = {},
                    contact_groups = this.localData[`contact_groups_${this.localData.id}`] || this.localData.contact_groups;
                contact_groups && contact_groups.map(item=>{
                    if(!localDataObj[item.id])
                        localDataObj[item.id] = item;
                })
                // this.tableData = res.data;

                console.log('localDataObj',localDataObj);
                //显示选中的数据
                if(localDataObj){
                    res.data.map((item,index)=>{
                        if(localDataObj[item.id]){
                            setTimeout(()=>{
                                this.$refs.multipleTable.toggleRowSelection(this.tableData[index],true);
                            },30)

                        }
                    })
                }
                this.tableData = res.data;
            })
        },


        /**
         * 勾选联系人事件
         * @param data
         */
        selectDataChange(data){
            if(data  && data.length>0){
                let arr = [];
                data.map(item=>{
                    arr.push(item);
                })
                this.selectData = arr;
            }
        }
    }
}
</script>

<style lang="stylus">
.contact_groups
    width 600px;
    height auto;
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
    .el-dialog__body
        padding 15px 8px
    table
        font-size 12px
        text-align center
        th
            background-color #54b5ff
            color #fff
            text-align center
            padding 12px 0
        td
            text-align center
            padding 10px 0
</style>