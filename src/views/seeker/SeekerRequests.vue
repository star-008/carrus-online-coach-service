<template>
  <v-container>
    <h2>My requests</h2>

    <v-dialog class="mt-2" width="600px">
      <v-btn slot="activator" color="primary" depressed class="ma-0">
        New Request
      </v-btn>
      <NewRequestForm />
    </v-dialog>
    <p class="caption mt-1">
      Your last name will remain hidden when posting a request or chatting to a
      coach.
    </p>

    <Request
      v-for="request in this.$store.state.request.requests"
      :key="request.id"
      class="my-4"
      :request="request"
    />
  </v-container>
</template>

<script>
import NewRequestForm from '@/components/seeker/NewRequestForm'
import Request from '@/components/common/Request'

export default {
  components: {
    NewRequestForm,
    Request,
  },
}
</script>
