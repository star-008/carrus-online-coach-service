<template>
  <CoachProfile :coach-id="$route.params.coachId" :can-edit="false" />
</template>

<script>
import CoachProfile from '@/components/common/CoachProfile'

export default {
  components: {
    CoachProfile,
  },
}
</script>
