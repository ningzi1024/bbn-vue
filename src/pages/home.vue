<template>
    <div class="setting-device-wrap">
        <div class="opts">
            <el-select v-model="searchParams.site" placeholder="查找站点">
                <el-option
                        v-for="item in sites"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>
            <el-select v-model="searchParams.types" placeholder="查找类型" class="selectCon">
                <el-option
                        v-for="item in sites"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>
            <div class="input-keyword">
                <el-input placeholder="请输入内容" v-model="input3" class="input-with-select">
                    <el-button slot="append" icon="el-icon-search"></el-button>
                </el-input>
            </div>
            <el-button icon="el-icon-delete">清除</el-button>
            <div class="btnIcons">
                <el-button-group>
                    <el-tooltip effect="dark" content="增加">
                        <el-button icon="el-icon-plus"></el-button>
                    </el-tooltip>
                    <el-tooltip effect="dark" content="删除">
                        <el-button icon="el-icon-minus"></el-button>
                    </el-tooltip>
                    <el-tooltip effect="dark" content="保存">
                        <el-badge is-dot class="item">
                            <el-button class="share-button" icon="el-icon-tickets"></el-button>
                        </el-badge>
                    </el-tooltip>
                    <el-tooltip effect="dark" content="批量编辑">
                        <el-button icon="el-icon-collection" style="float: right"></el-button>
                    </el-tooltip>
                </el-button-group>
            </div>
        </div>
       <div class="content-tab">

       </div>
    </div>
</template>

<script>
import { Select, Option, Input, Button, ButtonGroup, Badge, Tooltip, Table } from 'element-ui'
export default {
    name: 'home',
    components: {
        [Select.name]: Select,
        [Option.name]: Option,
        [Input.name]: Input,
        [Button.name]: Button,
        [ButtonGroup.name]: ButtonGroup,
        [Badge.name]: Badge,
        [Tooltip.name]: Tooltip,
        [Table.name]: Table
    },
    data(){
        return {
            searchParams: {
                site: '',
                type: '',
            },
            sites: [], //站点数据
            types: [], //类型数据
        }
    },
    mounted() {

    },
    methods: {

    }
}
</script>

<style lang="stylus">
.setting-device-wrap
    padding 40px
    text-align left
    .selectCon
        margin 0 8px
    .input-keyword
        width 185px
        margin-right: 8px;
        display inline-block
    .btnIcons
        display inline-block
        float right
    .el-badge__content.is-fixed.is-dot {
        right: 20px;
        top: 8px;
    }
    .content-tab
        width 100%
</style>