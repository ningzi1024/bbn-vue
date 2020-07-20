<template>
    <div class="zl-station-wrap">
        <div class="main">
            <div class="station-menu" :class="{'menu-show':showMenu}">
                <div class="hide-menu-wrap" @click="showMenu=false">
                    <i class="el-icon-arrow-left"></i>
                </div>
                <div class="tree-con">

                </div>
            </div>
            <div class="station-content" :class="{'smallContent':showMenu}">
                <div class="tops">
                    <p class="notice">当前设备：广东总部机房>温湿度1</p>
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
                <div class="contain">

                </div>
            </div>
        </div>
        <button @click="showMenu=true">显示</button>
    </div>
</template>

<script>
import { Tree } from 'element-ui'
import { devicesMenu } from '../../services/services'
export default {
    name: 'station',
    components:{
        [Tree.name]:Tree
    },
    data(){
        return {
            showMenu: true,
            curNav: 'general'
        }
    },
    mounted() {
        devicesMenu().then(res=>{
            console.log(res.data);
        })
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
                ul
                    width 75%
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


            table
                background #fff
                margin-right 20px
                text-align center
                margin 0 auto
                th,td
                    padding 10px 0
                    border 1px solid red
                    text-align center
        .smallContent
            width 1720px
</style>