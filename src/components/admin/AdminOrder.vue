<template>
  <v-card>
    <v-card-text>
      <v-layout>
        <v-flex sm12 md4>
          <div>Coach: {{ coach.firstName }} {{ coach.lastName }}</div>
          <div>Seeker: {{ seeker.firstName }} {{ seeker.lastName }}</div>
        </v-flex>
        <v-flex sm12 md4>
          <span v-if="transaction.charge">
            {{ transaction.charge.amount | money }}
          </span>
          <span v-else>Free consultation</span>
        </v-flex>
        <v-flex sm12 md4>
          Date: {{ transaction.createdAt.toDate().toLocaleDateString() }}
        </v-flex>
      </v-layout>
    </v-card-text>
  </v-card>
</template>

<script>
import { db } from '@/firebase'

export default {
  props: ['transaction'],

  data() {
    return {
      coach: null,
      seeker: null,
    }
  },

  created() {
    this.loadUser(this.transaction.coachId).then(user => {
      this.coach = user
    })

    this.loadUser(this.transaction.seekerId).then(user => {
      this.seeker = user
    })
  },

  methods: {
    async loadUser(uid) {
      const doc = await db.doc(`userProfiles/${uid}`).get()
      return doc.data()
    },
  },
}
</script>

<style></style>
