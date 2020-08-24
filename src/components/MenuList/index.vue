<template>
    <div class="zl-sidebar-container">
        <el-menu
                class="my-menu"
                :default-active="defaultIndex"
                @select="handleSelect"
                mode="vertical"
                text-color="#555"
                @open="handleOpen"
                @close="handleClose"
                :default-openeds="openeds"
                active-text-color="#666">
            <RecursiveMenu v-for="(menu,index) in menuList" :key="`${menu.index}-${index}`" :item="menu"/>
        </el-menu>
    </div>
</template>

<script>
import {Menu} from 'element-ui'

import RecursiveMenu from './recursiveMenu'
export default {
    name: 'MenuList',
    props:{
        menuList:{
            type: Array,
            require: true,
            default: ()=>[]
        }
    },
    components:{
        [Menu.name]:Menu,
        RecursiveMenu
    },
    data(){
      return {
          isCollapse: false,
          openeds: [],
          defaultIndex: '总览'
      }
    },
    created() {
        let routeName = this.$route.name || 'admin';
        console.log(routeName);
        this.defaultIndex = routeName
    },
    methods:{
        handleOpen(key, keyPath) {
            console.log(key, keyPath);
        },
        handleClose(key, keyPath) {
            console.log(key, keyPath);
        },
        handleSelect(key, keyPath) {
            console.log('handleSelect:', key, keyPath);
        }
    }
}
</script>

<style lang="stylus">
.zl-sidebar-container
    height 800px
    overflow-x hidden
    overflow-y auto
    .el-submenu .el-menu-item
        padding 0;
    .el-submenu__title, .el-menu-item
        text-align left
    .el-submenu__title i, .el-menu-item i
        display inline-block
        margin-left 30px

</style>