<template>
  <v-card class="elevation-0">
    <v-card-text>
      <v-form ref="form" @submit.prevent="save">
        <v-layout>
          <v-text-field
            v-model="settings.firstName"
            label="First name"
            :rules="rules.firstName"
          ></v-text-field>
          <v-text-field
            v-model="settings.lastName"
            label="Last name"
            :rules="rules.lastName"
          ></v-text-field>
        </v-layout>
        <v-text-field
          v-model="settings.email"
          label="Email"
          :rules="rules.email"
          placeholder
        ></v-text-field>
        <v-select
          v-model="settings.timezone"
          :rules="rules.timezone"
          :items="formattedTimezones"
          label="Timezone"
          return-object
        ></v-select>

        <v-text-field
          v-if="settings.email != originalSettings.email"
          v-model="password"
          class="mt-4"
          type="password"
          label="Enter password to change email"
        ></v-text-field>

        <v-btn
          class="primary mt-4 ma-0 elevation-0"
          type="submit"
          :loading="loading"
          :disabled="isEqual"
        >
          Save
        </v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
import _ from 'lodash'
import timezones from '@/assets/js/timezones'
import { db } from '@/firebase'
import Auth from '@/firebase/auth'

export default {
  data() {
    return {
      settings: {},
      originalSettings: {},
      timezones: timezones,
      loading: false,
      password: '',
      rules: {
        firstName: [v => !!v || 'First name is required'],
        lastName: [v => !!v || 'Last name is required'],
        email: [v => !!v || 'Email is required'],
        timezone: [v => !!v || 'Timezone is required'],
      },
    }
  },

  computed: {
    isEqual() {
      return _.isEqual(this.settings, this.originalSettings)
    },
    formattedTimezones() {
      return this.timezones.map(timezone => {
        return {
          text: timezone.text,
          offset: timezone.offset,
        }
      })
    },
  },

  mounted() {
    this.setData()
  },

  methods: {
    save() {
      if (this.$refs.form.validate()) {
        this.loading = true
        if (this.settings.email != this.originalSettings.email) {
          Auth.changeEmail(this.settings.email, this.password)
            .then(() => {
              return this.saveData()
            })
            .catch(e => {
              alert(e.message)
              this.loading = false
            })
        } else {
          this.saveData()
        }
      }
    },
    saveData() {
      return db
        .collection('users')
        .doc(this.$store.state.auth.user.uid)
        .update(this.settings)
        .catch(e => alert(e.message))
        .then(() => {
          this.setData()
          this.loading = false
        })
    },
    setData() {
      const user = this.$store.state.auth.user
      const data = {
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        timezone: user.timezone || null,
        email: user.email || '',
      }

      this.settings = Object.assign({}, this.settings, data)
      this.originalSettings = Object.assign({}, this.originalSettings, data)
    },
  },
}
</script>

<style></style>
