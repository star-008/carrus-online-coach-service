import Vue from 'vue'
import Vuex from 'vuex'
import { db } from '@/firebase'

import Order from '@/models/Order'
import Notification from '@/models/Notification'

import auth from './auth'
import chat from './chat'
import request from './request'
import organization from './organization'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    auth,
    chat,
    request,
    organization,
  },
  state: {
    orders: [],
    notifications: [],
    featuresString: process.env.VUE_APP_FEATURES,
    coachIndex: `COACHES_${process.env.VUE_APP_PROJECT}_${
      process.env.NODE_ENV === 'production' ? 'prod' : 'dev'
    }`,
    supportEmail: process.env.VUE_APP_SUPPORT_EMAIL,
    project: process.env.VUE_APP_PROJECT,
  },
  getters: {
    unseenNotifications(state) {
      return state.notifications.filter(notification => !notification.seenAt)
    },
    features: state => state.featuresString.split(',') || [],
  },
  mutations: {
    setOrders(state, payload) {
      state.orders = payload
    },
    setNotifications(state, payload) {
      state.notifications = payload
    },
  },
  actions: {
    loadTransactions({ commit }, uid) {
      db.collection('orders')
        .where('participants', 'array-contains', uid)
        .orderBy('createdAt', 'desc')
        .onSnapshot(query => {
          const orders = query.docs.map(doc => {
            const data = {
              id: doc.id,
              ref: doc.ref,
              ...doc.data(),
            }
            return new Order(data, uid)
          })
          commit('setOrders', orders)
        })
    },
    loadNotifications({ commit }, uid) {
      db.collection('users')
        .doc(uid)
        .collection('notifications')
        .onSnapshot(snapshot => {
          const notifications = snapshot.docs.map(doc => {
            const notificationData = {
              id: doc.id,
              ref: doc.ref,
              ...doc.data(),
            }
            return new Notification(notificationData)
          })
          commit('setNotifications', notifications)
        })
    },
  },
})

export default store
