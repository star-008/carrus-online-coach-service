<template>
  <div class="avatar">
    <div ref="avatarMask" class="avatar-mask secondary">
      <img v-if="src" :src="src" :alt="name" />
      <span v-else class="primary">{{ initials }}</span>
    </div>
    <img
      v-if="certified"
      class="avatar__certified"
      src="@/assets/images/certified.png"
      alt="Coach is certified badge"
    />
  </div>
</template>

<script>
export default {
  props: ['src', 'name', 'certified'],

  computed: {
    initials() {
      return this.name
        .split(' ')
        .map(w => w[0])
        .join('')
    },
  },

  mounted() {
    const el = this.$refs.avatarMask

    const containerWidth = el.offsetWidth
    const numCharacters = this.initials.length

    el.style.fontSize = (containerWidth / numCharacters) * 0.9 + 'px'
  },
}
</script>

<style lang="scss">
.avatar {
  position: relative;
  width: 100%;
}
.avatar-mask {
  width: 100%;
  padding-bottom: 100%;
  border-radius: 50%;
  overflow: hidden;
  position: relative;
  img,
  span {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
  }
  span {
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
  }
}
.avatar__certified {
  display: block;
  position: absolute;
  width: 30%;
  top: 15%;
  right: 15%;
  transform: translate(50%, -50%);
}
</style>
