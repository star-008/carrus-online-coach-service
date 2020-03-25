<template>
  <v-card class="elevation-0">
    <v-card-text>
      <v-layout class="request-row" align-start wrap>
        <v-icon class="request__icon mb-3" large>description</v-icon>
        <div>
          <div class="title mb-1">{{ request.title }}</div>
          <div v-if="request.seeker" class="subtitle mb-1">
            By {{ request.seeker.firstName }} {{ request.seeker.lastName }}

            <template v-if="request.seeker.type === 'business'">
              -
              <v-icon small>people</v-icon>
              {{ request.seeker.companyName }} (Business Account)
            </template>
            <template v-if="request.seeker.timezone.text">
              • {{ request.seeker.timezone.text }}
            </template>
          </div>
          <div class="subtitle grey--text mb-3">
            {{ request.industry }} • {{ request.coachingExpertise.join(', ') }}
          </div>
          <div>{{ request.description }}</div>
        </div>
        <v-spacer></v-spacer>
        <div class="request-actions">
          <template v-if="userIsSeeker && !request.acceptedAt">
            <v-btn
              color="primary"
              depressed
              small
              block
              @click="requestAccepted"
            >
              Close Request
            </v-btn>
            <v-dialog v-model="editRequestDialog" width="600" class="d-block">
              <v-btn slot="activator" color="secondary" depressed small block>
                Edit
              </v-btn>
              <NewRequestForm
                v-if="editRequestDialog"
                :existing-request="request"
                @success="editRequestDialog = false"
              />
            </v-dialog>
          </template>

          <v-btn
            v-if="!userIsSeeker && $store.getters.features.includes('chat')"
            class="ma-0 elevation-0 primary"
            small
            block
            :disabled="!$store.getters.canPublish"
            @click="$store.dispatch('messageUser', request.seekerId)"
          >
            Message user
          </v-btn>
          <div
            v-if="!userIsSeeker && !$store.getters.canPublish"
            class="caption text-xs-center"
          >
            Message users when
            <br />
            your profile is complete
          </div>

          <div class="text-xs-center mt-2">
            <div>Budget:</div>
            <div>
              <span class="subheading">${{ request.budget }}</span>
              / hour
            </div>
          </div>
        </div>
      </v-layout>
    </v-card-text>
  </v-card>
</template>

<script>
import { db } from '@/firebase'

import NewRequestForm from '@/components/seeker/NewRequestForm'

export default {
  components: {
    NewRequestForm,
  },

  props: ['request'],

  data() {
    return {
      editRequestDialog: false,
    }
  },

  computed: {
    user() {
      return this.$store.state.auth.user
    },
    userIsSeeker() {
      return this.user.uid === this.request.seekerId
    },
  },

  methods: {
    requestAccepted() {
      db.collection('requests')
        .doc(this.request.id)
        .update({
          acceptedAt: new Date(),
        })
    },
  },
}
</script>

<style lang="scss">
.request-row {
  @media (min-width: 600px) {
    &.wrap {
      flex-wrap: nowrap;
    }
  }
}

.request-actions {
  width: 100%;
  margin-top: 1rem;
  @media (min-width: 600px) {
    margin-top: 0;
    margin-left: 1rem;
    width: auto;
  }
}
.request__icon {
  @media (min-width: 600px) {
    margin-right: 1rem;
  }
}
</style>
