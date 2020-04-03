import { auth, db } from '@/firebase'
import router from '@/router'
import store from '@/store'

export default {
  logIn(email, password) {
    return auth
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        const watcher = store.watch(
          () => store.state.auth.user,
          user => {
            watcher()
            if (user) router.push(`/${user.role}/dashboard`)
          }
        )
      })
      .catch(e => alert(e.message))
  },
  logOut() {
    auth.signOut()
    location.reload()
  },
  async register(payload) {
    const response = await auth.createUserWithEmailAndPassword(
      payload.email,
      payload.password
    )
    const user = response.user

    let userProfile = {
      email: payload.email,
      firstName: payload.firstName,
      lastName: payload.lastName,
      role: payload.role,
      createdAt: new Date(),
      type: payload.type,
    }

    if (payload.type === 'business')
      userProfile.companyName = payload.companyName

    if (payload.role === 'coach') {
      userProfile.accountVerified = false
      userProfile.stripeAccount = null
      userProfile.profileComplete = false
    }

    return db
      .collection('users')
      .doc(user.uid)
      .set(userProfile)
      .then(() => {
        userProfile.uid = user.uid
        store.commit('setUser', userProfile)
        router.push(`/${payload.role}/dashboard`)
      })
      .catch(e => alert(e.message))
  },
  changePassword(oldPassword, newPassword) {
    const email = store.state.auth.user.email
    return auth
      .signInWithEmailAndPassword(email, oldPassword)
      .then(response => {
        return response.user.updatePassword(newPassword)
      })
      .catch(e => alert(e.message))
  },
  changeEmail(newEmail, password) {
    const email = store.state.auth.user.email
    return auth.signInWithEmailAndPassword(email, password).then(response => {
      return response.user.updateEmail(newEmail)
    })
  },
}
