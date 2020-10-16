import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import instance from './libs/request';
import api from './libs/api';
import dayjs from 'dayjs';
import jsBridge from './libs/bridge';
import jsonp from 'vue-jsonp';
import { Notify, Toast } from 'vant';
import './assets/css/common.less';
Vue.prototype.$http = instance;
Vue.prototype.$Notify = Notify;
Vue.prototype.$Toast = Toast;
Vue.prototype.$jsBridge = jsBridge;
Vue.prototype.$api = api;
Vue.prototype.$dayjs = dayjs;
Vue.prototype.$jsonp = jsonp;
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
