import { db } from '@/firebase'
import Request from '@/models/Request'

const request = {
  state: {
    requests: [],
    selectedIndustry: '',
    selectedCoachingExpertise: '',
    budget: 0,
  },
  getters: {
    openRequests(state) {
      return state.requests.filter(request => !request.acceptedAt)
    },
    requestsQuery(state, _, rootState) {
      let query = db.collection('requests')
      if (rootState.auth.user) {
        if (rootState.auth.user.role === 'coach') {
          query = query.where('acceptedAt', '==', null)
          if (state.selectedIndustry) {
            query = query.where('industry', '==', state.selectedIndustry)
          }
          if (state.selectedCoachingExpertise) {
            query = query.where(
              'coachingExpertise',
              'array-contains',
              state.selectedCoachingExpertise
            )
          }
          if (state.budget) {
            query = query.where('budget', '>=', state.budget)
            query = query.orderBy('budget', 'asc')
          }
        } else {
          query = query.where('seekerId', '==', rootState.auth.user.uid)
        }
      }

      query = query.orderBy('createdAt', 'desc')

      return query
    },
  },
  mutations: {
    setRequests(state, payload) {
      state.requests = payload
    },
    setSelectedIndustry(state, payload) {
      state.selectedIndustry = payload
    },
    setSelectedCoachingExpertise(state, payload) {
      state.selectedCoachingExpertise = payload
    },
    setBudget(state, payload) {
      state.budget = payload
    },
  },
  actions: {
    loadRequests({ commit, getters }) {
      getters.requestsQuery.onSnapshot(querySnapshot => {
        const requests = querySnapshot.docs.map(doc => {
          const data = {
            id: doc.id,
            ...doc.data(),
          }
          return new Request(data)
        })
        commit('setRequests', requests)
      })
    },
  },
}

export default request
