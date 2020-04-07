<template>
  <CoachProfile :coach-id="user.uid" :can-edit="true" />
</template>

<script>
import CoachProfile from '@/components/common/CoachProfile'

export default {
  components: {
    CoachProfile,
  },

  computed: {
    user() {
      return this.$store.state.auth.user
    },
  },
}
</script>
