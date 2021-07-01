<template>
  <div>
    <div v-if="identity">
      {{ idText }}
    </div>
    <div v-else>
      <img src="/img/dfinity.png" v-on:click="doIdentity">
    </div>
  </div>
</template>

<script>
import {identity} from "../global";
import {AuthClient} from "@dfinity/auth-client";

export default {
  name: "identity",
  data: function () {
    return {
      identity: identity,
      inIdentity: false
    }
  },
  computed: {
    idText: function () {
      if (this.identity) {
        return this.identity.getPrincipal().toString()
      }
      return "unknown"
    }
  },
  methods: {
    doIdentity: function () {
      if (!this.inIdentity) {
        this.inIdentity = true
        AuthClient.create().then((authClient) => {
          authClient.login({
            onSuccess: async () => {
              identity = this.identity
              this.identity = await authClient.getIdentity();
              this.inIdentity = false
            },
            onError: () => {
              this.inIdentity = false
            }
          });
        }).catch(() => {
          this.inIdentity = false
        })
      }
    },
  }
}
</script>

<style scoped>
img {
  max-width: 100%;
  max-height: 100%;
  display: block;
  margin: auto;
}
</style>