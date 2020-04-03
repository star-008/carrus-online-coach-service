<template>
  <v-card>
    <v-card-text>
      <p class="text-xs-center font-weight-bold">
        Thanks for
        <span v-if="freeConsultation">choosing a free consultation</span>
        <span v-else>purchasing {{ coachPackage.title }}</span>
        ! We’ve emailed you a receipt, and you can also view your
        <span v-if="freeConsultation">order</span>
        <span v-else>purchase history</span>
        on your
        <router-link to="/seeker/orders">orders</router-link>
        &nbsp;page.
      </p>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-text>
      <div class="text-xs-center font-weight-bold">Next steps:</div>
      <ol class="next-steps">
        <li class="next-steps-step">
          <div class="next-steps-step__image">
            <img width="50" src="@/assets/images/next-steps/calendar.png" />
          </div>
          <div class="next-steps-step__text">
            <strong>Step 1:</strong>
            Message your coach directly to schedule a time for a call or video
            chat that’s convenient for both of you. We recommend Skype or Zoom
            for video calls.
          </div>
        </li>
        <li class="next-steps-step">
          <div class="next-steps-step__image">
            <img width="50" src="@/assets/images/next-steps/questionman.png" />
          </div>
          <div class="next-steps-step__text">
            <strong>Step 2:</strong>
            Be ready to tell your story. What information do you want your coach
            to know about you? Your coach will help you work through your goals,
            but it’s helpful to begin mulling them over yourself in preparation.
          </div>
        </li>
        <li class="next-steps-step">
          <div class="next-steps-step__image">
            <img width="50" src="@/assets/images/next-steps/story.png" />
          </div>
          <div class="next-steps-step__text">
            <strong>Step 3:</strong>
            Prepare a few questions. The best way to make sure you get what you
            want out of a coaching session is to know what questions you want
            answered. It doesn’t matter if your questions are big or small, it
            just matters that you have them.
          </div>
        </li>
      </ol>
      <div
        v-if="$store.getters.features.includes('chat')"
        class="text-xs-center"
      >
        <v-btn class="ma-0 elevation-0 primary" @click="messageCoach">
          Message Coach
        </v-btn>
      </div>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-text>
      <p>
        Lastly, feel free to check out our
        <a href="https://carrus.io/general-faq/">FAQ</a>
        . If you have any questions or feedback for us along the way, you can
        reach out to us anytime at
        <a :href="`mailto:${$store.state.supportEmail}`">
          {{ $store.state.supportEmail }}
        </a>
        .
      </p>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: ['coachPackage', 'coachId', 'freeConsultation'],

  methods: {
    messageCoach() {
      this.nextStepsDialog = false
      this.$store.dispatch('messageUser', this.coachId)
    },
  },
}
</script>

<style></style>
