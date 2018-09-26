import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './router/router'
import store from './store/'
import {routerMode} from './config/env'
import './config/rem'
import FastClick from 'fastclick'

if ('addEventListener' in document) {
    document.addEventListener('DOMContentLoaded', function() {
        FastClick.attach(document.body);
    }, false);
}

Vue.use(VueRouter)
const router = new VueRouter({
	routes,
	mode: routerMode,
	strict: process.env.NODE_ENV !== 'production',
	scrollBehavior (to, from, savedPosition) {//返回希望滚动到哪个的位置
	    if (savedPosition) {
		    return savedPosition
		} else {
			if (from.meta.keepAlive) {
				from.meta.savedPosition = document.body.scrollTop;
			}
		    return { x: 0, y: to.meta.savedPosition || 0 }
		}
	}
})

//Vue 的$mount()为手动挂载，在项目中可用于延时挂载（例如在挂载之前要进行一些其他操作、判断等），
// 之后要手动挂载上。new Vue时，el和$mount并没有本质上的不同。
new Vue({
	router,
	
	/* 把 store 对象提供给 “store” 选项，这可以把 store 的实例注入所有的子组件
	通过在根实例中注册 store 选项，该 store 实例会注入到根组件下的所有子组件中，
	且子组件能通过 this.$store 
	*/
	store, 
}).$mount('#app')

