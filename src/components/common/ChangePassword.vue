<template>
  <v-card class="elevation-0">
    <v-card-text>
      <v-form v-if="!complete" ref="form">
        <v-text-field
          v-model="oldPassword"
          :rules="passwordRules"
          label="Old Password"
          type="password"
        ></v-text-field>
        <v-text-field
          v-model="newPassword"
          :rules="passwordRules"
          label="New Password"
          type="password"
        ></v-text-field>
        <v-text-field
          :rules="passwordConfirmRule"
          label="Confirm Password"
          type="password"
        ></v-text-field>

        <v-btn
          color="primary"
          :loading="loading"
          class="mt-4 ma-0 elevation-0"
          @click="submit"
        >
          Submit
        </v-btn>
      </v-form>
      <div v-else>Your password has been changed</div>
    </v-card-text>
  </v-card>
</template>

<script>
import Auth from '@/firebase/auth'

export default {
  name: 'ChangePassword',
  data() {
    return {
      oldPassword: '',
      newPassword: '',
      passwordRules: [
        v => !!v || 'Password is required',
        v => v.length >= 6 || 'Password must be 6 or more characters',
      ],
      passwordConfirmRule: [
        v => v === this.newPassword || 'Passwords must match',
      ],
      complete: false,
      loading: false,
    }
  },
  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        this.loading = true
        Auth.changePassword(this.oldPassword, this.newPassword)
          .then(() => {
            this.complete = true
          })
          .catch(e => {
            alert(e.message)
          })
          .then(() => {
            this.loading = false
          })
      }
    },
  },
}
</script>
