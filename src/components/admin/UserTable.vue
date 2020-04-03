<template>
  <div>
    <v-layout justify-space-between align-center>
      <div class="my-2">{{ items.length }} users</div>
      <v-flex xs12 sm4>
        <v-select
          v-model="filteredBy"
          label="Filter"
          :items="filters"
          clearable
        ></v-select>
      </v-flex>
    </v-layout>
    <v-data-table
      :items="filteredItems"
      class="elevation-0"
      hide-actions
      hide-headers
    >
      <template v-slot:items="props">
        <td>
          {{ props.item.firstName }} {{ props.item.lastName }}
          <template v-if="props.item.type === 'business'">
            - {{ props.item.companyName }}
          </template>
        </td>
        <td>{{ props.item.type }}</td>
        <td>{{ props.item.role }}</td>
        <td>
          <a :href="`mailto:${props.item.email}`">{{ props.item.email }}</a>
        </td>
        <td>{{ props.item.createdAt.toDate().toLocaleString() }}</td>
        <td>
          <v-btn
            v-if="props.item.role === 'coach'"
            icon
            small
            @click="certifyCoach(props.item)"
          >
            <img
              width="16"
              src="@/assets/images/certified.png"
              :class="{ 'filter--grayscale': !props.item.certified }"
            />
          </v-btn>
        </td>
        <td>
          <v-btn
            v-if="props.item.role === 'coach'"
            icon
            small
            @click="verifyCoach(props.item)"
          >
            <v-icon
              small
              class="grey--text"
              :class="{ 'primary--text': props.item.accountVerified }"
            >
              verified_user
            </v-icon>
          </v-btn>
        </td>
        <td>
          <v-btn
            v-if="
              props.item.role === 'coach' && $store.state.project === 'Carrus'
            "
            icon
            small
            @click="vipCoach(props.item)"
          >
            <v-icon
              small
              class="grey--text"
              :class="{ 'primary--text': props.item.vip }"
            >
              star
            </v-icon>
          </v-btn>
        </td>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { db } from '@/firebase'

export default {
  props: ['items'],

  data() {
    return {
      filteredBy: null,
      filters: ['unverified', 'online'],
    }
  },

  computed: {
    filteredItems() {
      let items = this.items
      items =
        this.filteredBy === 'unverified'
          ? items.filter(item => !item.accountVerified)
          : items
      items =
        this.filteredBy === 'online' ? items.filter(item => item.online) : items
      return items
    },
  },

  methods: {
    verifyCoach(coach) {
      if (coach.accountVerified) return
      if (confirm('Mark coach as verified?')) {
        db.collection('users')
          .doc(coach.id)
          .update({
            accountVerified: true,
          })
      }
    },
    certifyCoach(coach) {
      if (coach.certified) return
      if (confirm('Mark coach as certified?')) {
        db.collection('users')
          .doc(coach.id)
          .update({
            certified: true,
          })
      }
    },
    vipCoach(coach) {
      if (coach.vip) return
      if (confirm('Mark coach as VIP?')) {
        db.collection('users')
          .doc(coach.id)
          .update({
            vip: true,
          })
      }
    },
  },
}
</script>

<style></style>
