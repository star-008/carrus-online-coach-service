<template>
  <v-container>
    <v-layout justify-center>
      <RegisterForm />
    </v-layout>
  </v-container>
</template>

<script>
import RegisterForm from '@/components/common/RegisterForm'

export default {
  components: {
    RegisterForm,
  },
}
</script>
