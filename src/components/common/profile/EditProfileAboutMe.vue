<template>
  <v-dialog v-model="dialog" width="600">
    <v-icon slot="activator">edit</v-icon>

    <v-card>
      <v-card-title class="headline" primary-title>About me</v-card-title>

      <v-divider></v-divider>

      <v-card-text>
        <v-form @submit.prevent="save">
          <RichTextEditor
            :value="userProfile.description"
            @onUpdate="updateDescription"
          />
          <div class="error--text mb-4">{{ descriptionErrors.join(', ') }}</div>
          <v-select
            v-model="userProfile.timezone"
            :error-messages="timezoneErrors"
            :items="formattedTimezones"
            label="Timezone"
            return-object
            @change="$v.userProfile.timezone.$touch()"
            @blur="$v.userProfile.timezone.$touch()"
          ></v-select>
          <v-select
            v-model="userProfile.languages"
            multiple
            chips
            :error-messages="languagesErrors"
            :items="availableLanguages"
            label="Languages"
            @change="$v.userProfile.languages.$touch()"
            @blur="$v.userProfile.languages.$touch()"
          ></v-select>
          <v-text-field
            v-model="userProfile.rate"
            :error-messages="rateErrors"
            label="Rate"
            persistent-hint
            hint="$ / hr"
            @change="$v.userProfile.rate.$touch()"
            @blur="$v.userProfile.rate.$touch()"
          ></v-text-field>
          <v-checkbox
            v-model="userProfile.freeConsultation"
            label="Free 1 hour coaching session"
            persistent-hint
            hint="(95% of coaches check this)"
          ></v-checkbox>
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
import RichTextEditor from '@/components/common/RichTextEditor'
import { required } from 'vuelidate/lib/validators'
import timezones from '@/assets/js/timezones'
import languages from '@/assets/js/languages.json'

export default {
  components: {
    RichTextEditor,
  },

  props: ['userProfileProp'],

  data() {
    return {
      userProfile: {
        timezone: null,
        description: '',
        languages: [],
        rate: null,
      },
      dialog: false,
      loading: false,
      timezones: timezones,
      availableLanguages: languages,
    }
  },

  validations: {
    userProfile: {
      timezone: { required },
      description: { required },
      languages: { required },
      rate: { required },
    },
  },

  computed: {
    formattedTimezones() {
      return this.timezones.map(timezone => {
        return {
          text: timezone.text,
          offset: timezone.offset,
        }
      })
    },
    timezoneErrors() {
      const errors = []
      const property = this.$v.userProfile.timezone
      if (!property.$dirty) return errors
      !property.required && errors.push('Timezone is required')
      return errors
    },
    descriptionErrors() {
      const errors = []
      const property = this.$v.userProfile.description
      if (!property.$dirty) return errors
      !property.required && errors.push('Description is required')
      return errors
    },
    languagesErrors() {
      const errors = []
      const property = this.$v.userProfile.languages
      if (!property.$dirty) return errors
      !property.required && errors.push('Language is required')
      return errors
    },
    rateErrors() {
      const errors = []
      const property = this.$v.userProfile.rate
      if (!property.$dirty) return errors
      !property.required && errors.push('Rate is required')
      return errors
    },
  },

  created() {
    this.userProfile = Object.assign({}, this.userProfile, this.userProfileProp)
  },

  methods: {
    updateDescription(event) {
      this.userProfile.description = event
      this.$v.userProfile.description.$touch()
    },
    save() {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        this.loading = true
        const userPromise = db
          .collection('users')
          .doc(this.userProfileProp.id)
          .update({
            timezone: this.userProfile.timezone,
          })
        const userProfilePromise = db
          .collection('userProfiles')
          .doc(this.userProfileProp.id)
          .update({
            description: this.userProfile.description,
            languages: this.userProfile.languages,
            freeConsultation: this.userProfile.freeConsultation,
            rate: Number(this.userProfile.rate),
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
