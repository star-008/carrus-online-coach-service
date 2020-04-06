<template>
  <v-container v-if="userProfile">
    <h1 class="font-weight-medium mb-3">Get started</h1>
    <v-layout wrap>
      <v-flex xs12 md9 class="dashboard-main">
        <div class="dashboard-grid">
          <v-card class="elevation-0 dashboard-welcome">
            <v-card-text v-if="setupComplete">
              <h2>Welcome</h2>
              <div class="my-4">
                Start your first coaching session on
                {{ $store.state.project }} today!
              </div>
              <v-btn
                v-if="$store.getters.features.includes('chat')"
                color="primary"
                class="elevation-0 ma-0"
                to="/coach/requests"
              >
                See Requests
              </v-btn>
            </v-card-text>
            <v-card-text v-else>
              <h2>Getting Started</h2>
              <p class="subheading">
                {{ stepsComplete }} out of {{ numSteps }} steps completed
              </p>
              <v-progress-linear v-model="progress"></v-progress-linear>
              <ol>
                <li
                  class="onboarding-step subheading my-1"
                  :class="{ complete: profileComplete }"
                >
                  Setup your
                  <router-link to="/coach/profile">profile</router-link>
                </li>
                <li
                  class="onboarding-step subheading my-1"
                  :class="{ complete: user.numPackages }"
                >
                  Create your
                  <router-link to="/coach/profile#packages">
                    packages
                  </router-link>
                </li>
                <li
                  v-if="$store.getters.features.includes('payments')"
                  class="onboarding-step subheading my-1"
                  :class="{ complete: user.stripeAccount }"
                >
                  Configure
                  <router-link to="/coach/profile#connect-to-stripe">
                    payment details
                  </router-link>
                </li>
                <li
                  class="onboarding-step subheading my-1"
                  :class="{ complete: userProfile.hasPublished }"
                >
                  <a @click="$animate('#privacyBox', 'tada')">
                    Publish profile
                  </a>
                </li>
              </ol>
            </v-card-text>
          </v-card>
          <v-card
            class="dashboard-action elevation-0 text-xs-center d-flex align-center"
          >
            <v-card-text>
              <div class="mb-3">
                <v-icon large>person</v-icon>
              </div>
              <v-btn small class="elevation-0 ma-0" to="/coach/profile">
                Profile
              </v-btn>
            </v-card-text>
          </v-card>
          <v-card
            id="privacyBox"
            class="dashboard-action elevation-0 text-xs-center d-flex align-center"
          >
            <v-card-text>
              <div class="mb-3">
                <v-icon v-if="userProfile.public" large>visibility</v-icon>
                <v-icon v-else large>visibility_off</v-icon>
              </div>
              <div class="mb-1">
                Profile is
                <span v-if="!userProfile.public">private</span>
                <span v-else>public</span>
              </div>
              <v-btn
                class="ma-0 elevation-0"
                small
                :class="{
                  secondary: userProfile.public,
                  primary: !userProfile.public,
                }"
                :disabled="!canPublish"
                @click="togglePublic"
              >
                Make&nbsp;
                <span v-if="userProfile.public">private</span>
                <span v-else>public</span>
              </v-btn>
              <div v-if="!canPublish" class="caption mt-1">
                Complete 'Getting Started' to publish your profile.
              </div>
            </v-card-text>
          </v-card>
        </div>

        <template v-if="$store.getters.features.includes('chat')">
          <h1 class="font-weight-medium mt-4 mb-3">Open requests</h1>
          <CoachRequestsFilter />
        </template>
      </v-flex>
      <v-flex xs12 md3 class="dashboard-side px-2">
        <v-card class="elevation-0 border">
          <v-card-text>
            <h3>Questions?</h3>
            <ul>
              <li>
                Email us
                <a :href="`mailto:${$store.state.supportEmail}`">here</a>
              </li>
              <li>
                <router-link :to="`/${user.role}/faq`">FAQ</router-link>
              </li>
            </ul>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import CoachRequestsFilter from '@/components/coach/CoachRequestsFilter'
import { db } from '@/firebase'

export default {
  components: {
    CoachRequestsFilter,
  },

  computed: {
    user() {
      return this.$store.state.auth.user
    },
    userProfile() {
      return this.$store.state.auth.userProfile
    },
    profileComplete() {
      return this.user.profileComplete
    },

    canPublish() {
      return this.$store.getters.canPublish
    },

    setupComplete() {
      return this.canPublish && this.userProfile.hasPublished
    },

    steps() {
      const steps = [
        this.profileComplete,
        this.user.numPackages,
        this.userProfile.hasPublished,
      ]

      if (this.$store.getters.features.includes('payments'))
        steps.push(this.user.stripeAccount)

      return steps
    },

    numSteps() {
      return this.steps.length
    },

    stepsComplete() {
      return this.steps.filter(step => !!step).length
    },

    progress() {
      return (this.stepsComplete / this.numSteps) * 100
    },
  },

  methods: {
    togglePublic() {
      db.collection('userProfiles')
        .doc(this.user.uid)
        .update({
          public: !this.userProfile.public,
        })
    },
  },
}
</script>

<style lang="scss">
.onboarding-step {
  &.complete {
    text-decoration: line-through;
  }
}
</style>
