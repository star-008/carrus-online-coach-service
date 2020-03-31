<template>
  <v-dialog v-model="dialog" width="300">
    <v-icon slot="activator" class="ml-2" small>edit</v-icon>

    <v-card>
      <v-card-title class="headline" primary-title>Name</v-card-title>

      <v-divider></v-divider>

      <v-card-text>
        <v-form ref="form" @submit.prevent="save">
          <v-text-field
            v-model="userProfile.firstName"
            label="First Name"
            :rules="rules.firstName"
          ></v-text-field>
          <v-text-field
            v-model="userProfile.lastName"
            label="Last Name"
            :rules="rules.lastName"
          ></v-text-field>
          <v-text-field
            v-model="userProfile.tagline"
            label="Tagline"
            :rules="rules.tagline"
          ></v-text-field>
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

export default {
  props: ['userProfileProp'],

  data() {
    return {
      dialog: false,
      userProfile: null,
      loading: false,
      rules: {
        firstName: [v => !!v || 'First name is required'],
        lastName: [v => !!v || 'Last name is required'],
        tagline: [v => !!v || 'Tagline is required'],
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
        const userPromise = db
          .collection('users')
          .doc(this.userProfileProp.id)
          .update({
            firstName: this.userProfile.firstName,
            lastName: this.userProfile.lastName,
          })
        const userProfilePromise = db
          .collection('userProfiles')
          .doc(this.userProfileProp.id)
          .update({
            tagline: this.userProfile.tagline,
          })

        Promise.all([userPromise, userProfilePromise])
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

<style></style>
