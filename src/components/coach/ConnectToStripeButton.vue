<template>
  <div class="text-xs-center">
    <div>
      Carrus uses
      <a href="https://stripe.com/" target="_blank">Stripe</a>
      to securely process payments to your bank account. In order to publish
      your profile and start accepting payments on Carrus, you must link a
      Stripe account with Carrus.
    </div>
    <v-btn
      color="primary"
      class="elevation-0 mt-4 ma-0"
      :loading="loading"
      :href="stripeHref"
    >
      Connect Now
    </v-btn>
  </div>
</template>

<script>
import { functions } from '@/firebase'

export default {
  props: ['redirectPath'],

  data() {
    return {
      loading: false,
    }
  },

  computed: {
    stripeHref() {
      const baseURL = 'https://connect.stripe.com/oauth/authorize'
      const responseType = 'code'
      const clientId = process.env.VUE_APP_STRIPE_CLIENT_ID
      const scope = 'read_write'
      let href = `${baseURL}?response_type=${responseType}&client_id=${clientId}&scope=${scope}`
      if (this.redirectPath) {
        const origin = window.location.origin
        href += `&redirect_uri=${origin}${this.redirectPath}`
      }
      return href
    },
  },

  created() {
    var code = this.getURLParameter('code')

    if (code) {
      this.loading = true
      const linkStripeAccount = functions.httpsCallable('link_stripe_account')
      linkStripeAccount({ code })
        .catch(e => alert(e.message))
        .then(() => {
          this.loading = false
        })
    }
  },

  methods: {
    getURLParameter(name) {
      return (
        decodeURIComponent(
          (new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(
            location.search
          ) || [null, ''])[1].replace(/\+/g, '%20')
        ) || null
      )
    },
  },
}
</script>

<style></style>
