<template>
  <v-container class="wrapper--thin">
    <h2 class="font-weight-medium mb-3">My Settings</h2>
    <MySettings />

    <template v-if="$store.getters.features.includes('payments')">
      <h2 class="font-weight-medium mt-4 mb-3">Payment information</h2>
      <v-card class="elevation-0">
        <v-card-text class="text-xs-center">
          <div v-if="user.stripeAccount">
            <div>Stripe Id: {{ user.stripeAccount.stripe_user_id }}</div>
            <v-btn
              color="primary"
              class="elevation-0 mt-4"
              href="https://stripe.com/"
              target="_blank"
            >
              Login to Stripe
            </v-btn>
          </div>
          <ConnectToStripeButton v-else redirect-path="/coach/settings" />
        </v-card-text>
      </v-card>
    </template>

    <h2 class="font-weight-medium mt-4 mb-3">Change Password</h2>
    <ChangePassword />
  </v-container>
</template>

<script>
import MySettings from '@/components/common/MySettings'
import ChangePassword from '@/components/common/ChangePassword'
import ConnectToStripeButton from '@/components/coach/ConnectToStripeButton'

export default {
  name: 'CoachSettings',
  components: {
    MySettings,
    ChangePassword,
    ConnectToStripeButton,
  },

  computed: {
    user() {
      return this.$store.state.auth.user
    },
  },
}
</script>
