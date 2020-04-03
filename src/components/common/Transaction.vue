<template>
  <v-layout class="my-2" justify-space-between align-center>
    <div>{{ transaction.createdAt.toDate().toLocaleString() }}</div>
    <div v-if="transaction.charge">
      Paid: {{ transaction.charge.amount | money }}
    </div>

    <Stars
      v-if="transaction.rating"
      class="d-block"
      :rating="transaction.rating"
    />
    <v-dialog v-else v-model="reviewDialog" width="400px" class="d-block">
      <v-btn
        v-if="user.role === 'seeker'"
        slot="activator"
        block
        small
        color="primary"
        class="ma-0 elevation-0"
      >
        Leave Review
      </v-btn>
      <v-card>
        <v-card-title class="headline">Leave review</v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-form @submit.prevent="submitRating">
            <div>
              Choose Rating:
              <Stars :rating="rating" @selectedRating="rating = $event" />
              <div class="error--text caption">
                {{ ratingErrors.join(', ') }}
              </div>
            </div>
            <v-textarea
              v-model="review"
              label="Leave public review"
              :error-messages="reviewErrors"
              @change="$v.review.$touch()"
              @blur="$v.review.$touch()"
            ></v-textarea>
            <v-btn
              color="primary"
              class="ma-0 elevation-0"
              :loading="savingReview"
              type="submit"
            >
              Submit
            </v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
import Stars from '@/components/common/Stars'

export default {
  components: {
    Stars,
  },

  props: ['transaction'],

  data() {
    return {
      reviewDialog: false,
      rating: null,
      review: '',
      savingReview: false,
    }
  },

  validations: {
    review: { required },
    rating: { required },
  },

  computed: {
    ratingErrors() {
      const errors = []
      const property = this.$v.rating
      if (!property.$dirty) return errors
      !property.required && errors.push('Rating is required')
      return errors
    },
    reviewErrors() {
      const errors = []
      const property = this.$v.review
      if (!property.$dirty) return errors
      !property.required && errors.push('Review is required')
      return errors
    },
    user() {
      return this.$store.state.auth.user
    },
  },

  methods: {
    submitRating() {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        this.savingReview = true

        this.transaction.ref
          .update({
            rating: this.rating,
            review: this.review,
          })
          .catch(e => {
            this.savingReview = false
            alert(e.message)
          })
      }
    },
  },
}
</script>
