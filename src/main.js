// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import App from './App';
import goods from 'components/goods/goods';
import ratings from 'components/ratings/ratings';
import seller from 'components/seller/seller';

import 'common/scss/index.scss';

Vue.config.productionTip = false;

Vue.use(VueRouter);
Vue.use(VueResource);

// /* eslint-disable no-new */
// new Vue({
//   el: '#app',
//   template: '<App/>',
//   components: { App }
// })

const routes = [
  {
    path: '/',
    component: goods
  },
  {
    path: '/goods',
    component: goods
  },
  {
    path: '/ratings',
    component: ratings
  },
  {
    path: '/seller',
    component: seller
  }
];

const router = new VueRouter({
  routes,
  linkActiveClass: 'active'
});

new Vue({
  // el: '#app',
  // template: '<App/>',
  // components: { App },
  router,
  render: h => h(App)  // render函数，让我们可以通过javascript编程方式去初始化一个模板，不用传入一个template这样的属性；h是一个ES6的语法，对应到createElement这样的函数，把APP组件传入，然后去渲染App组件
}).$mount('#app');

// router.push('/goods');
