<template>
    <span :class="`iconfont icon-${name}`" :style="`color:${color}; font-size:${size}`"></span>
</template>

<script>
import '../assets/icons/iconfont'
import '../assets/icons/iconfont.css'
export default {
    name: 'zl-icons',
    props:{
        name: {
            type: String,
            default: ''
        },
        size:{
            type: String,
            default: '0.3rem'
        },
        color: {
            type: String,
            default: '#fff'
        }
    }
}
</script>
<style>

</style>