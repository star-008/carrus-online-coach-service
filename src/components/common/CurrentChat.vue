<template>
  <v-form v-if="currentChat.id" @submit.prevent="newMessage">
    <v-layout class="chatbox-form-layout" column justify-end>
      <div ref="messageContainer" class="chatbox-message-container">
        <v-layout
          v-for="chatMessage in messages.slice().reverse()"
          :key="chatMessage.id"
          class="message-row"
          :class="{ 'justify-end': chatMessage.from === user.uid }"
        >
          <div
            class="chat-message"
            :class="{
              primary: chatMessage.from === user.uid,
              'white--text': chatMessage.from === user.uid,
            }"
            v-html="chatMessage.html"
          ></div>
        </v-layout>
      </div>
      <div class="chatbox-textarea">
        <textarea
          ref="chatTextarea"
          v-model="message"
          @keydown.enter.exact.prevent="newMessage"
        ></textarea>
      </div>
      <v-layout shrink class="chatbox-toolbar">
        <v-spacer></v-spacer>
        <v-btn small color="primary" class="elevation-0 ma-0" type="submit">
          Send
        </v-btn>
      </v-layout>
    </v-layout>
  </v-form>
  <v-layout v-else class="chatbox-form-layout" justify-center>
    <v-btn icon :loading="true" :disabled="true"></v-btn>
  </v-layout>
</template>

<script>
import autosize from 'autosize'

export default {
  props: ['currentChat'],

  data() {
    return {
      message: '',
    }
  },

  computed: {
    user() {
      return this.$store.state.auth.user
    },

    messages() {
      return this.currentChat.messages.map(message => {
        return {
          ...message,
          html: this.linkify(message.content),
        }
      })
    },
  },

  watch: {
    messages: function() {
      this.$nextTick(() => {
        this.scrollToBottom()
      })
    },
  },

  mounted() {
    this.currentChat.markAsSeen()
    this.scrollToBottom()
    autosize(this.$refs.chatTextarea)
  },

  methods: {
    linkify(text) {
      const urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gi
      text = text.replace(urlRegex, url => {
        return '<a href="' + url + '" target="_blank">' + url + '</a>'
      })
      return `<p>${text}</p>`
    },
    scrollToBottom() {
      const messageContainer = this.$refs.messageContainer
      messageContainer.scrollTop = messageContainer.scrollHeight
    },
    newMessage() {
      const message = this.message
      if (message === '') return
      this.currentChat.newMessage(message, this.user.uid)
      this.message = ''

      this.$nextTick(() => {
        autosize.update(this.$refs.chatTextarea)
      })
    },
  },
}
</script>

<style lang="scss">
.chatbox-message-container {
  overflow: scroll;
}
.message-row {
  padding: 0.2rem 0.75rem;
}
.chatbox-textarea {
  margin: 0.2rem 0.75rem;
  textarea {
    background: #f5f5f5;
    padding: 0.2em 0.6em;
    border-radius: 0.9em;
    width: 100%;
    display: block;
    resize: none;
    min-height: 2.2em;
    max-height: 15em;
    outline: none;
  }
}
.chatbox-toolbar {
  margin: 0.2rem 0.75rem;
}
.chat-message {
  border-radius: 0.9em;
  background: #f5f5f5;
  padding: 0.2em 0.6em;
  max-width: 200px;
  word-wrap: break-word;
  a {
    color: inherit;
  }
}
.chatbox-form-layout {
  height: 100%;
}
</style>
