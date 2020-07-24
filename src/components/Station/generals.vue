<template>
    <div class="zl-general-wrap">
        <el-row>
            <el-col :span="5" class="device-img">
                <img :src="leftImg" alt="">
            </el-col>
            <el-col :span="19">
                <div class="device-content">
                    <img :src="rightImg" alt="">
                </div>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import { Row, Col } from 'element-ui';
import Const from '../../utils/const'
import { getDeviceById } from '../../services/services'
export default {
    name: 'general',
    props:{
        deviceId: {
            type: Number,
            default: 0
        }
    },
    components: {
        [Row.name]: Row,
        [Col.name]: Col
    },
    created() {
        this.leftImgs = {
            2: require('../../assets/images/temp_th_left_02.jpg'),  //温湿度
            19: require('../../assets/images/temp_th_left_19.jpg'), //电量仪
            3: require('../../assets/images/temp_th_left_03.jpg'),  //UPS
            9: require('../../assets/images/temp_th_left_9.jpg')   //精密空调
        };
        this.rightImgs = {
            2: require('../../assets/images/temp_th_right_02.jpg'),
            19: require('../../assets/images/temp_th_right_19.jpg'),
            3: require('../../assets/images/temp_th_right_03.jpg'),
            9: require('../../assets/images/temp_th_right_9.jpg')
        };
    },
    watch:{
        deviceId(newVal){
            if(newVal){
                this.getDeviceInfo();
            }
        }
    },
    data(){
        return {
            leftImg: '',
            rightImg: ''
        }
    },
    methods: {
        async getDeviceInfo(){
            let id = this.deviceId;
            if(!id) return;
            let info = await getDeviceById(id).then(res=>res);
            let sortId = Const.DEVICE_SORT[info.sort];
            this.leftImg = this.leftImgs[sortId];
            this.rightImg = this.rightImgs[sortId];
            console.log(this.leftImg);
        }
    },
    mounted() {
        this.getDeviceInfo();
    }
}
</script>
<style lang="stylus">
.zl-general-wrap
    margin 0 auto
    .device-img
        height 673px

    .device-content
        width 100%
        padding-top 80px
        height 673px
        border-left  1px solid #dae7ee
        overflow hidden
</style>