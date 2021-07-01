import Vue from "vue";
import VueRouter from  "vue-router";
import game from "./components/game";
import ChallengeGame from "./components/challenge-game";
import AskForRate from "./components/ask-for-rate";
import VueI18n from 'vue-i18n';
import Vuex from 'vuex';
import Config from "./store/config";
import VuexPersistence from 'vuex-persist';
import GaReport, {CategoryActions} from './api/ga-report';

function restoreHomeUrl() {
    let data = localStorage.getItem("_2048_game_latest_path");
    let homeUrl = "/classic-game";
    if (data) {
        homeUrl = data;
    }

    return homeUrl;
}

function storeHomeUrl() {
    localStorage.setItem("_2048_game_latest_path", router.currentRoute.path);
}

Vue.use(VueRouter);
let routes = [
    {path: "/", redirect: restoreHomeUrl()},
    {path: "/classic-game", component: game},
    {path: "/challenge-game", component: ChallengeGame},
];
let router = new VueRouter({
    routes,
});
router.afterEach(function () {
    storeHomeUrl();
});

Vue.use(VueI18n);
const i18n = new VueI18n({
    locale: (function () {
        let defaultLang = "en";
        let supportLangList = ["en", "ar", "ko", "de", "ru", "fr", "bn", "pt-br", "ja", "es", "hi", "zh-cn", "zh-tw", "zh-hk"];
        if (typeof(Windows) === "undefined") {
            return defaultLang;
        }
        let systemLangLow = Windows.System.UserProfile.GlobalizationPreferences.languages[0].toLowerCase();
        let langIndex = supportLangList.indexOf(systemLangLow);
        if (langIndex !== -1) {
            return supportLangList[langIndex];
        }
        let barIndex = systemLangLow.indexOf('-');
        if (barIndex === -1){
            return defaultLang;
        }
        let simpleSystemLangLow = systemLangLow.slice(0, barIndex);
        langIndex = supportLangList.indexOf(simpleSystemLangLow);
        if (langIndex !== -1) {
            return supportLangList[langIndex];
        }
        let selectLang = supportLangList.find(function (e) {
            return e.indexOf(simpleSystemLangLow) ===0;
        });
        if (selectLang !== "undefined") {
            return selectLang;
        }
        return defaultLang;
    })(),
    fallbackLocale: 'en'
});

Vue.use(Vuex);
const store = new Vuex.Store(Object.assign(Config, {plugins: [(new VuexPersistence({
        modules: ['config'],
        key: "_2048_global_state"
    })).plugin]}));

new Vue({
    el:"#app",
    i18n,
    router,
    store,
    components: {
        AskForRate,
    },
    mounted: function () {
        let _this = this;
        _this.$nextTick(function () {
            _this.$store.commit("setUUID", _this.$store.state.config.uuid);
            _this.$store.commit("setVersionNO", Config.state.config.versionNO);
            GaReport(_this.$store.state.config.uuid, _this.$store.state.config.versionNO, CategoryActions.GA_APP.name, CategoryActions.GA_APP.actions.OPERATION_START);
        });
    },
});