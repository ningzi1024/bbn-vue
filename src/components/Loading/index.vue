<template>
    <div class="zl-loading-wrap" v-if="loading">
        <div class="loading-mask"></div>
        <div class="el-loading-spinner">
            <svg viewBox="25 25 50 50" class="circular">
                <circle cx="50" cy="50" r="20" fill="none" class="path"></circle>
            </svg>
        </div>
    </div>
</template>

<script>
export default {
    name: 'loading',
    data(){
        return {
            loading: false
        }
    },
    created() {
        this.loading = true;
    }
}
</script>

<style lang="stylus">
.zl-loading-wrap
    >.loading-mask
        position: absolute;
        z-index: 2000;
        background-color: hsla(0,0%,100%,.2);
        margin: 0;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        transition: opacity .3s;
    >.el-loading-spinner
        top 50%
        margin-top -21px
        width 100%
        text-align center
        position absolute
        .circular {
            height: 42px;
            width: 42px;
            animation: loading-rotate 2s linear infinite;
        }
        .path {
            animation: loading-dash 1.5s ease-in-out infinite;
            stroke-dasharray: 90,150;
            stroke-dashoffset: 0;
            stroke-width: 2;
            stroke: #409eff;
            stroke-linecap: round;
        }
    @keyframes loading-rotate {
        to {
            transform: rotate(1turn)
        }
    }
</style>