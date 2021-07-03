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
    import {BigNumber} from "bignumber.js";
    import {AuthClient} from "@dfinity/auth-client";
    import {Actor, HttpAgent} from "@dfinity/agent";
    import {message} from "ant-design-vue";
    import {idlFactory as customGame2048IDL, canisterId as customGame2048ID} from "dfx-generated/game2048";

    const agent = new HttpAgent();
    let agentRootKeyGot = false;
    const customGame2048 = Actor.createActor(customGame2048IDL, {agent, canisterId: customGame2048ID});
    const userNameRegisterKey = 'register';

    export default {
        name: "identity",
        data: function () {
            return {
                inIdentity: false,
                inputUserName: "",
                userNameModalVisible: false,
                userNameInRegistering: false
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
                return !this.userNameInRegistering && uName.length < 2
            }
        },
        methods: {
            userNameOkClick: function () {
                (async () => {
                    let registerUserName = this.inputUserName
                    message.loading({content: 'Registering...', key: userNameRegisterKey, duration: 5});
                    this.userNameInRegistering = true
                    if (!agentRootKeyGot) {
                        await agent.fetchRootKey()
                    }
                    let result = await customGame2048.register(this.$store.state.user.principal, registerUserName)
                    // TUPLE => ARRAY
                    if (result instanceof Array && result.length === 3) {
                        if (typeof result[0] === "boolean" && typeof result[1] === "boolean") {
                            if (result[0]) {
                                if (result[1]) {
                                    this.$store.commit("setUserName", registerUserName);
                                    this.$store.commit("setLastLoginAt", Date.now());
                                    this.userNameModalVisible = false
                                    message.success({
                                        content: 'Register success! Welcome ' + registerUserName + '! You are the No.' + result[2].toNumber() + '!',
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
                                // TUPLE => ARRAY
                                if (userInfo instanceof Array && userInfo.length === 2) {
                                    // OPTION => ARRAY
                                    if (userInfo[1] instanceof Array && userInfo[1].length === 1) {
                                        // OBJECT => OBJECT
                                        if (typeof userInfo[1][0] === "object") {
                                            if (userInfo[1][0].name) {
                                                this.$store.commit("setUserName", userInfo[1][0].name);
                                                this.$store.commit("setLastLoginAt", Date.now());
                                                return
                                            }
                                        }
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
            agent.fetchRootKey().then(() => {
                agentRootKeyGot = true
            }).catch((e) => {
                console.log(e)
            })
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