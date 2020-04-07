<template>
  <v-container>
    <h2 class="mb-3">Orders</h2>
    <Order
      v-for="order in this.$store.state.orders"
      :key="order.id"
      :order="order"
    />
  </v-container>
</template>

<script>
import Order from '@/components/common/Order'

export default {
  components: {
    Order,
  },
}
</script>
