<template>
  <v-container>
    <Request
      v-for="request in requests"
      :key="request.id"
      :request="request"
      class="mb-2"
    />
  </v-container>
</template>

<script>
import { db } from '@/firebase'
import Request from '@/components/common/Request'

export default {
  components: {
    Request,
  },

  data() {
    return {
      requests: [],
    }
  },

  created() {
    this.loadRequests()
  },

  methods: {
    loadRequests() {
      db.collection('requests')
        .orderBy('createdAt', 'desc')
        .limit(25)
        .get()
        .then(snapshot => {
          this.requests = snapshot.docs.map(doc => {
            return {
              id: doc.id,
              ...doc.data(),
            }
          })
        })
    },
  },
}
</script>
