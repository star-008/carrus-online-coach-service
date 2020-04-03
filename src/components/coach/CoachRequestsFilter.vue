<template>
  <div>
    <v-layout wrap class="mt-4 mb-0">
      <v-flex xs12 sm4>
        <v-select
          v-model="selectedIndustry"
          label="Filter by"
          :items="industries"
          clearable
        ></v-select>
      </v-flex>
      <v-flex xs12 sm4>
        <v-select
          v-model="selectedCoachingExpertise"
          label="Filter"
          :items="coachingExpertise"
          clearable
        ></v-select>
      </v-flex>
      <v-flex xs12 sm4>
        <v-text-field
          v-model="budget"
          label="Budget"
          type="number"
          hint="$ / hour"
          persistent-hint
          clearable
        ></v-text-field>
      </v-flex>
    </v-layout>

    <Request
      v-for="request in this.$store.state.request.requests"
      :key="request.id"
      class="mb-4"
      :request="request"
    />
  </div>
</template>

<script>
import Request from '@/components/common/Request'
import industries from '@/assets/js/industries.json'
import coachingExpertise from '@/assets/js/coachingExpertise.json'

export default {
  components: {
    Request,
  },

  data() {
    return {
      industries: industries,
      coachingExpertise: coachingExpertise,
    }
  },

  computed: {
    selectedIndustry: {
      get: function() {
        return this.$store.state.request.selectedIndustry
      },
      set: function(newValue) {
        this.$store.commit('setSelectedIndustry', newValue)
        this.$store.dispatch('loadRequests', this.$store.state.auth.user.uid)
      },
    },
    selectedCoachingExpertise: {
      get: function() {
        return this.$store.state.request.selectedCoachingExpertise
      },
      set: function(newValue) {
        this.$store.commit('setSelectedCoachingExpertise', newValue)
        this.$store.dispatch('loadRequests', this.$store.state.auth.user.uid)
      },
    },
    budget: {
      get: function() {
        return this.$store.state.request.budget
      },
      set: function(newValue) {
        this.$store.commit('setBudget', Number(newValue))
        this.$store.dispatch('loadRequests', this.$store.state.auth.user.uid)
      },
    },
  },
}
</script>
