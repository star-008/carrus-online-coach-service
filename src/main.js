import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import { auth } from '@/firebase'
import InstantSearch from 'vue-instantsearch'
import Vuelidate from 'vuelidate'
import Croppa from 'vue-croppa'
import 'vue-croppa/dist/vue-croppa.css'
import './plugins/directives'
import './plugins/vuetify'
import './plugins/animate'
import './plugins/money'
import './assets/scss/main.scss'

Vue.use(Croppa)
Vue.use(Vuelidate)
Vue.use(InstantSearch)

Vue.config.productionTip = false

let app
auth.onAuthStateChanged(auth => {
  if (auth) {
    store.commit('setAuthStatus', true)
    store.dispatch('getUser', auth.uid)
    store.dispatch('getChats', auth.uid)
    store.dispatch('loadTransactions', auth.uid)
    store.dispatch('loadNotifications', auth.uid)
    store.dispatch('getProfile', auth.uid)
    store.dispatch('organization/loadOrganizations', auth.uid)
  } else {
    store.commit('setAuthStatus', false)
  }

  if (!app) {
    app = new Vue({
      router,
      store,
      render: h => h(App),
    }).$mount('#app')
  }
})
