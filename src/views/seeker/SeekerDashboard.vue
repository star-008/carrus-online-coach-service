<template>
  <v-container>
    <h1 class="font-weight-medium">Get started</h1>
    <v-layout wrap>
      <v-flex xs12 md9 class="dashboard-main">
        <div class="dashboard-grid">
          <v-card class="elevation-0 dashboard-welcome">
            <v-card-text>
              <h2>Welcome</h2>
              <div class="my-4">
                Find the next coach to kickstart your career
              </div>
              <template v-if="$store.getters.features.includes('chat')">
                <v-dialog width="600px">
                  <v-btn
                    slot="activator"
                    color="primary"
                    class="elevation-0 ma-0"
                  >
                    Post request
                  </v-btn>
                  <NewRequestForm />
                </v-dialog>
                <p class="caption mt-1">
                  Your last name will remain hidden when posting a request or
                  chatting to a coach.
                </p>
              </template>
              <v-btn
                v-else
                color="primary"
                class="elevation-0 ma-0"
                to="/seeker/coach-list"
              >
                Search Coaches
              </v-btn>
            </v-card-text>
          </v-card>

          <v-card
            v-if="$store.state.project === 'Carrus'"
            class="dashboard-action elevation-0 text-xs-center d-flex align-center"
          >
            <v-card-text>
              <div class="mb-3">
                <v-icon large>subject</v-icon>
              </div>
              <v-btn
                small
                class="elevation-0 ma-0"
                to="/seeker/coach-list?cv_advice=true"
              >
                Get CV Advice
              </v-btn>
            </v-card-text>
          </v-card>

          <v-card
            v-if="$store.getters.features.includes('chat')"
            class="dashboard-action elevation-0 text-xs-center d-flex align-center"
          >
            <v-card-text>
              <div class="mb-3">
                <v-icon large>description</v-icon>
              </div>
              <v-btn small class="elevation-0 ma-0" to="/seeker/requests">
                My Requests
              </v-btn>
            </v-card-text>
          </v-card>
        </div>

        <template
          v-if="
            $store.getters.features.includes('chat') &&
              $store.getters.openRequests.length
          "
        >
          <h1 class="font-weight-medium mt-4">Open requests</h1>
          <Request
            v-for="request in $store.getters.openRequests"
            :key="request.id"
            class="mt-3"
            :request="request"
          />
        </template>

        <h1 class="font-weight-medium mt-4">Coaches</h1>
        <DashboardCoaches />

        <v-dialog
          :value="!hasSeenIntro && $store.state.project === 'Carrus'"
          persistent
          width="600"
        >
          <v-card>
            <v-card-text>
              <p class="text-xs-center">
                Hey, thanks for joining Carrus.io! Here’s a quick guide to
                getting started.
              </p>

              <p>
                <span class="primary--text">Step #1</span>
                : Post a Request. Tell us your rough budget and a detailed
                description of what you’d like help with. We’ll send your
                request to relevant coaches who will be in touch directly.
              </p>
              <p>
                <span class="primary--text">Step #2:</span>
                Talk with Coaches. Coaches will message you to chat and schedule
                an introductory (free) call to get to know each other.
              </p>
              <p>
                <span class="primary--text">Step #3:</span>
                Hire a coach. Once you’ve decided on a coach, select one of
                their coaching packages (located on their profile), pay with
                your credit card, and get started!
              </p>

              <v-divider class="my-4" />

              <p>
                If you have any questions feel free to reach out to me anytime
                at
                <a href="mailto:misha@carrus.io" @click.native="seenIntro">
                  misha@carrus.io
                </a>
                . You can also check out
                <router-link to="/seeker/faq" @click.native="seenIntro">
                  our FAQ
                </router-link>
                .
              </p>

              <p>Best,</p>
              <div>Misha Yurchenko,</div>
              <div>Founder</div>
              <div>
                <a href="https://carrus.io/" @click.native="seenIntro">
                  https://carrus.io/
                </a>
              </div>

              <v-btn
                class="d-block mx-auto primary elevation-0"
                @click="seenIntro"
              >
                Continue
              </v-btn>
            </v-card-text>
          </v-card>
        </v-dialog>
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
import { db } from '@/firebase'

import Request from '@/components/common/Request'
import NewRequestForm from '@/components/seeker/NewRequestForm'
import DashboardCoaches from '@/components/seeker/DashboardCoaches'

export default {
  components: {
    Request,
    NewRequestForm,
    DashboardCoaches,
  },

  data() {
    return {
      introModal: false,
    }
  },

  computed: {
    user() {
      return this.$store.state.auth.user
    },
    hasSeenIntro() {
      return this.user.hasSeenIntro
    },
  },

  methods: {
    seenIntro() {
      db.collection('users')
        .doc(this.user.uid)
        .update({
          hasSeenIntro: true,
        })
    },
  },
}
</script>

<style>
.ais-Hits-list {
  padding: 0;
  list-style-type: none;
}
</style>
