<template>
  <v-container>
    <v-layout justify-center>
      <v-card width="350px" class="elevation-0 border">
        <v-card-title class="text-xs-center">
          <h2>Forgot Your Password</h2>
        </v-card-title>
        <v-card-text>
          <v-form v-if="!complete" ref="form">
            <v-text-field
              v-model="email"
              :rules="emailRules"
              name="email"
              label="Email address"
              type="text"
              required
            ></v-text-field>
            <v-btn
              block
              color="primary"
              class="elevation-0"
              :loading="loading"
              @click="submit"
            >
              Submit
            </v-btn>
          </v-form>
          <div v-else>A password reset email has been sent to {{ email }}</div>
        </v-card-text>
      </v-card>
    </v-layout>
  </v-container>
</template>

<script>
import { auth } from '@/firebase'

export default {
  name: 'ForgotPassword',
  data() {
    return {
      complete: false,
      email: '',
      loading: false,
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+/.test(v) || 'E-mail must be valid',
      ],
    }
  },
  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        this.loading = true
        auth
          .sendPasswordResetEmail(this.email)
          .then(() => (this.complete = true))
          .catch(e => alert(e.message))
          .then(() => (this.loading = false))
      }
    },
  },
}
</script>
