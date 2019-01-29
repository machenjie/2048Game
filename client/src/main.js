import Vue from "vue";
import VueRouter from  "vue-router";
import game from "./components/game";
import ChallengeGame from "./components/challenge-game";

Vue.use(VueRouter);
let routes = [
    {path: "/", component: game},
    {path: "/challenge-game", component: ChallengeGame},
];
let router = new VueRouter({
    routes,
});

new Vue({
    el:"#app",
    router,
    components:{
    }
});