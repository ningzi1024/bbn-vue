<template>
    <i :class="`iconfont ${name}`" :style="`color:${color}`"></i>
</template>

<script>
import '../../assets/icons/index.css'
export default {
    name: 'bbn-icons',
    props: {
        name: {
            type: String,
            default: ""
        },
        size: {
            type: String,
            default: ""
        }
    }
}
</script>

<style lang="stylus">

</style>