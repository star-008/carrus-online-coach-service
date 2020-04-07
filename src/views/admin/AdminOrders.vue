<template>
  <v-container>
    <h2>Orders</h2>

    <AdminOrder
      v-for="transaction in transactions"
      :key="transaction.id"
      :transaction="transaction"
      class="mb-2 elevation-0"
    />
  </v-container>
</template>

<script>
import { db } from '@/firebase'
import AdminOrder from '@/components/admin/AdminOrder'

export default {
  components: {
    AdminOrder,
  },

  data() {
    return {
      transactions: [],
      coach: null,
      seeker: null,
    }
  },

  created() {
    this.loadOrders()
  },

  methods: {
    async loadOrders() {
      const snap = await db
        .collectionGroup('transactions')
        .orderBy('createdAt', 'desc')
        .get()

      this.transactions = snap.docs.map(doc => {
        return {
          id: doc.id,
          ...doc.data(),
        }
      })
    },
  },
}
</script>
