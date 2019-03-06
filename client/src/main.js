import Vue from "vue";
import VueRouter from  "vue-router";
import game from "./components/game";
import ChallengeGame from "./components/challenge-game";
import AskForRate from "./components/ask-for-rate";
import VueI18n from 'vue-i18n';

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
        if ( Windows.System.UserProfile.GlobalizationPreferences === "undefined") {
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

new Vue({
    el:"#app",
    i18n,
    router,
    components: {
        AskForRate,
    }
});