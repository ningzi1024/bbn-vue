<template>
<div v-if="item.children">
    <template v-if="item.children.length === 0">
        <el-menu-item :index="item.name" @click="goRoute(item.url)">
          <i :class="`${item.icon}`"></i>
          <span>{{item.name}}</span>
        </el-menu-item>
    </template>
    <el-submenu v-else :index="item.name">
        <template slot="title">
            <i :class="`${item.icon}`"></i>
            <span>{{item.name}}</span>
        </template>
        <template v-for="(child,i) in item.children">
            <RecursiveMenu v-if="child.children && child.children.length>0" :key="child.url+i" :item="child"/>
            <el-menu-item v-else :key="child.url+i" :index="child.name" @click="goRoute(child.url)">
                <i :class="`${child.icon}`"></i>
                <span>{{child.name}}</span>
            </el-menu-item>      
        </template>
    </el-submenu>
</div>
</template>

<script>
import { MenuItem, Submenu } from 'element-ui'
export default {
    name: 'RecursiveMenu',
    props:{
        item:{
            type: Object,
            required: true
        }
    },
    components:{
        'el-menu-item': MenuItem,
        'el-submenu': Submenu
    },
    methods:{
        goRoute(url){
            if(!url || url==="") return;
            this.$router.push(url);
        }
    }
}
</script>