import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import './utils/flexible'
import { Message } from 'element-ui'

import './assets/style/reset.css'
import './assets/style/app.styl'

Vue.config.productionTip = false
Vue.prototype.$message = Message

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
