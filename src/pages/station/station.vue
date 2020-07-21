<template>
    <div class="zl-station-wrap">
        <div class="main">
            <div class="station-menu" :class="{'menu-show':showMenu}">
                <div class="hide-menu-wrap" @click="showMenu=false">
                    <i class="el-icon-arrow-left"></i>
                </div>
                <div class="tree-con">
                    <el-tree :data="treeData" :props="defaultProps" @node-click="handleNodeClick" default-expand-all></el-tree>
                </div>
            </div>
            <div class="station-content" :class="{'smallContent':showMenu}">
                <div class="tops">
                    <p class="notice"><span>当前设备：广东总部机房>温湿度1</span></p>
                    <ul class="tabs">
                        <li :class="{'active': curNav==='general'}" @click="curNav='general'">
                            <i class="icons icons-general"></i>
                            <span>设备概况</span>
                        </li>
                        <li :class="{'active': curNav==='info'}"  @click="curNav='info'">
                            <i class="icons icons-info"></i>
                            <span>设备详情</span>
                        </li>
                        <li :class="{'active': curNav==='log'}" @click="curNav='log'">
                            <i class="icons icons-log"></i>
                            <span>设备日志</span>
                        </li>
                        <li :class="{'active': curNav==='trend'}" @click="curNav='trend'">
                            <i class="icons icons-trend"></i>
                            <span>设备曲线</span>
                        </li>
                    </ul>
                </div>
                <StationItems :deviceId="cur_device_id" v-show="curNav==='info'"/>
            </div>
        </div>
<!--        <button @click="showMenu=true">显示</button>-->
    </div>
</template>

<script>
import { Tree } from 'element-ui'
import { devicesMenu } from '../../services/services'
import StationItems from '../../components/Station/items'

export default {
    name: 'station',
    components:{
        [Tree.name]: Tree,
        StationItems
    },
    data(){
        return {
            showMenu: true,
            curNav: 'info',
            cur_device_id: 144,
            treeData: [],
            defaultProps:{
                children: 'children',
                label: 'name'
            }
        }
    },
    mounted() {
        devicesMenu().then(res=>{
            let listStr = JSON.stringify(res.data);
            listStr = listStr.replace(/categorys|devices/g,'children');
            listStr = listStr.replace(/code/g,'id');
            console.log(JSON.parse(listStr))
            this.treeData = JSON.parse(listStr);
        });
    },
    methods: {
        handleNodeClick(val){
            console.log(val);
        }
    }
}
</script>

<style lang="stylus">
.zl-station-wrap
    width 100%
    padding 15px 0
    .main
        display flex
        .station-menu
            width 177px
            height 730px
            background #fefeff
            transition: margin-left .3s;
            margin-left  -180px
            box-shadow 5px 0 15px rgba(39,50,71,0.13)
            .hide-menu-wrap
                text-align left
                width 100%
                height 27px
                line-height 27px
                border-bottom 2px solid #efefef
                i
                    font-size 18px
                    padding-left 10px
                    cursor pointer
            .tree-con
                padding 15px
        .menu-show
            margin-left 0
        .station-content
            margin-left 15px
            width 1920px
            background #fff
            transition: width .3s;
            .tops
                width 100%
                height 57px
                line-height 57px
                overflow hidden
                display flex
                .notice
                    width 20%
                    border-top 1px solid #d5e8ea
                    font-size 15px
                    span
                        display inline-block
                        padding 0 30px
                        height 98%
                        border-bottom  1px solid #d5e8ea
                ul
                    width 80%
                    border 1px solid #d5e8ea
                    display flex
                    border-right none
                    li
                        flex 1
                        border-right 1px solid #d5e8ea
                        cursor: pointer
                        >span
                            font-size 15px
                        .icons
                            display inline-block
                            width 21px
                            height 21px
                            overflow hidden
                            background-size contain
                            vertical-align middle
                            margin-right 10px
                        .icons-general
                            background-image url("../../assets/images/icon_station_1_1.png")
                        .icons-info
                            background-image url("../../assets/images/icon_station_2_1.png")
                        .icons-log
                            background-image url("../../assets/images/icon_station_3_1.png")
                        .icons-trend
                            background-image url("../../assets/images/icon_station_4_1.png")

                        &.active
                            .icons-general
                                background-image url("../../assets/images/icon_station_1_2.png")
                            .icons-info
                                background-image url("../../assets/images/icon_station_2_2.png")
                            .icons-log
                                background-image url("../../assets/images/icon_station_3_2.png")
                            .icons-trend
                                background-image url("../../assets/images/icon_station_4_2.png")


            .contain
                height 673px
                padding-top 30px
                .tables
                    min-height 555px
                    table
                        width 99%
                        color #242425
                        text-align center
                        margin 10px auto 15px auto
                        tr:nth-child(even)
                            background #f1f6f7
                        th
                            font-weight normal
                            font-size 12px
                            color #7c7c7c
                            padding 18px 0
                            text-align center

                        td
                            padding 13px 0
                            border-top 1px solid #d3e9ea
                            border-bottom 1px solid #d3e9ea
                            text-align center
                            .normal
                                color #0f8c07
                            .error
                                color #f10c0cf7
        .smallContent
            width 1720px
    .el-tree-node__expand-icon
        color #303030
</style>