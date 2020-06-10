<template>
    <el-dialog
        class="add-device-wrap"
        title="添加设备"
        :visible="show"
        width="1260px"
        :close-on-click-modal="false"
        @close="btnCancel">
        <div class="templateCon">
            <div class="treeCon">
                <el-tree
                    :data="treeData"
                    show-checkbox
                    node-key="id"
                    ref="myTree"
                    highlight-current>
                </el-tree>
            </div>
            <div class="opts">
                <el-button type="primary" icon="el-icon-arrow-right" @click="joinToTable">加入</el-button>
                <el-button type="warning" icon="el-icon-arrow-left">移除</el-button>
            </div>
            <div class="new-devices-tab">
                <el-table
                        :data="tableData"
                        stripe
                        @selection-change = "selectDataChange"
                        ref="multipleTable"
                        style="width: 100%" height="300px">
                    <el-table-column type="selection"/>
                    <el-table-column label="设备名称">
                        <template slot-scope="scope">
                            <el-input
                                    size="small"
                                    v-model="scope.row[`model_${scope.row.id}`]"
                                    @input="((val)=>{inputName(val, scope.row.id, 'model')})">
                            </el-input>
                        </template>
                    </el-table-column>
                    <el-table-column label="数量">
                        <template slot-scope="scope">
                            <el-input
                                    size="small"
                                    v-model="scope.row['amount']">
                            </el-input>
                        </template>
                    </el-table-column>
                    <el-table-column label="关联动作">

                    </el-table-column>
                    <el-table-column label="IP地址">
                        <template slot-scope="scope">
                            <el-input
                                    size="small"
                                    v-model="scope.row.ipv4"
                                    @input="((val)=>{inputName(val, scope.row.id, 'ipv4')})">
                            </el-input>
                        </template>
                    </el-table-column>
                    <el-table-column label="协议ID">
                        <template slot-scope="scope">
                            <el-input
                                    size="small"
                                    v-model="scope.row.protocol_id"
                                    @input="((val)=>{inputName(val, scope.row.id, 'protocol_id')})">
                            </el-input>
                        </template>
                    </el-table-column>
                    <el-table-column label="站点" >
                        <template slot-scope="scope">
                            <el-select v-model="scope.row['device']" placeholder="选择站点" size="small" @change="selectChange">
                                <el-option
                                        v-for="item in deviceGroups"
                                        :key="item.name"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column label="联系人组">
                        <template slot-scope="scope">
                            <div style="cursor:pointer">
                                <i class="el-icon-s-order" @click="selectContactGroups(scope.row)" style="font-size: 16px; color:#54b5ff"></i>
                            </div>
                        </template>
                    </el-table-column>

                </el-table>
            </div>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button @click.stop="btnCancel">取 消</el-button>
            <el-button type="primary" @click="btnSure">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>
import { Dialog, Button, Table, TableColumn, Tree, Input, Select, Option } from 'element-ui'
import { getDeviceTemplates } from '../services/services'
import globalMixin from '../mixins/globalMixin'
export  default {
    name: 'addDevice',
    mixins:[globalMixin],
    props: {
        // 弹窗开关
        show: {
            type: Boolean,
            default: true
        },
        //站点列表
        deviceGroups: {
            type: Array,
            default: ()=>[]
        }
    },
    components: {
        [Dialog.name]: Dialog,
        [Button.name]: Button,
        [Table.name]: Table,
        [TableColumn.name]: TableColumn,
        [Tree.name]: Tree,
        [Input.name]: Input,
        [Select.name]: Select,
        [Option.name]: Option
    },
    data(){
        return {
            tableData: [],      //右侧表格事件
            treeData: [],       //左侧树形结构数据
        }
    },
    mounted() {
        this.deviceTemplates();
    },
    methods: {
        /**
         *  取消按钮
         */
        btnCancel() {
          this.$emit('update:show', false);
        },

        /**
         * 确定按钮事件
         */
        btnSure(){
            let data = {};
            this.$emit('callBack', data);
        },

        /**
         * 获取设备模板
         */
        async deviceTemplates(){
            let data = await getDeviceTemplates().then(res=>res.data);
            this.treeData = this.arrayToTree(data);
        },

        /**
         * 修改数据
         * @param val
         * @param id
         * @param name
         */
        inputName(val, id ,name){
            let { tableData } = this;
            let obj = this.arrayToObjectByParam(tableData, id, name);
            obj[id][name] = val;
            console.log(obj);
            this.tableData = this.mergeChangeArr(tableData, obj);
            console.log('this.tableData: ',this.tableData);
        },

        selectContactGroups(data){
            console.log(data);
        },

        /**
         * 表格选中项目
         * @param data
         */
        selectDataChange(data){
            console.log(data);
        },

        /**
         * 选中数据加入到表格中
         */
        joinToTable(){
            let arr = this.$refs.myTree.getCheckedNodes().filter(item=>item.id>0);
            // arr = this.setArrItem(arr, 'count', 1);
            console.log(arr);
            this.tableData = this.tableData.concat(arr);
        },
        selectChange(data){
            console.log('selectChange',data);
            console.log('this.tableData', this.tableData);
        },
    }
}
</script>

<style lang="stylus">
.add-device-wrap
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
    .templateCon
        width 100%
        padding 20 10px
        .treeCon
            width 230px
            height 315px
            overflow-x hidden
            overflow-y auto
            border 1px solid #c8c8ca
            display inline-block
        .opts
            display inline-block
            width 100px
            height 315px
            overflow hidden
            position: relative;
            .el-button
                position absolute
                &:nth-child(1)
                    top 35%
                    left 5px
                &:nth-child(2)
                    top 52%
                    right  5px
        .new-devices-tab
            width 890px
            height 315px
            display inline-block
            border 1px solid #c8c8ca
            overflow-x hidden
            overflow-y auto
            table
                font-size   12px
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
</style>