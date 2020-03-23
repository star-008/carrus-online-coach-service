<template>
  <v-container>
    <v-layout justify-center>
      <v-card width="350px" class="elevation-0 border">
        <v-card-text>
          <div class="text-xs-center py-4">
            <router-link to="/">
              <img width="140" :src="logoSrc" />
            </router-link>
          </div>
          <div class="subheading text-xs-center font-weight-medium mt-1 mb-2">
            Login to {{ $store.state.project }}
          </div>
          <v-form
            ref="form"
            v-model="valid"
            lazy-validation
            @submit.prevent="logIn"
          >
            <v-text-field
              v-model="email"
              :rules="emailRules"
              name="e-mail"
              label="E-mail"
              required
            ></v-text-field>
            <v-text-field
              v-model="password"
              :rules="passwordRules"
              label="Password"
              name="password"
              type="password"
              required
            ></v-text-field>
            <v-btn
              block
              color="primary"
              class="d-block ma-0 elevation-0"
              type="submit"
              :loading="loading"
              :disabled="!valid"
            >
              Log in
            </v-btn>
            <router-link class="d-block mt-3" to="/forgot-password">
              Forgot Password?
            </router-link>
            <router-link class="d-block" to="/register">Register</router-link>
          </v-form>
        </v-card-text>
      </v-card>
    </v-layout>
  </v-container>
</template>

<script>
import Auth from '@/firebase/auth'

export default {
  name: 'Login',
  data() {
    return {
      logoSrc: require(`@/assets/images/logos/${process.env.VUE_APP_PROJECT}.png`),
      loading: false,
      valid: false,
      email: '',
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+/.test(v) || 'E-mail must be valid',
      ],
      password: '',
      passwordRules: [v => !!v || 'Password is required'],
    }
  },
  methods: {
    logIn: function() {
      this.loading = true
      Auth.logIn(this.email, this.password).then(() => (this.loading = false))
    },
  },
}
</script>
