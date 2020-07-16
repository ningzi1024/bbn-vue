<template>
    <div class="search-wrap">
        <el-select v-model="searchParams.site" placeholder="请选择站点" @change="$_siteChange" v-if="model==='all'">
            <el-option
                    v-for="item in sites"
                    :key="item.name"
                    :label="item.name"
                    :value="item.id">
            </el-option>
        </el-select>
        <el-select v-model="searchParams.device" placeholder="请选择设备" class="selectCon" @change="$_deviceChange"  v-if="model==='all'">
            <el-option
                    v-for="item in devices"
                    :key="item.name"
                    :label="item.name"
                    :value="item.id">
            </el-option>
        </el-select>
        <el-select v-model="searchParams.type" placeholder="请选择类型" class="selectCon" @change="$_typesChange">
            <el-option
                    v-for="item in types"
                    :key="item.name"
                    :label="item.name"
                    :value="item.id">
            </el-option>
        </el-select>
        <div class="input-keyword">
            <el-input
                    placeholder="请输入内容"
                    ref="keywords"
                    v-model="searchParams.keywords"
                    class="input-with-select">
                <el-button slot="append" icon="el-icon-search" @click="btnSearch"></el-button>
            </el-input>
        </div>
        <el-button icon="el-icon-delete" @click="clearInput">清除</el-button>
    </div>
</template>

<script>
import { Select, Option, Input, Button } from 'element-ui'
import { getDeviceGroups, getDevices } from '../services/services'
export default {
    name:'search',
    props:{
        model:{
            type: String,
            default: 'single' //single：单个设备的监控项 , all：所有监控项目
        },
        searchEvent:{
            type: Function,
            defalut: ()=>{}
        }
    },
    components:{
        [Select.name]: Select,
        [Option.name]: Option,
        [Input.name]: Input,
        [Button.name]: Button
    },
    data(){
        return {
            searchParams: {
                site: '',
                device: '',
                type: '',
                keywords: '',
                search: false
            },
            sites: [],                  //站点数据
            types: [],                  //类型数据
            devices: [],                //设备列表
            keywordMap: {}              //类型，对应的搜索字段名称
        }
    },
    mounted() {
        this.init();
    },
    methods: {
        init(){
            this.getDeviceList();
            this.types = [
                {
                    name:'监控项名称',
                    id: 0
                },
                {
                    name:'监控项ID',
                    id: 1
                }
            ];
            this.keywordMap = {
                '0': 'name',
                '1': 'id'
            };

        },
        /**
         * 确认按钮事件
         */
        btnSearch(){
            let { searchParams } = this;
            let deepSearch = (searchParams.type!==undefined && !!searchParams.keywords);
            if(searchParams.site || deepSearch){
                this.searchParams.search = true;
                if(deepSearch)
                    this.searchParams[this.keywordMap[searchParams.type]] = this.searchParams.keywords;
                let params = Object.assign({},this.searchParams,{});
                delete params.keywords;
                if(this.model==='single'){
                    delete params.device;
                    delete params.site
                }
                this.$emit('searchEvent', params);
                this.searchParams = {
                    site: this.searchParams.site,
                    type: this.searchParams.type,
                    device: this.searchParams.device,
                    keywords: this.searchParams.keywords,
                    search: this.searchParams.search
                };
            }

        },

        /**
         *  获取站点列表
         **/
        async getDeviceList(){
            const list = await getDeviceGroups().then(res=>res.data);
            this.sites = list;
        },

        /**
         * 清除搜索条件
         **/
        clearInput(){
            this.$refs.keywords.clear();
            this.searchParams = {
                site: '',
                type: '',
                search: this.searchParams.search
            };
            if(this.searchParams.search){
                this.searchParams.search = false;
                this.$emit('searchEvent', this.searchParams);
            }

        },

        /**
         *  选择站点
         * @param val
         */
        $_siteChange(val){
            this.searchParams.site = val;
            this.showDeviceList(val);
        },

        /**
         * 选择类型
         * @param val
         */
        $_typesChange(val){
            this.searchParams.type = val;
        },

        /**
         *  选择设备
         **/
        $_deviceChange(val){
            this.searchParams.device = val;
        },

        /**
         * 获取对应的设备名
         * @param id
         * @return {Promise<void>}
         */
        async showDeviceList(id) {
            if(!id) return;
            const list = await getDevices({device:id}).then(res=>res.data);
            this.devices = list;
        }
    }
}
</script>

<style lang="stylus">
.search-wrap
    width 70%
    display inline-block
    background none!important
    .selectCon
        width 220px
        margin 0 8px
    .input-with-select
        width 330px
.setting-device-wrap .input-keyword
    width 330px!important
</style>