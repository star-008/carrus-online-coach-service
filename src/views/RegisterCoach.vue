<template>
  <v-container>
    <v-layout justify-center>
      <RegisterForm v-if="typeformComplete" role="coach" />
      <v-card v-else class="elevation-0" width="650">
        <div ref="typeformContainer" class="typeform-container"></div>
      </v-card>
    </v-layout>
  </v-container>
</template>

<script>
import * as typeformEmbed from '@typeform/embed'
import RegisterForm from '@/components/common/RegisterForm'

export default {
  components: {
    RegisterForm,
  },

  data() {
    return {
      typeformComplete: this.$store.state.project !== 'Carrus',
    }
  },

  mounted() {
    const url = new URL(window.location.href)
    const skipApplication = url.searchParams.get('skip_application')

    if (skipApplication) {
      this.typeformComplete = true
    } else {
      typeformEmbed.makeWidget(
        this.$refs.typeformContainer,
        'https://carrus.typeform.com/to/ShF1Ul',
        {
          hideHeaders: true,
          hideFooters: true,
          opacity: 0,
          onSubmit: () => {
            this.typeformComplete = true
          },
        }
      )
    }
  },
}
</script>

<style>
.typeform-container {
  height: 600px;
}
</style>
