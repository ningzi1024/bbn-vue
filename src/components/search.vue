<template>
    <div class="search-wrap">
        <el-select v-model="searchParams.site" placeholder="查找站点">
            <el-option
                    v-for="item in searchParams.sites"
                    :key="item.name"
                    :label="item.name"
                    :value="item.id">
            </el-option>
        </el-select>
        <el-select v-model="searchParams.types" placeholder="查找类型" class="selectCon">
            <el-option
                    v-for="item in searchParams.types"
                    :key="item.value"
                    :label="item.value"
                    :value="item.value">
            </el-option>
        </el-select>
        <div class="input-keyword">
            <el-input placeholder="请输入内容" v-model="searchParams.keywords" class="input-with-select">
                <el-button slot="append" icon="el-icon-search" @click="btnSearch"></el-button>
            </el-input>
        </div>
        <el-button icon="el-icon-delete">清除</el-button>
    </div>
</template>

<script>
import { Select, Option, Input, Button } from 'element-ui'
export default {
    name:'search',
    props: {
        type:{
            type: String,
            default: 'DEVICES'
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
                type: '',
                keywords: ''
            },
            sites: [],                  //站点数据
            types: [],                  //类型数据
        }
    },
    methods: {
        btnSearch(){
            let params = {};
            this.$emit('searchEvent', params);
        }
    }
}
</script>

<style lang="stylus">
.search-wrap
    width 70%
    display inline-block
</style>