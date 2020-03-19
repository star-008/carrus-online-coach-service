import { db } from '@/firebase'
import Chat from '@/models/Chat'

const chat = {
  state: {
    chats: [],
    currentChat: null,
    showChat: false,
  },
  getters: {
    chatsWithNotifications(state, getters) {
      return state.chats.map(chat => {
        chat.notifications = getters.unseenNotifications.filter(
          notification => notification.chatId === chat.id
        )
        return chat
      })
    },
  },
  mutations: {
    setChats(state, payload) {
      state.chats = payload
    },
    setCurrentChat(state, payload) {
      state.currentChat = payload
    },
    setShowChat(state, payload) {
      state.showChat = payload
    },
  },
  actions: {
    getChats({ commit }, uid) {
      db.collection('chats')
        .where('participants', 'array-contains', uid)
        .orderBy('lastMessage.createdAt', 'desc')
        .onSnapshot(snapshot => {
          var chats = []
          snapshot.forEach(doc => {
            const data = {
              id: doc.id,
              ref: doc.ref,
              ...doc.data(),
            }
            chats.push(new Chat(data, uid))
          })
          commit('setChats', chats)
        })
    },
    messageUser({ rootState, getters, commit }, userId) {
      const chatAlreadyExists = getters.chatsWithNotifications.find(chat =>
        chat.participants.includes(userId)
      )
      const uid = rootState.auth.user.uid
      if (chatAlreadyExists) {
        commit('setCurrentChat', chatAlreadyExists)
        commit('setShowChat', true)
      } else {
        const data = {
          participants: [userId, uid],
        }
        commit('setCurrentChat', new Chat(data))
        commit('setShowChat', true)
        db.collection('chats')
          .add({
            createdAt: new Date(),
            participants: [userId, uid],
          })
          .then(ref => {
            ref.get().then(doc => {
              const data = {
                id: doc.id,
                ref: doc.ref,
                ...doc.data(),
              }
              commit('setCurrentChat', new Chat(data, uid))
              commit('setShowChat', true)
            })
          })
      }
    },
  },
}

export default chat
