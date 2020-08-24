<template>
    <div class="app">
        <el-row>
            <el-col :span="3">
                <div class="logo">
                    <span></span>
                </div>
                <Menu :menuList="list"/>
            </el-col>
            <el-col :span="21">
                <div class="top">

                </div>
                <router-view/>
            </el-col>
        </el-row>

    </div>
</template>

<script>
import Menu from './components/MenuList'
import { menuList } from './services/services'
import { Row, Col } from 'element-ui'
export default {
    name: 'app',
    components: {
        [Row.name]: Row,
        [Col.name]: Col,
        Menu
    },
    data(){
        return {
            list: []
        }
    },
    beforeMount() {
        this.getMenuList();
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
            width 100%;
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
</style>