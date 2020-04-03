<template>
  <v-card width="650px" class="elevation-0 border">
    <v-card-text class="pa-5">
      <h2 class="headline mb-0">
        <span v-if="role === 'coach'">
          Thank you for your application. Now please create an account.
        </span>
        <span v-else>Create an account</span>
      </h2>
      <div class="body-1 grey--text">
        Please insert your email address and create a password below
      </div>
      <v-form
        v-model="valid"
        class="mt-4"
        lazy-validation
        @submit.prevent="register"
      >
        <v-switch
          v-if="role === 'seeker'"
          v-model="businessAccount"
          color="primary"
          label="This is a business account"
        ></v-switch>
        <v-layout>
          <v-text-field
            v-model="firstName"
            :rules="nameRules"
            label="First Name"
          ></v-text-field>
          <v-text-field
            v-model="lastName"
            :rules="nameRules"
            label="Last Name"
          ></v-text-field>
        </v-layout>
        <v-text-field
          v-if="this.businessAccount"
          v-model="companyName"
          label="Company Name"
          :rules="nameRules"
        ></v-text-field>
        <v-text-field
          v-model="email"
          :rules="emailRules"
          name="e-mail"
          label="E-mail"
        ></v-text-field>
        <v-text-field
          v-model="password"
          :rules="passwordRules"
          label="Password"
          name="password"
          type="password"
        ></v-text-field>

        <v-btn
          color="primary"
          class="mx-0 my-4 elevation-0"
          type="submit"
          :loading="loading"
          :disabled="!valid"
        >
          Next
          <v-icon right>chevron_right</v-icon>
        </v-btn>

        <div v-if="role === 'seeker'">
          Want to sign up as a coach?
          <router-link to="/register-coach">Apply here</router-link>
        </div>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
import Auth from '@/firebase/auth'

export default {
  name: 'Register',

  props: {
    role: {
      type: String,
      default: 'seeker',
    },
  },

  data() {
    return {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      valid: false,
      loading: false,
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+/.test(v) || 'E-mail must be valid',
      ],
      passwordRules: [
        v => !!v || 'Password is required',
        v => v.length >= 6 || 'Password must be 6 characters or more',
      ],
      nameRules: [v => !!v || 'Full Name is required'],
      businessAccount: false,
      companyName: '',
    }
  },

  methods: {
    register() {
      this.loading = true

      const data = {
        email: this.email,
        password: this.password,
        firstName: this.firstName,
        lastName: this.lastName,
        role: this.role,
        type: 'individual',
      }

      if (this.businessAccount) {
        data.companyName = this.companyName
        data.type = 'business'
      }

      Auth.register(data).then(() => (this.loading = false))
    },
  },
}
</script>
