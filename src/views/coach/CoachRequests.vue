<template>
  <v-container>
    <h2>Requests</h2>

    <CoachRequestsFilter />
  </v-container>
</template>

<script>
import CoachRequestsFilter from '@/components/coach/CoachRequestsFilter'

export default {
  components: {
    CoachRequestsFilter,
  },
}
</script>
