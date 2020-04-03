<template>
  <v-card>
    <v-card-title>
      <div class="headline">New Request</div>
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <template v-if="!success">
        <v-form ref="form" @submit.prevent="postRequest">
          <v-select
            v-model="request.coachingExpertise"
            :items="coachingExpertise"
            label="What would you like help with?"
            multiple
            :rules="rules.coachingExpertise"
            persistent-hint
            hint="Learn more about coaching categories <a href='https://carrus.io/coaching-categories/' target='_blank' />here</a>."
          ></v-select>
          <v-text-field
            v-model="request.title"
            label="One sentence summary of your request"
            :rules="rules.title"
          ></v-text-field>
          <v-textarea
            v-model="request.description"
            label="Write in more detail about what you need"
            :rules="rules.description"
          ></v-textarea>
          <v-select
            v-model="request.industry"
            :items="industries"
            label="What's your industry?"
            :rules="rules.industry"
          ></v-select>
          <v-text-field
            v-model="request.budget"
            label="What's your budget?"
            type="number"
            hint="$ / hour"
            persistent-hint
            :rules="rules.budget"
          ></v-text-field>
          <v-btn
            color="primary"
            depressed
            class="mt-2 ma-0"
            :loading="loading"
            type="submit"
          >
            <span v-if="existingRequest">Save</span>
            <span v-else>Post request</span>
          </v-btn>
        </v-form>
      </template>
      <div v-else>Message posted succesfully!</div>
    </v-card-text>
    <div></div>
  </v-card>
</template>

<script>
import { db } from '@/firebase'
import industries from '@/assets/js/industries.json'
import coachingExpertise from '@/assets/js/coachingExpertise.json'

export default {
  props: ['existingRequest'],

  data() {
    return {
      request: {
        title: '',
        description: '',
        industry: '',
        coachingExpertise: [],
        budget: 0,
      },
      rules: {
        title: [v => !!v || 'Title is required'],
        description: [v => !!v || 'Title is required'],
        industry: [v => v.length >= 1 || 'Industry is required'],
        coachingExpertise: [
          v => v.length >= 1 || 'Coaching Expertise is required',
        ],
        budget: [v => v >= 1 || 'Budget must be $1 or more'],
      },
      industries: industries,
      coachingExpertise: coachingExpertise,
      success: false,
      loading: false,
    }
  },

  created() {
    if (this.existingRequest)
      this.request = Object.assign({}, this.request, this.existingRequest)
  },

  methods: {
    postRequest() {
      if (this.$refs.form.validate()) {
        this.loading = true

        if (this.existingRequest) {
          db.collection('requests')
            .doc(this.request.id)
            .update({
              title: this.request.title,
              description: this.request.description,
              industry: this.request.industry,
              coachingExpertise: this.request.coachingExpertise,
              budget: this.request.budget,
            })
            .then(() => {
              this.$emit('success')
              this.success = true
            })
            .catch(e => alert(e.message))
            .then(() => {
              this.loading = false
            })
        } else {
          const data = {
            ...this.request,
            createdAt: new Date(),
            acceptedAt: null,
            seekerId: this.$store.state.auth.user.uid,
          }

          data.budget = Number(data.budget)

          db.collection('requests')
            .add(data)
            .then(() => {
              this.$emit('success')
              this.success = true
            })
            .catch(e => alert(e.message))
            .then(() => {
              this.loading = false
            })
        }
      }
    },
  },
}
</script>

<style></style>
