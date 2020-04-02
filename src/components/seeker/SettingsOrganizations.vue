<template>
  <v-card class="elevation-0 pa-3">
    <template v-if="organizations.length">
      <v-card
        v-for="organization in organizations"
        :key="organization.id"
        :to="`/organization/${organization.id}`"
        class="pa-3"
      >
        {{ organization.name }}
      </v-card>
    </template>
    <div v-else>
      You are not part of any Organizations
    </div>

    <v-btn
      :loading="loading"
      class="primary elevation-0 ma-0 mt-2"
      @click="createOrganization"
    >
      Create Organization
    </v-btn>
  </v-card>
</template>

<script>
import { functions } from '@/firebase'
import { mapState } from 'vuex'

export default {
  data() {
    return {
      loading: false,
    }
  },

  computed: mapState('organization', ['organizations']),

  methods: {
    async createOrganization() {
      this.loading = true

      const name = prompt('What is the name of your organization')

      if (name) {
        const createOrganizationFun = functions.httpsCallable(
          'createOrganizationOnCall'
        )

        await createOrganizationFun({ name })
      }

      this.loading = false
    },
  },
}
</script>

<style></style>
