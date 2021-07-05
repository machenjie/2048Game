<template>
  <div class="identity">
    <div v-if="userName" class="user" @click="loginOutModalVisible=true">
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
    <a-modal
        v-if="identity&&userName"
        :visible="loginOutModalVisible"
        :title='$t("loginOutTitle")'
        :cancelText='$t("cancelText")'
        :okText='$t("okText")'
        centered
        closable="false"
        @ok="loginOutOkClick"
        @cancel="loginOutCancelClick"
    >
      {{ $t("logoutContent") }}
    </a-modal>
  </div>
</template>

<i18n>
{
  "de": {
    "okText": "Bestätigen",
    "cancelText": "Stornieren",
    "registering": "Registrieren...",
    "title": "Geben Sie den Namen ein",
    "loginOutTitle": "Ausloggen",
    "logoutContent": "Bereit zum Abmelden?"
  },
  "ar": {
    "okText": "يتأكد",
    "cancelText": "يلغي",
    "registering": "تسجيل ...",
    "loginOutTitle": "تسجيل خروج",
    "title": "إدخال اسمك",
    "logoutContent": "هل جاهز للتسجيل؟"
  },
  "ko": {
    "okText": "확인",
    "registering": "등록 ...",
    "cancelText": "취소",
    "title": "이름을 입력하십시오",
    "loginOutTitle": "로그 아웃",
    "logoutContent": "로그 아웃 준비가 되었습니까?"
  },
  "fr": {
    "registering": "Enregistrement...",
    "title": "Entrez votre nom",
    "okText": "Confirmer",
    "loginOutTitle": "Se déconnecter",
    "cancelText": "Annuler",
    "logoutContent": "Prêt à la déconnexion?"
  },
  "ru": {
    "cancelText": "Отмена",
    "title": "Введите вас имя",
    "loginOutTitle": "Выйти",
    "okText": "Подтверждать",
    "registering": "Регистрация ...",
    "logoutContent": "Готовы выйти?"
  },
  "bn": {
    "okText": "নিশ্চিত করুন",
    "registering": "নিবন্ধন ...",
    "loginOutTitle": "প্রস্থান",
    "title": "ইনপুট আপনি নাম",
    "cancelText": "বাতিল করুন",
    "logoutContent": "লগআউট করার জন্য প্রস্তুত?"
  },
  "ja": {
    "registering": "登録...",
    "okText": "確認",
    "loginOutTitle": "ログアウト",
    "cancelText": "キャンセル",
    "title": "入力します",
    "logoutContent": "ログアウトする準備ができましたか？"
  },
  "hi": {
    "registering": "पंजीकरण ...",
    "loginOutTitle": "लॉग आउट",
    "cancelText": "रद्द करना",
    "okText": "पुष्टि करें",
    "title": "इनपुट आप नाम",
    "logoutContent": "लॉगआउट के लिए तैयार?"
  },
  "es": {
    "registering": "Registrando ...",
    "loginOutTitle": "Cerrar sesión",
    "cancelText": "Cancelar",
    "title": "Ingrese su nombre",
    "okText": "Confirmar",
    "logoutContent": "¿Listo para cerrar sesión?"
  },
  "pt-br": {
    "loginOutTitle": "Sair",
    "cancelText": "Cancelar",
    "registering": "Registrando ...",
    "okText": "confirme",
    "title": "Entrar seu nome",
    "logoutContent": "Pronto para o logout?"
  },
  "zh-cn": {
    "cancelText": "取消",
    "title": "输入你的名字",
    "okText": "确认",
    "loginOutTitle": "登出",
    "registering": "注册...",
    "logoutContent": "准备退出？"
  },
  "zh-hk": {
    "cancelText": "取消",
    "okText": "確認",
    "title": "輸入你的名字",
    "registering": "註冊...",
    "loginOutTitle": "登出",
    "logoutContent": "準備退出？"
  },
  "zh-tw": {
    "title": "輸入你的名字",
    "loginOutTitle": "登出",
    "okText": "確認",
    "registering": "註冊...",
    "cancelText": "取消",
    "logoutContent": "準備退出？"
  },
  "en": {
    "title": "Input You Name",
    "okText": "Confirm",
    "cancelText": "Cancel",
    "registering": "Registering...",
    "loginOutTitle": "Logout",
    "logoutContent": "Ready to logout?"
  }
}
</i18n>

<script>
import {BigNumber} from "bignumber.js";
import {AuthClient} from "@dfinity/auth-client";
import {Actor, HttpAgent} from "@dfinity/agent";
import {message} from "ant-design-vue";
import {idlFactory as customGame2048IDL, canisterId as customGame2048ID} from "dfx-generated/game2048";

const agent = new HttpAgent();
let agentRootKeyGot = false;
const customGame2048 = Actor.createActor(customGame2048IDL, {agent, canisterId: customGame2048ID});
const userNameRegisterKey = 'register';
const userNameMinLength = 2;
const userNameMaxLength = 16;

export default {
  name: "identity",
  data: function () {
    return {
      inIdentity: false,
      inputUserName: "",
      userNameModalVisible: false,
      userNameInRegistering: false,
      loginOutModalVisible: false
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
      return this.userNameInRegistering || uName.length < userNameMinLength || uName.length > userNameMaxLength
    }
  },
  methods: {
    userNameOkClick: function () {
      (async () => {
        let registerUserName = this.inputUserName
        if (registerUserName.length < userNameMinLength || registerUserName.length > userNameMaxLength) {
          message.error({
            content: 'User Name invalid!',
            key: userNameRegisterKey,
            duration: 3
          });
        }
        message.loading({content: this.$t("registering"), key: userNameRegisterKey, duration: 4});
        this.userNameInRegistering = true
        if (!agentRootKeyGot) {
          await agent.fetchRootKey()
          agentRootKeyGot = true
        }
        let result = await customGame2048.register(this.$store.state.user.principal, registerUserName)
        // TUPLE => ARRAY
        if (result instanceof Array && result.length === 3 && typeof result[0] === "boolean" && typeof result[1] === "boolean") {
          if (result[0]) {
            if (result[1]) {
              this.$store.commit("setUserName", registerUserName);
              this.$store.commit("setLastLoginAt", Date.now());
              this.userNameModalVisible = false
              message.success({
                content: 'Register success! Welcome ' + registerUserName + '! You are the No.' + (new BigNumber(result[2])).toNumber() + ' user!',
                key: userNameRegisterKey,
                duration: 3
              });
            } else {
              message.error({
                content: 'Register failed! User Name ' + registerUserName + ' already existed!',
                key: userNameRegisterKey,
                duration: 3
              });
            }
          } else {
            message.error({
              content: 'Register error! User Name invalid!',
              key: userNameRegisterKey,
              duration: 3
            });
          }
        } else {
          message.error({
            content: 'Register error! Internal error!',
            key: userNameRegisterKey,
            duration: 3
          });
          this.userNameModalVisible = false
        }
        this.userNameInRegistering = false
      })().catch((e) => {
        console.log(e)
        this.userNameModalVisible = false
        this.userNameInRegistering = false
      })
    },
    userNameCancelClick: function () {
      this.userNameModalVisible = false
    },
    loginOutOkClick: function () {
      this.$store.commit("setPrincipal", "");
      this.$store.commit("setUserName", "");
      this.loginOutModalVisible = false
    },
    loginOutCancelClick: function () {
      this.loginOutModalVisible = false
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
              isDone = true
              if (doneTimer) {
                clearTimeout(doneTimer)
              }
              let userInfo = await customGame2048.userInfo(identity.getPrincipal().toString())
              if (userInfo instanceof Array && userInfo.length === 2
                  && userInfo[1] instanceof Array && userInfo[1].length === 1
                  && typeof userInfo[1][0] === "object") {
                if (userInfo[1][0].name) {
                  this.$store.commit("setUserName", userInfo[1][0].name);
                  this.$store.commit("setLastLoginAt", Date.now());
                  message.success({
                    content: 'Welcome ' + userInfo[1][0].name + ', the No.' + (new BigNumber(userInfo[1][0].id)).toNumber() + ' user!',
                    key: userNameRegisterKey,
                    duration: 3
                  });
                  return
                }
              }
              this.userNameModalVisible = true
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
  },
  mounted: function () {
    (async () => {
      try {
        await agent.fetchRootKey()
        agentRootKeyGot = true
        if (this.identity && this.userName) {
          let userInfo = await customGame2048.userInfo(this.identity)
          if (userInfo instanceof Array && userInfo.length === 2
              && userInfo[1] instanceof Array && userInfo[1].length === 1
              && typeof userInfo[1][0] === "object") {
            if (userInfo[1][0].name !== this.userName) {
              this.$store.commit("setUserName", "");
              this.$store.commit("setPrincipal", "");
              this.$store.commit("setLastLoginAt", Date.now());
            }
          } else {
            console.log("customGame2048 request error!")
          }
        }
      } catch (e) {
        console.log(e)
      }
    })()
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
  cursor: pointer;
}

.dfinity img {
  max-width: 100%;
  max-height: 100%;
  display: block;
  margin: auto;
  cursor: pointer;
}
</style>