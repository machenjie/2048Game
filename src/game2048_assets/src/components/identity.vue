<template>
  <div class="identity">
    <div v-if="userName" class="user" :title="userName">
      {{ userName }}
    </div>
    <div v-else class="dfinity">
      <img src="/img/dfinity.png" v-on:click="doIdentity">
    </div>
    <a-modal
        v-if="identity&&!userName"
        :visible="userNameModalVisible"
        title="input you name"
        centered
        @ok="userNameOkClick"
        @cancel="userNameCancelClick"
    >
      <a-input v-model="inputUserName"/>
    </a-modal>
  </div>
</template>

<script>
import {AuthClient} from "@dfinity/auth-client";

export default {
  name: "identity",
  data: function () {
    return {
      inIdentity: false,
      inputUserName: "",
      userNameModalVisible: false
    }
  },
  computed: {
    userName: function () {
      return this.$store.state.user.userName
    },
    identity: function () {
      return this.$store.state.user.principal
    },
  },
  methods: {
    userNameOkClick: function () {
      this.$store.commit("setUserName", this.inputUserName);
      this.$store.commit("setLastLoginAt", Date.now());
      this.userNameModalVisible = false
    },
    userNameCancelClick: function () {
      this.userNameModalVisible = false
    },
    doIdentity: function () {
      if (!this.inIdentity) {
        this.inIdentity = true
        AuthClient.create().then((authClient) => {
          let isDone = false
          let doneTimer
          authClient.login({
            onSuccess: async () => {
              let identity = await authClient.getIdentity();
              this.$store.commit("setPrincipal", identity.getPrincipal().toString());
              this.inIdentity = false
              this.userNameModalVisible = true
              isDone = true
              if (doneTimer) {
                clearTimeout(doneTimer)
              }
            },
            onError: () => {
              this.inIdentity = false
              isDone = true
              if (doneTimer) {
                clearTimeout(doneTimer)
              }
            }
          });
          if (!isDone) {
            doneTimer = setTimeout(() => {
              isDone = true
              doneTimer = null
              this.inIdentity = false
            }, 30 * 1000)
          }
        }).catch(() => {
          this.inIdentity = false
        })
      }
    },
  }
}
</script>

<style scoped>
.identity {
  display: block;
}

.user {
  max-width: 100%;
  max-height: 100%;
  display: block;
  margin: auto;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dfinity img {
  max-width: 100%;
  max-height: 100%;
  display: block;
  margin: auto;
}
</style>