<template>
  <div class="chat">
    <v-badge color="red" overlap class="d-block">
      <template
        v-if="!showChat && $store.getters.unseenNotifications.length"
        v-slot:badge
      >
        {{ $store.getters.unseenNotifications.length }}
      </template>
      <v-layout
        class="chat-tab secondary white--text px-2"
        justify-space-between
        align-center
        @click="$store.commit('setShowChat', !showChat)"
      >
        <span v-if="currentChat && showChat">
          <v-btn
            small
            dark
            icon
            class="ma-0"
            @click.stop="setCurrentChat(null)"
          >
            <v-icon>chevron_left</v-icon>
          </v-btn>
          Chat with
          <router-link
            v-if="user.role === 'seeker'"
            :to="`/coach-profile/${currentChat.otherParticipant.id}`"
          >
            {{ currentChat.otherParticipant.firstName }}
            {{ currentChat.otherParticipant.lastName }}
          </router-link>
          <span v-else>
            {{ currentChat.otherParticipant.firstName }}
            {{ currentChat.otherParticipant.lastName }}
          </span>
        </span>
        <span v-else>Chat</span>
      </v-layout>
    </v-badge>
    <div v-if="showChat">
      <CurrentChat
        v-if="currentChat"
        class="chatbox"
        :current-chat="currentChat"
      />
      <template v-else>
        <v-list v-if="chats.length" class="chatbox" two-line>
          <v-list-tile
            v-for="chat in chats"
            :key="chat.id"
            @click="setCurrentChat(chat)"
          >
            <v-list-tile-action>
              <Avatar
                class="mr-3"
                :src="
                  chat.otherParticipant.profileImage &&
                    chat.otherParticipant.profileImage.thumb_88x88
                "
                :name="
                  `${chat.otherParticipant.firstName} ${chat.otherParticipant.lastName}`
                "
                :certified="chat.otherParticipant.certified"
              />
            </v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title>
                {{ chat.otherParticipant.firstName }}
                {{ chat.otherParticipant.lastName }}
              </v-list-tile-title>
              <v-list-tile-sub-title>
                <span v-if="chat.lastMessage.from === user.uid">You:</span>
                {{ chat.lastMessage.content }}
              </v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action v-if="chat.notifications.length">
              <div class="v-badge__badge v-badge__badge--inline red">
                {{ chat.notifications.length }}
              </div>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
        <div v-else class="text-xs-center chatbox">
          <div class="py-3">You have no existing chats.</div>
          <v-btn
            v-if="user.role === 'seeker'"
            small
            class="elevation-0 primary"
            to="/seeker/coach-list"
            @click.native="$store.commit('setShowChat', false)"
          >
            Find a Coach
          </v-btn>
          <v-btn
            v-if="user.role === 'coach'"
            small
            class="elevation-0 primary"
            to="/coach/requests"
            @click.native="$store.commit('setShowChat', false)"
          >
            Find a new client
          </v-btn>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import CurrentChat from '@/components/common/CurrentChat'
import Avatar from '@/components/common/Avatar'
export default {
  components: {
    CurrentChat,
    Avatar,
  },

  computed: {
    user() {
      return this.$store.state.auth.user
    },
    chats() {
      return this.$store.getters.chatsWithNotifications
    },
    currentChat() {
      return this.$store.state.chat.currentChat
    },
    showChat() {
      return this.$store.state.chat.showChat
    },
  },

  methods: {
    setCurrentChat(chat) {
      this.$store.commit('setCurrentChat', chat)
    },
  },
}
</script>

<style>
.chat {
  position: fixed;
  bottom: 0;
  right: 6%;
  min-width: 280px;
  max-width: 350px;
  width: 25%;
  z-index: 1;
}
.chat-tab {
  cursor: pointer;
  height: 2.5em;
  border-radius: 3px 3px 0 0;
}
.chatbox {
  height: 350px;
  background: white;
  border-left: 1px solid #444;
  border-right: 1px solid #444;
}
</style>
