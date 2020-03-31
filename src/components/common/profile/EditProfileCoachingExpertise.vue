<template>
  <v-dialog v-model="dialog" width="600">
    <v-icon slot="activator">edit</v-icon>

    <v-card>
      <v-card-title class="headline" primary-title>
        Edit coaching expertise
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text>
        <v-form ref="form" @submit.prevent="save">
          <v-select
            v-model="userProfile.coachingExpertise"
            label="Coaching Expertise"
            multiple
            chips
            :items="availablecoachingExpertise"
            :rules="rules.coachingExpertise"
          ></v-select>
          <v-btn
            type="submit"
            depressed
            color="primary"
            class="ma-0"
            :loading="loading"
          >
            Save
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { db } from '@/firebase'
import coachingExpertise from '@/assets/js/coachingExpertise.json'

export default {
  props: ['userProfileProp'],

  data() {
    return {
      dialog: false,
      userProfile: null,
      loading: false,
      availablecoachingExpertise: coachingExpertise,
      rules: {
        coachingExpertise: [v => !!v.length || 'Coaching expertise required'],
      },
    }
  },

  created() {
    this.userProfile = Object.assign({}, this.userProfile, this.userProfileProp)
  },

  methods: {
    save() {
      if (this.$refs.form.validate()) {
        this.loading = true

        db.collection('userProfiles')
          .doc(this.userProfileProp.id)
          .update({
            coachingExpertise: this.userProfile.coachingExpertise,
          })
          .catch(e => alert(e.message))
          .then(() => {
            this.loading = false
            this.dialog = false
          })
      }
    },
  },
}
</script>
