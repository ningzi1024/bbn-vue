<template>
    <div class="app">
        <el-row>
            <el-col :span="3">
                <div class="logo">
                    <span></span>
                </div>
            </el-col>
            <el-col :span="21">
                <div class="top">
                    <div class="icon-menu-show" @click="isCollapse = !isCollapse">
                        <i class="iconfont telescopic-left" style="color: #fff;"></i>
                    </div>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="autoSpan">
                <Menu :menuList="list" :isCollapse="isCollapse"/>
            </el-col>
            <el-col :span="24-autoSpan">
                <div class="submenu-tabs">
                    <el-tabs v-model="activeName" closable @tab-remove="removeTab" @tab-click="tabChange" >
                        <el-tab-pane v-for="item in tabsData" :label="item.label" :name="item.name" :key="item.name"></el-tab-pane>
                    </el-tabs>
                </div>
                <router-view/>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import Menu from './components/MenuList'
import { menuList } from './services/services'
import { Row, Col, Tabs, TabPane } from 'element-ui'
export default {
    name: 'app',
    components: {
        [Row.name]: Row,
        [Col.name]: Col,
        [Tabs.name]: Tabs,
        [TabPane.name]: TabPane,
        Menu
    },
    data(){
        return {
            list: [],
            isCollapse: false,
            tabsData:[
                { label: '总览', name: '总览' },
                { label: '站点管理', name: '站点管理' },
                { label: '站点分布', name: '站点分布' }
            ],
            activeName:'总览'
        }
    },
    computed:{
        autoSpan(){
            return this.isCollapse?1:3;
        }
    },
    beforeMount() {
        this.getMenuList();
    },
    mounted() {
        // setTimeout(()=>{
        //     this.isCollapse = true;
        // }, 3000)
    },
    methods: {
        getMenuList(){
            menuList().then(res=>{
                let list = res.list;
                list = this.tidyData(list);
                console.log(list);
                this.list = list;
            })
        },

        tidyData(list){
            if(!list || list.length<=0) return ;
            list.map(item=>{
                if(item.children.length===0) {
                    if(item.url !==""){
                        item.url = item.url.indexOf('http')>-1?item.url:'/'+item.url.split('.')[0];
                    }
                    console.log(item.id);
                }else{
                    this.tidyData(item.children);
                }
            })
            return list;
        },

        tabChange(tab, event){
            console.log(tab, event);
        },
        removeTab(targetName){
            let tabs = this.tabsData;
            let activeName = this.activeName;
            if(tabs.length<=1) return;
            if (activeName === targetName) {
                tabs.forEach((tab, index) => {
                    if (tab.name === targetName) {
                        let nextTab = tabs[index + 1] || tabs[index - 1];
                        if (nextTab) {
                            activeName = nextTab.name;
                        }
                    }
                });
            }
            this.activeName = activeName;
            this.tabsData = tabs.filter(tab => tab.name !== targetName);
        }
    }
}
</script>

<style lang="stylus">
.app
    margin 0 auto
    text-align center
    .logo
        width 100%
        height 62px
        background-color #1e9fff
        overflow:hidden
        span
            width 100%
            height 61px
            display inline-block
            background-image url("./assets/images/logo.png")
            background-position center
            background-repeat no-repeat
            background-size auto 80%
    .top
        width 100%
        height 62px
        background-color #54b5ff
        overflow hidden
        .icon-menu-show
            width 50px
            height 100%
            display flex
            flex-direction column
            justify-content center
            cursor pointer
            >i
                font-size 18px
    .submenu-tabs
        text-align center
        .el-tabs__header
            margin-top 16px
        .el-tabs__nav-scroll
            padding-left 10px


</style>