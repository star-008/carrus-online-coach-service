<template>
  <v-card class="elevation-0 mb-4">
    <v-card-text>
      <v-layout justify-space-between wrap>
        <v-flex grow class="order-details-row">
          <v-layout class="mb-2" wrap justify-space-between align-center>
            <div v-if="order.otherParticipant" class="mt-2">
              <router-link
                v-if="order.otherParticipant.role === 'coach'"
                :to="`/coach-profile/${order.otherParticipant.id}`"
              >
                {{ order.otherParticipant.firstName }}
                {{ order.otherParticipant.lastName }}
              </router-link>
              <span v-else>
                {{ order.otherParticipant.firstName }}
                {{ order.otherParticipant.lastName }}
              </span>
            </div>
            <div class="mt-2">
              <div>{{ order.upToDateItem.title }}</div>
              <div class="primary--text">
                <span v-if="order.upToDateItem.type === 'hourly'">Hourly</span>
                <span v-if="order.upToDateItem.type === 'fixed'">
                  Fixed • {{ order.upToDateItem.numSessions }} sessions
                </span>
              </div>
            </div>
            <div class="mt-2">
              ${{ order.upToDateItem.price || 0 }}
              <span v-if="order.upToDateItem.type === 'hourly'">/ hr</span>
            </div>
          </v-layout>
          <v-divider />

          <Transaction
            v-for="transaction in order.transactions"
            :key="transaction.id"
            :transaction="transaction"
          />
        </v-flex>

        <div class="mr-4">
          <template v-if="user.role === 'seeker'">
            <v-dialog
              v-model="purchaseDialog"
              width="400px"
              class="d-block my-2"
            >
              <v-btn
                v-if="!order.freeConsultation"
                slot="activator"
                block
                small
                class="ma-0 elevation-0 primary"
              >
                Buy Again
              </v-btn>
              <PurchasePackage
                v-if="purchaseDialog"
                :coach-package="order.upToDateItem"
                :coach-id="order.otherParticipant.id"
                @payment-complete="purchaseDialog = false"
              />
            </v-dialog>
            <v-btn
              v-if="$store.getters.features.includes('chat')"
              block
              small
              color="secondary"
              class="my-2 elevation-0"
              @click="messageUser"
            >
              Message coach
            </v-btn>
          </template>
          <template v-else>
            <v-btn
              v-if="$store.getters.features.includes('chat')"
              small
              block
              color="primary"
              class="ma-0 elevation-0"
              @click="messageUser"
            >
              Message client
            </v-btn>
          </template>
        </div>
      </v-layout>
    </v-card-text>
  </v-card>
</template>

<script>
import PurchasePackage from '@/components/seeker/PurchasePackage'
import Transaction from '@/components/common/Transaction'

export default {
  components: {
    PurchasePackage,
    Transaction,
  },

  props: ['order'],

  data() {
    return {
      coach: null,
      loading: false,

      purchaseDialog: false,
      reviewDialog: false,
    }
  },

  computed: {
    user() {
      return this.$store.state.auth.user
    },
    latestTransaction() {
      return this.order.transactions[0]
    },
  },

  methods: {
    markSessionDone() {
      this.lastSession.ref.update({
        completeAt: new Date(),
      })
    },
    messageUser() {
      this.$store.dispatch('messageUser', this.order.otherParticipant.id)
    },
    cancelPackage() {
      this.order.update({
        cancelled: true,
      })
    },
  },
}
</script>

<style lang="scss">
.order-details-row {
  @media (min-width: 600px) {
    margin-right: 2rem;
  }
}
</style>
