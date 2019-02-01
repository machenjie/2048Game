import Vue from "vue";
import VueRouter from  "vue-router";
import game from "./components/game";
import ChallengeGame from "./components/challenge-game";
import AskForRate from "./components/ask-for-rate";

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

new Vue({
    el:"#app",
    router,
    components: {
        AskForRate,
    }
});