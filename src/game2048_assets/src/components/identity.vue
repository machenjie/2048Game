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
        :title='$t("title")'
        :cancelText='$t("cancelText")'
        :okText='$t("okText")'
        centered
        closable="false"
        :okButtonProps="{props:{disabled:inputUserNameOkClose}}"
        @ok="userNameOkClick"
        @cancel="userNameCancelClick"
    >
      <a-input v-model="inputUserName"/>
    </a-modal>
  </div>
</template>

<i18n>
{
  "ko": {
    "title": "이름을 입력하십시오",
    "cancelText": "취소",
    "okText": "확인"
  },
  "bn": {
    "cancelText": "বাতিল করুন",
    "title": "ইনপুট আপনি নাম",
    "okText": "নিশ্চিত করুন"
  },
  "ja": {
    "okText": "確認",
    "title": "入力します",
    "cancelText": "キャンセル"
  },
  "ru": {
    "title": "Введите вас имя",
    "cancelText": "Отмена",
    "okText": "Подтверждать"
  },
  "pt-br": {
    "cancelText": "Cancelar",
    "title": "Entrar seu nome",
    "okText": "confirme"
  },
  "fr": {
    "title": "Entrez votre nom",
    "cancelText": "Annuler",
    "okText": "Confirmer"
  },
  "hi": {
    "cancelText": "रद्द करना",
    "title": "इनपुट आप नाम",
    "okText": "पुष्टि करें"
  },
  "es": {
    "cancelText": "Cancelar",
    "title": "Ingrese su nombre",
    "okText": "Confirmar"
  },
  "zh-hk": {
    "okText": "確認",
    "title": "輸入你的名字",
    "cancelText": "取消"
  },
  "ar": {
    "title": "إدخال اسمك",
    "cancelText": "يلغي",
    "okText": "يتأكد"
  },
  "de": {
    "cancelText": "Stornieren",
    "title": "Geben Sie den Namen ein",
    "okText": "Bestätigen"
  },
  "zh-cn": {
    "title": "输入你的名字",
    "okText": "确认",
    "cancelText": "取消"
  },
  "zh-tw": {
    "okText": "確認",
    "title": "輸入你的名字",
    "cancelText": "取消"
  },
  "en": {
    "title": "Input You Name",
    "okText": "Confirm",
    "cancelText": "Cancel"
  }
}
</i18n>

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
    inputUserNameOkClose: function () {
      let uName = this.inputUserName
      return uName.length < 2
    }
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
  text-align: center;
}

.user {
  max-width: 100%;
  max-height: 100%;
  display: block;
  margin: auto;
  text-align: center;
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