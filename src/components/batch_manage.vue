<template>
    <el-dialog
        class="batch-manage-wrap"
        width="100%"
        title="批量管理"
        :visible="show"
        :close-on-click-modal="false"
        @close="btnCancel">
        <div class="tabCon">
            <table>
                <tr>
                    <td width="18%">复制对象</td>
                    <td>
                        <el-checkbox-group v-model="checkedAttrs" @change="$_changeAttrs">
                            <el-checkbox v-for="(item,key,index) in fieldMap" :label="key" :key="item+index">{{item}}</el-checkbox>
                        </el-checkbox-group>
                    </td>
                </tr>
                <tr>
                    <td>参考对象</td>
                    <td>
                        <el-button type="danger" size="mini" disabled>{{ copyAim.name }}</el-button>
                    </td>
                </tr>
                <tr>
                    <td>应用对象</td>
                    <td>
                        <el-button type="primary" size="mini" v-for="(item,index) in userAim" :key="item.name" @click="transposition(item,index)">{{ item.name }}</el-button>
                    </td>
                </tr>
            </table>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button @click.stop="btnCancel">取 消</el-button>
            <el-button type="primary" @click="btnSure">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>
import {Button, Dialog, CheckboxGroup, Checkbox} from "element-ui";

export  default{
    name: 'batchManage',
    props:{
        show: {
            type: Boolean,
            default: false
        },
        list: {
            type: Array,
            default: ()=>[]
        }
    },
    components: {
        [Dialog.name]: Dialog,
        [Button.name]: Button,
        [Checkbox.name]: Checkbox,
        [CheckboxGroup.name]: CheckboxGroup
    },
    data(){
        return {
            checkedAttrs: [], //选中的勾选框
            copyAim: {} ,    //参考对象
            userAim: [],    //应用对象
            fieldMap:{
                "device_group_id": "站点",
                "contact_groups": "联系人组",
                "ip_address": "IP地址",
                "port": "端口",
                "485_address": "协议ID"
            }
        }
    },
    watch:{
        show(newVal){
            if(newVal===true){
                if(this.list && this.list.length>0){
                    this.copyAim = this.list[0];
                    let temp = Object.assign([],this.list,[]);
                    temp.shift();
                    this.userAim = temp;
                }
            }
        }
    },
    methods:{
        /**
         * 关闭组件事件
         */
        btnCancel(){
            this.userAim = [];
            this.copyAim = {};
            this.checkedAttrs = [];
            this.$emit('update:show', false);
        },

        /**
         * 确认操作事件
         */
        btnSure(){
            let { copyAim, userAim, checkedAttrs} = this;
            const tidyArr = this.copyAimToUserAim(copyAim, userAim, checkedAttrs);
            this.$emit('callBack', tidyArr);
            this.btnCancel();
        },

        /**
         * 监控选中事件
         * @param data
         */
        $_changeAttrs(data){
            console.log(data);
            this.checkedAttrs = data;
        },

        /**
         * 与参考对象互换位置
         * @param item
         */
        transposition(item, index){
            if(item && item.id){
                let { copyAim, userAim } = this;
                this.copyAim = item;
                userAim.splice(index,1,copyAim);
                this.userAim = userAim;
            }
        },


        /**
         * 将选中的属性，拷贝到应用对象
         * @param copyObj
         * @param userObj
         * @param copyKeys
         * @return {*[]}
         */
        copyAimToUserAim(copyObj={}, userObj=[], copyKeys=[]){
            if(!copyObj.id || !userObj.length || !copyKeys.length ) return [];
            const keyMap = {},
                copyObjId = copyObj.id;
            copyKeys.map(item=>{
                if(!keyMap[item]){
                    keyMap[item] = item;
                }
            });
            userObj.map(item=>{
                let id = item.id;
                item.editing = true;
                for(let key in keyMap) {
                    let val = copyObj[`${key}_${copyObjId}`] || copyObj[key];
                    item[key] = val;
                    item[`${key}_${id}`] = val;
                }
            })
            return userObj;
        }
    }
}


</script>

<style lang="stylus">
.batch-manage-wrap
    font-size 12px
    margin 0 auto
    width 550px
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
    .tabCon
        padding 10px 15px
        table
            width 100%
            td
                padding 15px 0
                .el-checkbox
                    margin-right 40px
                    margin-bottom 15px
</style>