<template>
  <v-card v-if="!complete">
    <v-card-title class="title">Order Free Consultation?</v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <p>Would you like to order a free consultation?</p>
      <p>
        Coaches choose to offer this service in order to give you an opportunity
        to see if they are the right fit.
      </p>
      <p>You can only do this once for each coach.</p>
      <v-btn
        class="primary elevation-0 ma-0"
        :loading="loading"
        @click="orderFreeConsultation"
      >
        Order Free Consultation
      </v-btn>
    </v-card-text>
  </v-card>
  <NextSteps v-else :free-consultation="true" :coach-id="coachId" />
</template>

<script>
import { functions } from '@/firebase'

import NextSteps from '@/components/common/NextSteps'

export default {
  components: {
    NextSteps,
  },

  props: ['coachId'],

  data() {
    return {
      complete: false,
      loading: false,
    }
  },

  methods: {
    orderFreeConsultation() {
      this.loading = true
      const freeConsultation = functions.httpsCallable('freeConsultation')

      freeConsultation({ coachId: this.coachId })
        .then(() => {
          this.complete = true
        })
        .catch(e => alert(e))
        .then(() => {
          this.loading = false
        })
    },
  },
}
</script>
