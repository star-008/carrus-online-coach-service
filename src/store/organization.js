import { db } from '@/firebase'

const defaultState = () => {
  return {
    organizations: [],
    selectedOrganizationId: '',
  }
}

export default {
  namespaced: true,

  state: defaultState(),

  getters: {
    selectedOrganization: state =>
      state.organizations.find(
        organization => state.selectedOrganizationId == organization.id
      ),
  },

  mutations: {
    setOrganizations: (state, organizations) =>
      (state.organizations = organizations),
    setSelectedOrganization: (state, organizationId) =>
      (state.selectedOrganizationId = organizationId),
  },

  actions: {
    async loadOrganizations({ commit }, uid) {
      db.collection('organizations')
        .where('participants', 'array-contains', uid)
        .onSnapshot(snap => {
          const organizations = snap.docs.map(doc => {
            return {
              id: doc.id,
              ...doc.data(),
            }
          })

          commit('setOrganizations', organizations)
        })
    },
  },
}
