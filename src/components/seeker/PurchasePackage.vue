<template>
  <v-card>
    <v-card-title>
      <h3>Purchase {{ coachPackage.title }}</h3>
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <div class="primary--text mb-3">
        <template v-if="coachPackage.type === 'hourly'">
          Hourly
        </template>
        <template v-if="coachPackage.type === 'fixed'">
          Fixed Price • {{ coachPackage.numSessions }} sessions
        </template>
      </div>
      <div class="mb-3">{{ coachPackage.description }}</div>
      <div class="my-4">
        <v-layout class="my-2" justify-space-between>
          <div>
            {{
              coachPackage.type === 'hourly'
                ? '1 hour coaching'
                : `${coachPackage.numSessions} sessions`
            }}
          </div>
          <div>${{ coachPackage.price }}</div>
        </v-layout>
        <v-layout class="my-2" justify-space-between>
          <div>Processing fee</div>
          <div>${{ processingFee.toFixed(2) }}</div>
        </v-layout>
        <v-layout class="my-2" justify-space-between>
          <div class="title">Total</div>
          <div class="title">${{ total.toFixed(2) }}</div>
        </v-layout>
      </div>

      <template v-if="!canEdit">
        <div class="mb-2">Card Details</div>
        <div class="card-container">
          <div id="card-element"></div>
        </div>
        <div v-if="cardError" class="caption error--text" role="alert">
          {{ cardError }}
        </div>
        <v-btn
          block
          color="primary"
          class="mt-4 mb-0 mx-auto elevation-0"
          :loading="loading"
          :disabled="!cardComplete"
          @click="pay"
        >
          Complete Purchase
        </v-btn>
      </template>
      <div v-if="error" class="error--text">{{ error }}</div>
    </v-card-text>
  </v-card>
</template>

<script>
import { functions } from '@/firebase'

const stripe = window.Stripe(process.env.VUE_APP_STRIPE_PUBLISHABLE_KEY)

export default {
  props: ['coachPackage', 'coachId', 'canEdit'],

  data() {
    return {
      clientSecret: '',
      card: null,
      cardComplete: false,
      cardError: '',
      error: '',
      loading: false,
    }
  },

  computed: {
    user() {
      return this.$store.state.auth.user
    },
    total() {
      const price = this.coachPackage.price
      return (price + 0.3) / (1 - 0.029)
    },
    processingFee() {
      return this.total - this.coachPackage.price
    },
  },

  created() {
    this.clientSecret = this.initializePaymentIntent()
  },

  methods: {
    async initializePaymentIntent() {
      const transactionData = {
        coachPackageId: this.coachPackage.id,
        coachId: this.coachId,
        seekerId: this.user.uid,
      }

      const transaction = functions.httpsCallable('transaction')

      const response = await transaction(transactionData)

      this.clientSecret = response.data.client_secret
      this.mountStripeCard()
    },

    mountStripeCard() {
      const elements = stripe.elements()
      this.card = elements.create('card')
      this.card.mount('#card-element')

      this.card.addEventListener('change', event => {
        this.cardHandler(event)
      })
    },

    cardHandler(event) {
      if (event.error) {
        this.cardError = event.error.message
      } else {
        this.cardError = ''
      }

      this.cardComplete = event.complete
    },

    async pay() {
      this.loading = true

      const response = await stripe.handleCardPayment(
        this.clientSecret,
        this.card
      )

      if (response.error) {
        this.error = response.error.message
      } else {
        this.$emit('payment-complete')
      }

      this.loading = false
    },
  },
}
</script>

<style>
.card-container {
  padding: 10px 12px;
  box-shadow: 0 1px 3px 0 #e6ebf1;
  border-radius: 4px;
  font-size: 0.9em;
}
</style>
