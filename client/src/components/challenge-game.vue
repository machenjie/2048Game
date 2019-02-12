<template>
    <div @touchstart="touchAction"
         @touchmove="touchAction"
         @touchend="touchAction">
        <div class="heading d-block d-sm-none d-md-block">
            <level-choose class="level-choose" dialogTag="normal"
                          :value="currentLevel"
                          @input="changeLevel"
                          :chooseList="chooseList">
            </level-choose>
            <div class="score">
                SCORE
                <tween-number :number="score" :duration="200"></tween-number>
            </div>
            <div class="step">
                STEPS
                <tween-number :number="step" :duration="200" :style='{color: step<10?"red":"white"}'></tween-number>
            </div>
            <ul class="challenge-stat">
                <li v-for="challengeStat in challengeStatList" :key="challengeStat.key" :style='{backgroundColor: challengeStat.done?"#BBD08F":""}'>
                    <div v-if='challengeStat.type === "number"' >
                        <div class="challenge-number">
                            <number :number="challengeStat.data.number" :view-width="viewWidth" action="static"></number>
                        </div>
                        <div class="challenge-hit">
                            {{challengeStat.data.hit}}/{{challengeStat.data.total}}
                        </div>
                    </div>
                    <div v-else-if='challengeStat.type === "score"'>
                        <div class="challenge-score">
                            S
                        </div>
                        <div class="challenge-score-score">
                            {{challengeStat.data.score}}
                        </div>
                    </div>
                </li>
            </ul>
            <a class="new-game-btn" title="new game" @click="newGame">
                &#10227;
            </a>
        </div>
        <div class="row  no-gutters">
            <div class="col-0 col-sm-0 col-md-3 col-lg-3 col-xl"></div>
            <div class="col-12 col-sm-8 col-md-6 col-lg-6 col-xl game">
                <div class="game-over" v-if="gameOver">
                    Game Over!<br>
                    <a class="restart" @click="newGame">Try Again</a>
                </div>
                <div class="game-win" v-else-if="gameWin">
                    Game WIN!<br>
                    <a class="next-challenge" @click="nextChallenge">Next Level</a>
                </div>
                <div class="row  no-gutters" v-for="row in rowCol">
                    <div class="col" v-for="rc in row">
                        <number  ref="number" :number="numbers[rc.row][rc.col]" :view-width="viewWidth"
                                 :action="actions[rc.row][rc.col]"
                                 :duration="duration">
                        </number>
                    </div>
                </div>
                <rate-feedback id="rate-feedback" class="d-block d-sm-none d-md-block" dialogTag="normal"></rate-feedback>
                <div class="d-block d-sm-none d-md-block challenge-mode-navigate">
                    <div data-toggle="tooltip"
                         data-placement="bottom"
                         trigger="manual"
                         title="Classic Mode"
                         @mouseover="classicModeNavMouseOver"
                         @mouseout="classicModeNavMouseOut"
                         @click="classicModeNavMouseClick">
                        &#10152;
                    </div>
                    <radio-toggle class="radio-toggle" v-model="radioStat"></radio-toggle>
                </div>
            </div>
            <div class="col-0 col-sm-4 col-md-3 col-lg-3 col-xl">
                <div class="heading-sm d-none d-sm-block d-md-none">
                    <div class="level-choose-sm-area">
                        <level-choose class="level-choose-sm" dialogTag="small"
                                      :value="currentLevel"
                                      @input="changeLevel"
                                      :chooseList="chooseList">
                        </level-choose>
                    </div>
                    <div>
                        <div class="score-sm">
                            SCORE
                            <tween-number :number="score" :duration="200"></tween-number>
                        </div>
                        <div class="step-sm">
                            STEPS
                            <tween-number :number="step" :duration="200" :style='{color: step<10?"red":"white"}'></tween-number>
                        </div>
                    </div>
                    <ul class="challenge-stat-sm">
                        <li v-for="challengeStat in challengeStatList" :key="challengeStat.key" :style='{backgroundColor: challengeStat.done?"#BBD08F":""}'>
                            <div v-if='challengeStat.type === "number"' >
                                <div class="challenge-number-sm">
                                    <number :number="challengeStat.data.number" :view-width="viewWidth" action="static"></number>
                                </div>
                                <div class="challenge-hit-sm">
                                    {{challengeStat.data.hit}}/{{challengeStat.data.total}}
                                </div>
                            </div>
                            <div v-else-if='challengeStat.type === "score"'>
                                <div class="challenge-score-sm">
                                    S
                                </div>
                                <div class="challenge-score-score-sm">
                                    {{challengeStat.data.score}}
                                </div>
                            </div>
                        </li>
                    </ul>
                    <div class="new-game-btn-sm-area">
                        <a class="new-game-btn-sm" title="new game" @click="newGame">
                            &#10227;
                        </a>
                    </div>
                </div>
                <div class="tip-sm d-none d-sm-block d-md-none">
                    Tips: use &larr; &uarr; &rarr; &darr; to play!
                </div>
                <div id="last-line-sm" class="d-none d-sm-block d-md-none">
                    <div id="last-line-container-sm">
                        <rate-feedback id="rate-feedback-sm"  dialogTag="small"></rate-feedback>
                        <div class="challenge-mode-navigate-sm">
                            <div data-toggle="tooltip"
                                data-placement="bottom"
                                trigger="manual"
                                title="Classic Mode"
                                @mouseover="classicModeNavMouseOverSM"
                                @mouseout="classicModeNavMouseOutSM"
                                @click="classicModeNavMouseClickSM">
                                &#10152;
                            </div>
                            <radio-toggle class="radio-toggle-sm" v-model="radioStat"></radio-toggle>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="tip d-block d-sm-none d-md-block">
            Tips: use &larr; &uarr; &rarr; &darr; to play!
        </div>
    </div>
</template>

<script>
    import number from "./number";
    import tweenNumber from "../common/vuecomponet/tween-number";
    import arrowKeyboard from "./arrow-keyboard";
    import rateFeedback from "./rate-feedback";
    import levelChoose from "./level-choose";
    import chooseList from "../store/choose-list";
    import radioToggle from "./radio-toggle";
    import _ from "lodash";

    let GAME_DIM = 4;
    const NEW_DURATION = 200;

    function  initTwoDimArray(x, y, init = 0){
        let a=new Array(x);
        for(let i=0;i<x;i++){
            a[i]=new Array(y);
        }
        for(let i=0; i<x; i++){
            for(let j=0; j<y; j++){
                a[i][j] = init;
            }
        }
        return a;
    }

    function  initRowCol(row, col){
        let a=new Array(row);
        for(let i=0;i<row;i++){
            a[i]=new Array(col);
        }
        for(let i=0; i<row; i++){
            for(let j=0; j<col; j++){
                a[i][j] = {row: i, col: j};
            }
        }
        return a;
    }

    function copyTwoDimArray(copyArray, x, y) {
        let a = initTwoDimArray(x, y);
        for(let i=0; i<x; i++){
            for(let j=0; j<y; j++){
                a[i][j]=copyArray[i][j];
            }
        }
        return a;
    }

    function initStone(direction) {
        let stone = new Array(GAME_DIM);
        switch (direction) {
            case "down":
            case "right":
                for(let i=0; i<stone.length; i++){
                    stone[i] = GAME_DIM-1;
                }
                break;
            case "up":
            case "left":
                for(let i=0; i<stone.length; i++){
                    stone[i] = 0;
                }
                break;
        }
        return stone;
    }

    function initChallengeStatList(chooseList, currentLevel) {
        let challengeStatList = new Array(chooseList[currentLevel-1].challenge.length);
        for(let i=0; i<challengeStatList.length; i++){
            challengeStatList[i] = {};
            challengeStatList[i].key = i+1;
            challengeStatList[i].done = false;
            challengeStatList[i].type = chooseList[currentLevel-1].challenge[i].type;
            challengeStatList[i].data = {};
            if (challengeStatList[i].type  === "number") {
                challengeStatList[i].data.number = chooseList[currentLevel-1].challenge[i].data.number;
                challengeStatList[i].data.hit = 0;
                challengeStatList[i].data.total = chooseList[currentLevel-1].challenge[i].data.total;
            }
            else if (challengeStatList[i].type  === "score") {
                challengeStatList[i].data.score = chooseList[currentLevel-1].challenge[i].data.score;
            }
        }

        return challengeStatList;
    }

    function right(a, stone) {
        let score = 0;
        let haveAdd = false;
        let haveChanged = false;
        let numbers = copyTwoDimArray(a, GAME_DIM, GAME_DIM);
        let actions = initTwoDimArray(GAME_DIM, GAME_DIM, "");
        for(let i=0; i<GAME_DIM; i++) {
            for (let j = GAME_DIM - 1; j >= 1;) {
                if (numbers[i][j] !== 0 && stone[i] === j){
                    if ((numbers[i][j]) === (numbers[i][j-1])){
                        actions[i][j] = "right-double";
                        actions[i][j-1] = "hidden";
                        score += 2*numbers[i][j];
                        numbers[i][j] = 2*numbers[i][j];
                        numbers[i][j-1] = 0;
                        haveChanged = true;
                        haveAdd = true;
                        stone[i] = j-1;
                        j--;
                    }
                    else if ((numbers[i][j-1]) !== 0){
                        stone[i] = j-1;
                        j--;
                    }
                    else {
                        j--;
                    }
                }
                else {
                    if (numbers[i][j] === 0 && numbers[i][j-1] !== 0) {
                        actions[i][j] = "right";
                        actions[i][j-1] = "hidden";
                        numbers[i][j] = numbers[i][j-1];
                        numbers[i][j-1] = 0;
                        haveChanged = true;
                    }
                    j--;
                }
            }
        }
        return {numbers, actions, haveChanged, haveAdd, score};
    }

    function left(a, stone) {
        let  haveAdd = false;
        let  haveChanged = false;
        let  score = 0;
        let  numbers = copyTwoDimArray(a, GAME_DIM, GAME_DIM);
        let  actions = initTwoDimArray(GAME_DIM, GAME_DIM, "");

        for(let i=0; i<GAME_DIM; i++) {
            for (let j = 0; j < GAME_DIM-1;) {
                if (numbers[i][j] !== 0 && stone[i] === j) {
                    if ((numbers[i][j]) === (numbers[i][j+1])) {
                        actions[i][j] = "left-double";
                        actions[i][j+1] = "hidden";
                        score+=2*numbers[i][j];
                        numbers[i][j] = 2*numbers[i][j];
                        numbers[i][j+1] = 0;
                        haveChanged = true;
                        haveAdd = true;
                        stone[i] = j+1;
                        j++;
                    }
                    else if ((numbers[i][j+1]) !== 0){
                        stone[i] = j+1;
                        j++;
                    }
                    else {
                        j++;
                    }
                }
                else{
                    if (numbers[i][j] === 0 && numbers[i][j+1] !== 0) {
                        actions[i][j] = "left";
                        actions[i][j+1] = "hidden";
                        numbers[i][j] = numbers[i][j+1];
                        numbers[i][j+1] = 0;
                        haveChanged = true;
                    }
                    j++;
                }
            }
        }

        return {numbers, actions, haveChanged, haveAdd, score};
    }

    function down(a, stone) {
        let  haveAdd = false;
        let  haveChanged = false;
        let  score = 0;
        let  numbers = copyTwoDimArray(a, GAME_DIM, GAME_DIM);
        let  actions = initTwoDimArray(GAME_DIM, GAME_DIM, "");

        for(let i=0; i<GAME_DIM; i++) {
            for (let j = GAME_DIM - 1; j >= 1;) {
                if (numbers[j][i] !== 0 && stone[i] === j) {
                    if ((numbers[j][i]) === (numbers[j-1][i])) {
                        actions[j][i] = "down-double";
                        actions[j-1][i] = "hidden";
                        score += 2*numbers[j][i];
                        numbers[j][i] = 2*numbers[j][i];
                        numbers[j-1][i] = 0;
                        haveChanged = true;
                        haveAdd = true;
                        stone[i] = j-1;
                        j--;
                    }
                    else if ((numbers[j-1][i]) !== 0) {
                        stone[i] = j-1;
                        j--;
                    }
                    else {
                        j--;
                    }
                }
                else{
                    if ( numbers[j][i] === 0 && numbers[j-1][i] !== 0) {
                        actions[j][i] = "down";
                        actions[j-1][i] = "hidden";
                        numbers[j][i] = numbers[j-1][i];
                        numbers[j-1][i] = 0;
                        haveChanged = true;
                    }
                    j--;
                }
            }
        }

        return {numbers, actions, haveChanged, haveAdd, score};
    }

    function up(a, stone) {
        let  haveAdd = false;
        let  haveChanged = false;
        let  score = 0;
        let  numbers = copyTwoDimArray(a, GAME_DIM, GAME_DIM);
        let  actions = initTwoDimArray(GAME_DIM, GAME_DIM, "");

        for(let i=0; i<GAME_DIM; i++) {
            for (let j = 0; j < GAME_DIM-1;) {
                if (numbers[j][i] !== 0 && stone[i] === j) {
                    if ((numbers[j][i]) === (numbers[j+1][i])) {
                        actions[j][i] = "up-double";
                        actions[j+1][i] = "hidden";
                        score+=2*numbers[j][i];
                        numbers[j][i] = 2*numbers[j][i];
                        numbers[j+1][i] = 0;
                        haveChanged = true;
                        haveAdd = true;
                        stone[i] = j+1;
                        j++;
                    }
                    else if ((numbers[j+1][i]) !== 0) {
                        stone[i] = j+1;
                        j++;
                    }
                    else {
                        j++;
                    }
                }
                else{
                    if (numbers[j][i] === 0 && numbers[j+1][i] !== 0) {
                        actions[j][i] = "up";
                        actions[j+1][i] = "hidden";
                        numbers[j][i] = numbers[j+1][i];
                        numbers[j+1][i] = 0;
                        haveChanged = true;
                    }
                    j++;
                }
            }
        }

        return {numbers, actions, haveChanged, haveAdd, score};
    }

    function randomFill(a, zeroCount = 1){
        let  numbers = copyTwoDimArray(a, GAME_DIM, GAME_DIM);
        let  actions = initTwoDimArray(GAME_DIM, GAME_DIM, "");

        for(let i=0; i<zeroCount; i++) {
            let numbersZeroCount = arrZeroCount(numbers);
            if (numbersZeroCount === 0){
                break;
            }
            let randomNumber = 2;
            if (numbersZeroCount > GAME_DIM * GAME_DIM) {
                randomNumber = _.random(1, 2) === 1 ? 4 : 2;
            } else {
                randomNumber = _.random(1, 2) * _.random(1, 2) === 1 ? 4 : 2;
            }
            let fillIndex = _.random(1, numbersZeroCount);
            let currentIndex = 0;
            let fillSuccess = false;
            for(let xIndex=0; xIndex<GAME_DIM && !fillSuccess; xIndex++){
                for(let yIndex=0; yIndex<GAME_DIM && !fillSuccess; yIndex++){
                    if (numbers[xIndex][yIndex] === 0){
                        currentIndex++;
                    }
                    if (fillIndex === currentIndex) {
                        numbers[xIndex][yIndex] = randomNumber;
                        actions[xIndex][yIndex] = "new";
                        fillSuccess = true;
                    }
                }
            }
        }

        return {numbers, actions};
    }

    function arrZeroCount(numbers) {
        let zeroCount = 0;
        for(let i=0; i<GAME_DIM; i++){
            for(let j=0; j<GAME_DIM; j++){
                if (numbers[i][j] === 0){
                    zeroCount++;
                }
            }
        }
        return zeroCount;
    }

    function changeCheck(f, numbers, stone) {
        let {haveChanged} = f(numbers, stone);
        return haveChanged;
    }

    function checkGameOver(numbers) {
        let numbersCP = copyTwoDimArray(numbers, GAME_DIM, GAME_DIM);
        if (arrZeroCount(numbers) !== 0){
            return false;
        }
        return !(changeCheck(up, numbersCP, initStone("up")) || changeCheck(down, numbersCP, initStone("down"))
            || changeCheck(right, numbersCP, initStone("right")) || changeCheck(left, numbersCP, initStone("left")));
    }

    function objDeepCopy(source) {
        let sourceCopy = source instanceof Array ? [] : {};
        for (let item in source) {
            sourceCopy[item] = typeof source[item] === 'object' ? objDeepCopy(source[item]) : source[item];
        }
        return sourceCopy;
    }

    export default {
        name: "challenge-game",
        data: function (){
            let currentLevel = 1;
            let step = chooseList[currentLevel-1].step;
            let challengeStatList = initChallengeStatList(chooseList, currentLevel);
            let currentGameDim = chooseList[currentLevel-1].gameDim;
            GAME_DIM = currentGameDim;
            let gameWin = false;
            return {
                chooseList,
                currentLevel,
                step,
                challengeStatList,
                gameWin,
                currentGameDim,
                duration: 1,
                rowCol: initRowCol(GAME_DIM, GAME_DIM),
                numbers: initTwoDimArray(GAME_DIM, GAME_DIM),
                actions: initTwoDimArray(GAME_DIM, GAME_DIM, ""),
                score: 0,
                gameOver: false,
                viewWidth: document.body.clientWidth, //only just one element can receive resize event, so use viewWidth to notify others
                radioStat: true,
            }
        },
        methods: {
            changeLevel: function(val) {
                if (val !== this.currentLevel) {
                    this.currentLevel = val;
                    this.newGame();
                }
            },
            classicModeNavMouseOver: function(){
                $('.challenge-mode-navigate div').tooltip("show");
            },
            classicModeNavMouseOut: function(){
                $('.challenge-mode-navigate div').tooltip("hide");
            },
            classicModeNavMouseClick: function(){
                this.$router.replace("/classic-game");
                $('.challenge-mode-navigate div').tooltip("hide");
            },
            classicModeNavMouseOverSM: function(){
                $('.challenge-mode-navigate-sm div').tooltip("show");
            },
            classicModeNavMouseOutSM: function(){
                $('.challenge-mode-navigate-sm div').tooltip("hide");
            },
            classicModeNavMouseClickSM: function(){
                this.$router.replace("/classic-game");
                $('.challenge-mode-navigate-sm div').tooltip("hide");
            },
            newGame: function (){
                let _this = this;
                _this.step = _this.chooseList[_this.currentLevel-1].step;
                _this.currentGameDim = _this.chooseList[_this.currentLevel-1].gameDim;
                GAME_DIM = _this.currentGameDim;
                _this.challengeStatList = initChallengeStatList(_this.chooseList, _this.currentLevel);
                _this.gameWin = false;
                _this.gameOver = false;
                _this.score = 0;
                _this.numbers = initTwoDimArray(GAME_DIM, GAME_DIM);
                _this.rowCol = initRowCol(GAME_DIM, GAME_DIM);
                _this.actions = initTwoDimArray(GAME_DIM, GAME_DIM, "hidden");
                _.delay(function () {
                    let fillResult = randomFill(_this.numbers, 2);
                    _this.numbers = fillResult.numbers;
                    _this.actions = fillResult.actions;
                    _this.duration = NEW_DURATION;
                    _this.storeDataToHistory();
                }, 0);
            },
            nextChallenge: function() {
                if (this.currentLevel >= this.chooseList.length){
                    this.currentLevel = this.chooseList.length;
                }
                else{
                    this.currentLevel = this.currentLevel+1;
                }
                this.newGame();
            },
            storeDataToHistory: function () {
                let store = {
                    numbers: this.numbers,
                    score: this.score,
                    gameOver: this.gameOver,
                    currentGameDim: this.currentGameDim,
                    currentLevel: this.currentLevel,
                    step: this.step,
                    challengeStatList: this.challengeStatList,
                    gameWin: this.gameWin,
                };
                localStorage.setItem("_2048_challenge_game_data", JSON.stringify(store));
            },
            restoreDataFromHistory: function () {
                let data = localStorage.getItem("_2048_challenge_game_data");
                if (data) {
                    let {numbers, score, gameOver, currentGameDim, currentLevel, step, challengeStatList, gameWin} = JSON.parse(data);
                    if (typeof(currentGameDim) !== "undefined") {
                        this.currentLevel = currentLevel;
                        this.step = step;
                        this.challengeStatList = challengeStatList;
                        this.gameWin = gameWin;
                        this.currentGameDim = currentGameDim;
                        GAME_DIM = currentGameDim;
                        this.score = score;
                        this.gameOver = gameOver;
                        this.numbers = numbers;
                        this.rowCol = initRowCol(GAME_DIM, GAME_DIM);
                        this.actions = initTwoDimArray(GAME_DIM, GAME_DIM, "");
                        let _this = this;
                        _.delay(function () {
                            _this.actions = initTwoDimArray(GAME_DIM, GAME_DIM, "");
                            for(let i=0; i < GAME_DIM; i++){
                                for(let j=0; j < GAME_DIM; j++){
                                    if (_this.numbers[i][j] !== 0){
                                        _this.actions[i][j] = "new";
                                        _this.duration = NEW_DURATION;
                                    }
                                }
                            }
                        }, 0);
                    }
                    else{
                        this.newGame();
                    }
                }
                else{
                    this.newGame();
                }
            },
            storeChallengeChooseToHistory: function() {
                localStorage.setItem("_2048_challenge_game_choose_data", JSON.stringify(this.chooseList));
            },
            restoreChallengeChooseToHistory: function() {
                let data = localStorage.getItem("_2048_challenge_game_choose_data");
                if (data) {
                    let chooseList = JSON.parse(data);
                    if (typeof(chooseList) !== "undefined") {
                        let doneLength = 0;
                        for(let i=0; i<chooseList.length; i++){
                            if (chooseList[i].done) {
                                doneLength++;
                            }
                            else{
                                break;
                            }
                        }
                        if (this.chooseList.length >= chooseList.length) {
                            chooseList = chooseList.slice(0, doneLength).concat(this.chooseList.slice(doneLength, this.chooseList.length));
                        }
                        this.chooseList = chooseList;
                    }
                }
            },
            orderMinus: function() {
                if (this.currentGameDim > 4){
                    this.currentGameDim = this.currentGameDim - 1;
                }
            },
            orderAdd: function() {
                if (this.currentGameDim < 9){
                    this.currentGameDim = this.currentGameDim + 1;
                }
            },
            startAction: function(calOP, duration, haveChanged, haveAdd, addMap, score, stone, resolve){
                let _this = this;
                _this.actions = initTwoDimArray(GAME_DIM, GAME_DIM, "");
                _.delay(function () {
                    let calResult = calOP(_this.numbers, stone);
                    haveChanged = haveChanged || calResult.haveChanged;
                    haveAdd = haveAdd || calResult.haveAdd;
                    score += calResult.score;
                    _this.score += calResult.score;
                    _this.numbers = calResult.numbers;
                    _this.actions = calResult.actions;
                    for(let i =0; i<_this.actions.length; i++){
                        for(let j=0; j<_this.actions[i].length; j++){
                            if (_this.actions[i][j].indexOf("double") !== -1) {
                                if (addMap.has(_this.numbers[i][j])){
                                    addMap.set(_this.numbers[i][j], addMap.get(_this.numbers[i][j])+1);
                                }
                                else{
                                    addMap.set(_this.numbers[i][j], 1);
                                }
                            }
                        }
                    }
                    if (calResult.haveChanged) {
                        _.delay(function () {
                            _this.startAction(calOP, duration, haveChanged, haveAdd, addMap, score, stone, resolve);
                        }, duration);
                    }
                    else{
                        resolve(haveChanged, haveAdd, addMap, score);
                    }
                }, 0);
            },
            addNew: function(duration, resolve){
                let _this = this;
                _this.actions = initTwoDimArray(GAME_DIM, GAME_DIM, "");
                _.delay(function () {
                    let fillResult = randomFill(_this.numbers);
                    _this.numbers = fillResult.numbers;
                    _this.actions = fillResult.actions;
                    resolve();
                }, 0);
            },
            playAddAudio: function(score) {
                if (!this.radioStat) {
                    return;
                }
                if (typeof(this.audioCtx) === "undefined") {
                    window.AudioContext = window.AudioContext || window.webkitAudioContext;
                    if (typeof(window.AudioContext) === "undefined") {
                        return;
                    }
                    this.audioCtx = new AudioContext();
                }
                let oscillator = this.audioCtx.createOscillator();
                let gainNode = this.audioCtx.createGain();
                oscillator.connect(gainNode);
                gainNode.connect(this.audioCtx.destination);
                oscillator.type = 'sine';
                oscillator.frequency.value = 300+(Math.log2(score)-1)*100;
                gainNode.gain.setValueAtTime(0, this.audioCtx.currentTime);
                gainNode.gain.linearRampToValueAtTime(1, this.audioCtx.currentTime + 0.01);
                oscillator.start(this.audioCtx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 1);
                oscillator.stop(this.audioCtx.currentTime + 1);
            },
            updateChallengeChange: function(addMap) {
                let challengeStatList = objDeepCopy(this.challengeStatList);
                for(let i=0; i<challengeStatList.length; i++){
                    if (challengeStatList[i].done){
                        continue;
                    }
                    if (challengeStatList[i].type === "number"){
                        if (addMap.has(challengeStatList[i].data.number)) {
                            challengeStatList[i].data.hit += addMap.get(challengeStatList[i].data.number);
                            if (challengeStatList[i].data.hit >= challengeStatList[i].data.total){
                                challengeStatList[i].done = true;
                                challengeStatList[i].data.hit = challengeStatList[i].data.total;
                            }
                        }
                    }
                    else if (challengeStatList[i].type === "score"){
                        if (this.score >= challengeStatList[i].data.score){
                            challengeStatList[i].done = true;
                        }
                    }
                }
                this.challengeStatList = challengeStatList;
            },
            updateChooseList: function() {
                let chooseList = objDeepCopy(this.chooseList);
                chooseList[this.currentLevel-1].done = true;
                this.chooseList = chooseList;
            },
            isChallengeDone: function() {
                let challengeDone = true;
                for(let i=0; i<this.challengeStatList.length; i++){
                    if (!this.challengeStatList[i].done) {
                        challengeDone = false;
                        break;
                    }
                }
                return challengeDone;
            },
            isChallengeFailed: function() {
                return this.step === 0;
            },
            keyboardOP: function (calOP, direction) {
                let _this = this;
                let baseTime = 70;
                let stone = initStone(direction);
                if (_this.gameOver || _this.gameWin) {
                    return;
                }
                if (typeof(_this.inMoveing) !== "undefined"){
                    return;
                }
                _this.inMoveing = true;
                _this.duration = baseTime-GAME_DIM*5;
                let addMap = new Map();
                _this.startAction(calOP, _this.duration, false, false, addMap, 0, stone, function (c, a, addMap, s) {
                    if (c) {
                        if (a) {
                            _this.playAddAudio(s);
                            _this.updateChallengeChange(addMap);
                        }
                        _this.step = _this.step-1;
                        if (_this.isChallengeDone()){
                            _this.gameWin = true;
                            _this.storeDataToHistory();
                            _this.updateChooseList();
                            _this.storeChallengeChooseToHistory();
                            delete _this.inMoveing;
                        }
                        else if (_this.isChallengeFailed()){
                            _this.gameOver = true;
                            _this.storeDataToHistory();
                            delete _this.inMoveing;
                        }
                        else {
                            _this.duration = NEW_DURATION;
                            _this.addNew(_this.duration, function () {
                                _this.storeDataToHistory();
                                delete _this.inMoveing;
                            });
                        }
                    }
                    else{
                        delete _this.inMoveing;
                        if (!_this.gameOver) {
                            _this.gameOver = checkGameOver(_this.numbers);
                            _this.storeDataToHistory();
                        }
                    }
                });
            },
            keyDown: function () {
                this.keyboardOP(down, "down");
            },
            keyUp: function () {
                this.keyboardOP(up, "up");
            },
            keyLeft: function () {
                this.keyboardOP(left, "left");
            },
            keyRight: function () {
                this.keyboardOP(right, "right");
            },
            keyEnter: function () {
                if (this.gameOver) {
                    this.newGame();
                }
                else if (this.gameWin) {
                    this.nextChallenge();
                }
            },
            touchAction: (function () {
                let touchStartX = 0;
                let touchStartY = 0;
                return function (event) {
                    switch (event.type) {
                        case "touchstart":
                            touchStartX = event.touches[0].pageX;
                            touchStartY = event.touches[0].pageY;
                            break;
                        case "touchend":
                            let spanX = event.changedTouches[0].pageX - touchStartX;
                            let spanY = event.changedTouches[0].pageY - touchStartY;
                            if (Math.abs(spanX) > Math.abs(spanY)) {
                                if (spanX > 30) {
                                    this.keyRight();
                                } else if (spanX < -30) {
                                    this.keyLeft();
                                }
                            } else {
                                if (spanY > 30) {
                                    this.keyDown();
                                } else if (spanY < -30) {
                                    this.keyUp();
                                }
                            }
                            break;
                        case "touchmove":
                            event.preventDefault();
                            break;
                    }
                }
            }()),
            keyboardAction: function (e) {
                let keyCode = e.keyCode || e.which;
                if(keyCode === 37){
                    this.keyLeft();
                }
                else if (keyCode === 39){
                    this.keyRight();
                }
                else if (keyCode === 38){
                    this.keyUp();
                }
                else if (keyCode === 40){
                    this.keyDown();
                }
                else if (keyCode === 13){
                    this.keyEnter();
                }
            }
        },
        created: function(){
            // let _this = this;
            // $('body').on('keyup', function (e) {
            //     e = window.event||e;
            //     _this.keyboardAction(e);
            // });
            document.onkeyup = this.keyboardAction;
        },
        mounted: function(){
            let _this = this;
            window.onresize = _.debounce(()=>{
                _this.viewWidth = document.body.clientWidth;
            }, 50);
            _this.$nextTick(function () {
                _this.restoreChallengeChooseToHistory();
                _this.restoreDataFromHistory();
            });
        },
        components: {
            tweenNumber,
            number,
            arrowKeyboard,
            rateFeedback,
            levelChoose,
            radioToggle,
        }
    }
</script>

<style scoped>
    .no-gutters {
        margin-right: 0;
        margin-left: 0;
    }
    .no-gutters .col, [class*="col-"]{
        padding-right: 0;
        padding-left: 0;
    }
    .heading {
        margin: 6px 0 6px 0;
        text-align: center;
        height: 90px;
        line-height: 90px;
        user-select: none;
        font-size: 0;
    }
    .heading .level-choose{
        display: inline-block;
        height: 54px;
        min-width: 90px;
        padding: 0;
        text-align: center;
        margin-right: 5px;
        background: #bbada0;
        font-size: 54px;
        font-weight: bold;
        line-height: 42px;
        color: white;
        cursor: pointer;
        vertical-align: middle;
        border-radius: 50%;
    }
    .heading .level-choose:hover{
        color: #FF5432;
    }
    .heading .score, .heading .step {
        display: inline-block;
        width: 120px;
        height: 54px;
        margin-right: 5px;
        background: #bbada0;
        font-weight: bold;
        font-size: 18px;
        line-height: 30px;
        border-radius: 3px 3px 3px 3px;
        color: white;
        text-align: center;
        vertical-align: middle;
    }
    .heading .challenge-stat{
        display: inline-block;
        width: 90px;
        margin: 0 5px 0 0;
        padding: 0;
        text-align: center;
        vertical-align: middle;
    }
    .heading .challenge-stat li{
        list-style-type: none;
        position: relative;
        width: 90px;
        height: 28px;
        margin: 0 0 2px 0;
        padding: 0;
        background: #bbada0;
        border-radius: 3px 3px 3px 3px;
    }
    .heading .challenge-stat .challenge-number{
        position: absolute;
        left: 2px;
        top: 2px;
        bottom: 2px;
        width: 24px;
    }
    .heading .challenge-stat .challenge-hit {
        position: absolute;
        right: 3px;
        top: 0;
        bottom: 0;
        font-weight: bold;
        font-size: 14px;
        color: white;
        line-height: 28px;
    }
    .heading .challenge-stat .challenge-score{
        position: absolute;
        left: 3px;
        top: 3px;
        bottom: 3px;
        width: 22px;
        background-color: #bbada0;
        font-weight: bold;
        font-size: 14px;
        color: white;
        line-height: 22px;
        border-radius: 2px;
    }
    .heading .challenge-stat .challenge-score-score {
        position: absolute;
        right: 3px;
        top: 0;
        bottom: 0;
        font-weight: bold;
        font-size: 14px;
        color: white;
        line-height: 28px;
    }
    .heading .new-game-btn{
        display: inline-block;
        width: 35px;
        height: 54px;
        font-weight: bold;
        font-size: 35px;
        line-height: 54px;
        color: #776e65;
        text-align: center;
        vertical-align: middle;
        cursor: pointer;
    }
    .heading .new-game-btn:hover{
        color: #FF5432;
    }
    .game-over, .game-win {
        position: absolute;
        left:0;
        right: 0;
        top: 0;
        bottom: 0;
        margin: auto;
        text-align: center;
        font-weight: bold;
        font-size: 50px;
        color: #776e65;
        padding-top: 50%;
        background-color: rgba(192,192,192,0.8);
        z-index: 3;
        border-radius: 1%;
    }
    .game-over .restart, .game-win .next-challenge {
        padding: 1%;
        font-weight: bold;
        font-size: 18px;
        color: rgba(255,255,255,1);
        background-color: #8f7a66;
        border-radius: 3px 3px 3px 3px;
        cursor: pointer;
    }
    #rate-feedback{
        position: absolute;
        left:0;
        bottom: -30px;
    }
    .challenge-mode-navigate{
        position: absolute;
        display: inline;
        right:0;
        bottom: -30px;
        height: 30px;
        font-size: 30px;
        color: #776e65;
        line-height: 30px;
    }
    .challenge-mode-navigate div{
        float: right;
        cursor: pointer;
        vertical-align: middle;
    }
    .challenge-mode-navigate div:hover{
        color: #FF5432;
    }
    .challenge-mode-navigate .radio-toggle{
        float: right;
        width: 26px;
        height: 26px;
        margin: 2px;
        vertical-align: middle;
    }
    .game{
        background-color: #776e65;
        padding: 0.5% !important;
        border-radius: 1.5%;
    }
    /*.arrow-keyboard {*/
    /*text-align: center;*/
    /*margin: 0 0 0 0;*/
    /*padding: 0 0 0 0;*/
    /*}*/
    /*.arrow-keyboard-sm{*/
    /*text-align: center;*/
    /*margin: 0 0 0 0;*/
    /*padding: 0 0 0 0;*/
    /*}*/
    .tip {
        padding: 0 0 0 0;
        margin: 0 0 0 0;
        text-align: center;
        font-size: 18px;
        font-weight: bold;
        color: #776e65;
    }
    .heading-sm {
        margin: 18px 0 0 0;
        text-align: center;
        user-select: none;
    }
    .heading-sm .level-choose-sm-area{
        text-align: center;
    }
    .heading-sm .level-choose-sm{
        display: inline-block;
        text-align: center;
        padding: 0;
        height: 36px;
        font-size: 36px;
        font-weight: bold;
        line-height: 25px;
        cursor: pointer;
        background: #bbada0;
        color: white;
        border-radius: 50%;
    }
    .heading-sm .level-choose-sm:hover{
        color: #FF5432;
    }
    .heading-sm .score-sm, .step-sm {
        display: inline-block;
        margin: 18px 0 0 0;
        width: 90px;
        height: 36px;
        background: #bbada0;
        font-weight: bold;
        font-size: 12px;
        border-radius: 3px 3px 3px 3px;
        color: white;
        text-align: center;
        vertical-align: middle;
    }
    .heading-sm .challenge-stat-sm{
        display: inline-block;
        width: 90px;
        margin: 18px 0 0 0;
        padding: 0;
        text-align: center;
        vertical-align: middle;
    }
    .heading-sm .challenge-stat-sm li{
        list-style-type: none;
        position: relative;
        width: 90px;
        height: 28px;
        margin: 0 0 2px 0;
        padding: 0;
        background: #bbada0;
        border-radius: 3px 3px 3px 3px;
    }
    .heading-sm .challenge-stat-sm .challenge-number-sm{
        position: absolute;
        left: 2px;
        top: 2px;
        bottom: 2px;
        width: 24px;
    }
    .heading-sm .challenge-stat-sm .challenge-hit-sm {
        position: absolute;
        right: 3px;
        top: 0;
        bottom: 0;
        font-weight: bold;
        font-size: 14px;
        color: white;
        line-height: 28px;
    }
    .heading-sm .challenge-stat-sm .challenge-score-sm{
        position: absolute;
        left: 3px;
        top: 3px;
        bottom: 3px;
        width: 22px;
        background-color: #bbada0;
        font-weight: bold;
        font-size: 14px;
        color: white;
        line-height: 22px;
        border-radius: 2px;
    }
    .heading-sm .challenge-stat-sm .challenge-score-score-sm {
        position: absolute;
        right: 3px;
        top: 0;
        bottom: 0;
        font-weight: bold;
        font-size: 14px;
        color: white;
        line-height: 28px;
    }
    .new-game-btn-sm-area{
        margin-top: 18px;
    }
    .heading-sm .new-game-btn-sm{
        height: 36px;
        font-weight: bold;
        font-size: 50px;
        line-height: 36px;
        color: #776e65;
        text-align: center;
        vertical-align: middle;
        cursor: pointer;
    }
    .heading-sm .new-game-btn-sm:hover{
        color: #FF5432;
    }
    .tip-sm {
        position: absolute;
        left:0;
        right: 0;
        bottom: 50px;
        padding: 0 0 0 0;
        text-align: center;
        font-size: 14px;
        font-weight: bold;
        color: #776e65;
    }
    #last-line-sm{
        position: absolute;
        display: block;
        bottom: 0;
        left: 0;
        right: 0;
        height: 30px;
        text-align: center;
    }
    #last-line-container-sm{
        position: relative;
        display: inline-block;
        width: 180px;
        height: 30px;
    }
    #rate-feedback-sm{
        position: absolute;
        left:0;
        bottom: 0;
    }
    .challenge-mode-navigate-sm{
        position: absolute;
        display: inline;
        right:0;
        bottom: 0;
        height: 30px;
        font-size: 30px;
        color: #776e65;
        line-height: 30px;
    }
    .challenge-mode-navigate-sm div{
        float: right;
        cursor: pointer;
        vertical-align: middle;
    }
    .challenge-mode-navigate-sm div:hover{
        color: #FF5432;
    }
    .challenge-mode-navigate-sm .radio-toggle-sm{
        float: right;
        width: 26px;
        height: 26px;
        margin: 2px;
        vertical-align: middle;
    }
</style>