<template>
  <span class="stars">
    <v-icon
      v-for="i in 5"
      :key="i"
      class="stars__star"
      :class="{ clickable: $listeners.selectedRating }"
      small
      @click="$emit('selectedRating', i)"
    >
      <template v-if="safeRating - i >= 0">
        star
      </template>
      <template v-else-if="safeRating - i === -0.5">
        star_half
      </template>
      <template v-else>
        star_border
      </template>
    </v-icon>
  </span>
</template>

<script>
export default {
  props: ['rating'],

  computed: {
    safeRating() {
      return Math.round(this.rating * 2) / 2
    },
  },
}
</script>

<style lang="scss">
.v-icon.v-icon--link.stars__star {
  cursor: default;

  &.clickable {
    cursor: pointer;
  }
}
</style>
