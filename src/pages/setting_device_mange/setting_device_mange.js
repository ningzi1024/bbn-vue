import Vue from 'vue'
import App from './setting_device_mange.vue'
import '../../utils/flexible'
import { Message, MessageBox } from 'element-ui'
import i18n from '../../assets/lang/index'


import '../../assets/style/reset.css'
import '../../assets/style/app.styl'


Vue.config.productionTip = false
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm

new Vue({
  i18n,
  render: h => h(App),
}).$mount('#app')
