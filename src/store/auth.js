import { db, rt, firebase } from '@/firebase'

const AuthModule = {
  state: {
    user: null,
    loggedIn: null,
    chatKeys: null,
    userProfile: null,
  },

  getters: {
    canPublish: (state, getters) =>
      state.user &&
      state.user.numPackages &&
      state.user.profileComplete &&
      !(getters.features.includes('payments') && !state.user.stripeAccount),
  },

  mutations: {
    setUser(state, payload) {
      state.user = payload
    },
    setAuthStatus(state, payload) {
      state.loggedIn = payload
    },
    setProfile: (state, payload) => (state.userProfile = payload),
  },
  actions: {
    getUser({ commit, dispatch }, uid) {
      db.collection('users')
        .doc(uid)
        .onSnapshot(snap => {
          const user = snap.data()
          user.uid = uid
          commit('setUser', user)

          dispatch('loadRequests', uid)

          return user
        })

      const online = rt.ref('/presence/')
      online.update({ [uid]: true })
      online
        .onDisconnect()
        .update({ [uid]: firebase.database.ServerValue.TIMESTAMP })
    },
    getProfile({ commit }, uid) {
      db.collection('userProfiles')
        .doc(uid)
        .onSnapshot(doc => {
          commit('setProfile', doc.data())
        })
    },
  },
}

export default AuthModule
