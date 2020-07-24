<template>
    <div class="zl-sites-wrap">
        <img :src="bgImg" alt="">
    </div>
</template>

<script>
export default {
    name: 'site',
    props:{
        hostId: {
            type: Number||String,
            default: ''
        }
    },
    data(){
        return {
            bgImg: require('../../assets/images/station_bg_demo.jpg')
        }
    }
}
</script>

<style lang="stylus">
.zl-sites-wrap{

}
</style>