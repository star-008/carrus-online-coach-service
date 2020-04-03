<template>
  <v-card class="coach-package elevation-0 pa-4">
    <h3 class="headline">
      {{ coachPackage.title }}
      <v-dialog
        v-if="canEdit && coachPackage.id !== 'standard'"
        v-model="editDialog"
        width="400px"
      >
        <v-icon slot="activator">edit</v-icon>
        <EditPackage
          :coach-package-prop="coachPackage"
          @saved="editDialog = false"
        />
      </v-dialog>
    </h3>
    <div class="primary--text mb-4">
      <template v-if="coachPackage.type === 'hourly'">
        Hourly
      </template>
      <template v-if="coachPackage.type === 'fixed'">
        Fixed Price • {{ coachPackage.numSessions }} sessions
      </template>
    </div>
    <div class="coach-package__description mb-4">
      <template v-if="coachPackage.id === 'standard' && canEdit">
        This is your default coaching package. You can edit the price in your
        "about me" section.
      </template>
      <span v-truncate="coachPackage.description"></span>
      &nbsp;
      <a
        v-if="coachPackage.description.length > 150"
        @click="purchaseDialog = true"
      >
        see more
      </a>
    </div>
    <div class="mb-4">
      <span class="headline">${{ coachPackage.price }}</span>
      <span v-if="coachPackage.type === 'hourly'">&nbsp;/ hour</span>
    </div>
    <v-dialog
      v-if="$store.getters.features.includes('payments')"
      v-model="purchaseDialog"
      width="400px"
    >
      <v-btn slot="activator" block color="primary" class="elevation-0 ma-0">
        Select Package
      </v-btn>
      <PurchasePackage
        v-if="purchaseDialog"
        :can-edit="canEdit"
        :coach-package="coachPackage"
        :coach-id="coachId"
        @payment-complete="paymentComplete"
      />
    </v-dialog>
    <v-btn
      v-else
      block
      class="primary elevation-0 ma-0"
      :href="
        `mailto:${$store.getters.supportEmail}?subject=Order on ${$store.state.project}&body=I am interested in purchasing package '${coachPackage.title}' from coach ${coachId}.`
      "
    >
      Purchase Package
    </v-btn>
    <v-dialog v-model="nextStepsDialog" width="600px">
      <NextSteps :coach-package="coachPackage" :coach-id="coachId" />
    </v-dialog>
  </v-card>
</template>

<script>
import PurchasePackage from '@/components/seeker/PurchasePackage'
import EditPackage from '@/components/common/EditPackage'
import NextSteps from '@/components/common/NextSteps'

export default {
  components: {
    PurchasePackage,
    EditPackage,
    NextSteps,
  },

  props: ['coachPackage', 'coachId', 'canEdit'],

  data() {
    return {
      editDialog: false,
      purchaseDialog: false,
      nextStepsDialog: false,
      seeMore: false,
      sliceLength: 130,
    }
  },

  computed: {
    user() {
      return this.$store.state.auth.user
    },
    description() {
      const original = this.coachPackage.description
      const appendEllipsis = original.length > this.sliceLength ? '…' : ''
      return this.seeMore
        ? original
        : original
            .split('')
            .slice(0, this.sliceLength)
            .join('') + appendEllipsis
    },
  },

  methods: {
    paymentComplete() {
      this.purchaseDialog = false
      this.nextStepsDialog = true
    },
  },
}
</script>

<style lang="scss">
.next-steps {
  padding: 0;
  list-style: none;

  &-step {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin: 2rem 0;

    @media (min-width: 768px) {
      flex-wrap: nowrap;
      &__image {
        margin-right: 1rem;
      }
    }
  }
}
</style>
