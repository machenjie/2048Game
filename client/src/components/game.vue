<template>
    <div @touchstart="touchAction"
         @touchmove="touchAction"
         @touchend="touchAction">
        <div class="heading d-block d-sm-none d-md-block">
            <div class="title">2048</div>
            <div class="score">
                SCORE
                <tween-number :number="score" :duration="200"></tween-number>
            </div>
            <div class="best-score">
                BEST
                <tween-number :number="bestScore" :duration="200"></tween-number>
            </div>
            <div class="order-action">
                <div class="order-minus" :class="{disabled: currentGameDim===4}" @click="orderMinus" title="decrease order"></div>
                <div class="order-text">{{currentGameDim}}&#215;{{currentGameDim}}</div>
                <div class="order-add" :class="{disabled: currentGameDim===9}" @click="orderAdd" title="increase order"></div>
            </div>
            <a class="new-game-btn" @mouseover='newGameIcon="\u27F3"' @mouseout='newGameIcon="\u21BB"'
               title="new game"
               @click="newGame">{{newGameIcon}}
            </a>
        </div>
        <div class="row  no-gutters">
            <div class="col-0 col-sm-0 col-md-2 col-lg-3 col-xl"></div>
            <div class="col-12 col-sm-8 col-md-8 col-lg-6 col-xl game">
                <div class="game-over" v-if="gameOver">
                    Game over!<br>
                    <a class="restart" @click="newGame">Try again</a>
                </div>
                <div class="row  no-gutters" v-for="number1 in numbers">
                    <div class="col" v-for="number2 in number1">
                        <number  ref="number" :number="number2" :view-width="viewWidth"
                                 :action="action" :duration="duration">
                        </number>
                    </div>
                </div>
                <rate-feedback id="rate-feedback" class="d-block d-sm-none d-md-block" dialogTag="normal"></rate-feedback>
            </div>
            <div class="col-0 col-sm-4 col-md-2 col-lg-3 col-xl">
                <div class="heading-sm d-none d-sm-block d-md-none">
                    <div class="title-sm">2048</div>
                    <div>
                        <div class="score-sm">
                            SCORE
                            <tween-number :number="score" :duration="200"></tween-number>
                        </div>
                        <div class="best-score-sm">
                            BEST
                            <tween-number :number="bestScore" :duration="200"></tween-number>
                        </div>
                    </div>
                    <div class="order-action-sm">
                        <div class="order-minus-sm" :class="{disabled: currentGameDim===4}" @click="orderMinus" title="decrease order"></div>
                        <div class="order-text-sm">{{currentGameDim}}&#215;{{currentGameDim}}</div>
                        <div class="order-add-sm" :class="{disabled: currentGameDim===9}" @click="orderAdd" title="increase order"></div>
                    </div>
                    <div class="new-game-btn-sm-area">
                        <a class="new-game-btn-sm" @mouseover='newGameIcon="\u27F3"' @mouseout='newGameIcon="\u21BB"'
                           title="new game"
                           @click="newGame">{{newGameIcon}}
                        </a>
                    </div>
                </div>
                <div class="tip-sm d-none d-sm-block d-md-none">
                    Tips: use &larr; &uarr; &rarr; &darr; to play!
                </div>
                <rate-feedback id="rate-feedback-sm" class="d-none d-sm-block d-md-none" dialogTag="small"></rate-feedback>
            </div>
        </div>
        <div class="tip d-block d-sm-none d-md-block">
            Tips: use &larr; &uarr; &rarr; &darr; to play!
        </div>
    </div>
</template>

<script>
    import number from "./number";
    import tweenNumber from "./tween-number";
    import arrowKeyboard from "./arrow-keyboard";
    import rateFeedback from "./rate-feedback";
    import _ from "lodash";
    let GAME_DIM = 4;
    function  initTwoDimArray(x, y){
        let a=new Array(x);
        for(let i=0;i<x;i++){
            a[i]=new Array(y);
        }
        for(let i=0; i<x; i++){
            for(let j=0; j<y; j++){
                a[i][j] = 0;
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
    function fixCopyTwoDimArray(copyArray, x, y) {
        let a = initTwoDimArray(x, y);
        for(let i=0; i<x; i++){
            for(let j=0; j<y; j++){
                a[i][j]=Math.floor(copyArray[i][j]);
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
    function right(a, stone) {
        let score = 0;
        let haveAdd = false;
        let haveChanged = false;
        let numbers = copyTwoDimArray(a, GAME_DIM, GAME_DIM);
        let needAddMove = initTwoDimArray(GAME_DIM, GAME_DIM);
        let needMove = initTwoDimArray(GAME_DIM, GAME_DIM);
        for(let i=0; i<GAME_DIM; i++) {
            for (let j = GAME_DIM - 1; j >= 1;) {
                if (numbers[i][j] !== 0 && stone[i] === j){
                    if ((0|numbers[i][j]) === (0|numbers[i][j-1])){
                        needAddMove[i][j] = 1;
                        score += (0|numbers[i][j]);
                        numbers[i][j] = 2*numbers[i][j];
                        numbers[i][j-1] = 0;
                        haveChanged = true;
                        haveAdd = true;
                        stone[i] = j-1;
                        j-=2;
                    }
                    else if ((0|numbers[i][j-1]) !== 0){
                        stone[i] = j-1;
                        j--;
                    }
                    else {
                        j--;
                    }
                }
                else {
                    if (numbers[i][j] === 0 && numbers[i][j-1] !== 0) {
                        needMove[i][j] = 1;
                        numbers[i][j] = numbers[i][j-1];
                        numbers[i][j-1] = 0;
                        haveChanged = true;
                    }
                    j--;
                }
            }
        }
        for(let i=0; i<GAME_DIM; i++) {
            for (let j = 0; j < GAME_DIM; j++) {
                if (needMove[i][j] === 1 && numbers[i][j] !== 0) {
                    if (numbers[i][j] === a[i][j]) {
                        numbers[i][j] = numbers[i][j]+0.001;
                    }
                    else if (numbers[i][j] === 2*a[i][j] && needAddMove[i][j] !== 1) {
                        numbers[i][j] = numbers[i][j]+0.001;
                    }
                }
            }
        }
        return {numbers, haveChanged, haveAdd, score};
    }
    function left(a, stone) {
        let  haveAdd = false;
        let  haveChanged = false;
        let  score = 0;
        let  numbers = copyTwoDimArray(a, GAME_DIM, GAME_DIM);
        let  needAddMove = initTwoDimArray(GAME_DIM, GAME_DIM);
        let  needMove = initTwoDimArray(GAME_DIM, GAME_DIM);
        for(let i=0; i<GAME_DIM; i++) {
            for (let j = 0; j < GAME_DIM-1;) {
                if (numbers[i][j] !== 0 && stone[i] === j) {
                    if ((0|numbers[i][j]) === (0|numbers[i][j+1])) {
                        needAddMove[i][j] = 1;
                        score+=(0|numbers[i][j]);
                        numbers[i][j] = 2*numbers[i][j];
                        numbers[i][j+1] = 0;
                        haveChanged = true;
                        haveAdd = true;
                        stone[i] = j+1;
                        j+=2;
                    }
                    else if ((0|numbers[i][j+1]) !== 0){
                        stone[i] = j+1;
                        j++;
                    }
                    else {
                        j++;
                    }
                }
                else{
                    if (numbers[i][j] === 0 && numbers[i][j+1] !== 0) {
                        needMove[i][j] = 1;
                        numbers[i][j] = numbers[i][j+1];
                        numbers[i][j+1] = 0;
                        haveChanged = true;
                    }
                    j++;
                }
            }
        }
        for(let i=0; i<GAME_DIM; i++) {
            for (let j = 0; j < GAME_DIM; j++) {
                if (needMove[i][j] === 1 && numbers[i][j] !== 0) {
                    if (numbers[i][j] === a[i][j]) {
                        numbers[i][j] = numbers[i][j]+0.001;
                    }
                    else if (numbers[i][j] === 2*a[i][j] && needAddMove[i][j] !== 1) {
                        numbers[i][j] = numbers[i][j]+0.001;
                    }
                }
            }
        }
        return {numbers, haveChanged, haveAdd, score};
    }
    function down(a, stone) {
        let  haveAdd = false;
        let  haveChanged = false;
        let  score = 0;
        let  numbers = copyTwoDimArray(a, GAME_DIM, GAME_DIM);
        let  needAddMove = initTwoDimArray(GAME_DIM, GAME_DIM);
        let  needMove = initTwoDimArray(GAME_DIM, GAME_DIM);
        for(let i=0; i<GAME_DIM; i++) {
            for (let j = GAME_DIM - 1; j >= 1;) {
                if (numbers[j][i] !== 0 && stone[i] === j) {
                    if ((0|numbers[j][i]) === (0|numbers[j-1][i])) {
                        needAddMove[j][i] = 1;
                        score += (0|numbers[j][i]);
                        numbers[j][i] = 2*numbers[j][i];
                        numbers[j-1][i] = 0;
                        haveChanged = true;
                        haveAdd = true;
                        stone[i] = j-1;
                        j-=2;
                    }
                    else if ((0|numbers[j-1][i]) !== 0) {
                        stone[i] = j-1;
                        j--;
                    }
                    else {
                        j--;
                    }
                }
                else{
                    if ( numbers[j][i] === 0 && numbers[j-1][i] !== 0) {
                        needMove[j][i] = 1;
                        numbers[j][i] = numbers[j-1][i];
                        numbers[j-1][i] = 0;
                        haveChanged = true;
                    }
                    j--;
                }
            }
        }
        for(let i=0; i<GAME_DIM; i++) {
            for (let j = 0; j < GAME_DIM; j++) {
                if (needMove[j][i] === 1 && numbers[j][i] !== 0) {
                    if (numbers[j][i] === a[j][i]) {
                        numbers[j][i] = numbers[j][i]+0.001;
                    }
                    else if (numbers[j][i] === 2*a[j][i] && needAddMove[j][i] !== 1) {
                        numbers[j][i] = numbers[j][i]+0.001;
                    }
                }
            }
        }
        return {numbers, haveChanged, haveAdd, score};
    }
    function up(a, stone) {
        let  haveAdd = false;
        let  haveChanged = false;
        let  score = 0;
        let  numbers = copyTwoDimArray(a, GAME_DIM, GAME_DIM);
        let  needAddMove = initTwoDimArray(GAME_DIM, GAME_DIM);
        let  needMove = initTwoDimArray(GAME_DIM, GAME_DIM);
        for(let i=0; i<GAME_DIM; i++) {
            for (let j = 0; j < GAME_DIM-1;) {
                if (numbers[j][i] !== 0 && stone[i] === j) {
                    if ((0|numbers[j][i]) === (0|numbers[j+1][i])) {
                        needAddMove[j][i] = 1;
                        score+=(0|numbers[j][i]);
                        numbers[j][i] = 2*numbers[j][i];
                        numbers[j+1][i] = 0;
                        haveChanged = true;
                        haveAdd = true;
                        stone[i] = j+1;
                        j+=2;
                    }
                    else if ((0|numbers[j+1][i]) !== 0) {
                        stone[i] = j+1;
                        j++;
                    }
                    else {
                        j++;
                    }
                }
                else{
                    if (numbers[j][i] === 0 && numbers[j+1][i] !== 0) {
                        needMove[j][i] = 1;
                        numbers[j][i] = numbers[j+1][i];
                        numbers[j+1][i] = 0;
                        haveChanged = true;
                    }
                    j++;
                }
            }
        }
        for(let i=0; i<GAME_DIM; i++) {
            for (let j = 0; j < GAME_DIM; j++) {
                if (needMove[j][i] === 1 && numbers[j][i] !== 0) {
                    if (numbers[j][i] === a[j][i]) {
                        numbers[j][i] = numbers[j][i]+0.001;
                    }
                    else if (numbers[j][i] === 2*a[j][i] && needAddMove[j][i] !== 1) {
                        numbers[j][i] = numbers[j][i]+0.001;
                    }
                }
            }
        }
        return {numbers, haveChanged, haveAdd, score};
    }
    function randomFill(numbers){
        let numbersZeroCount = arrZeroCount(numbers);
        let randomNumber = 2;
        if (numbersZeroCount>GAME_DIM * GAME_DIM){
            randomNumber = _.random(1,2)===1?4:2;
        }
        else{
            randomNumber = _.random(1,2)*_.random(1,2)===1?4:2;
        }
        let randomIndex = _.random(0, GAME_DIM * GAME_DIM - 1);
        let yIndex = randomIndex%GAME_DIM;
        let xIndex = (randomIndex - yIndex)/GAME_DIM%GAME_DIM;
        let count = 0;
        for(;count < GAME_DIM * GAME_DIM;){
            if (numbers[xIndex][yIndex] === 0){
                numbers[xIndex][yIndex] = randomNumber;
                break;
            }
            else{
                count++;
                yIndex += 1;
                let tmp_y = yIndex%GAME_DIM;
                xIndex += (yIndex - tmp_y)/GAME_DIM;
                xIndex = xIndex%GAME_DIM;
                yIndex = tmp_y;
            }
        }
        return numbers;
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
    export default {
        name: "game",
        data: function (){
            let initData= initTwoDimArray(GAME_DIM, GAME_DIM);
            for(let i=0; i<2; i++){
                initData = randomFill(initData);
            }
            return {
                newGameIcon: "\u21BB",
                action: "",
                duration: 1,
                currentGameDim: GAME_DIM,
                numbers: initData,
                score: 0,
                bestScore: 0,
                gameOver: false,
                viewWidth: document.body.clientWidth, //only just one element can receive resize event, so use viewWidth to notify others
            }
        },
        methods: {
            newGame: function (){
                this.gameOver = false;
                this.score = 0;
                let initData=initTwoDimArray(GAME_DIM, GAME_DIM);
                for(let i=0; i<2; i++){
                    initData = randomFill(initData);
                }
                this.numbers = initData;
                this.storeDataToHistory();
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
            storeDataToHistory: function () {
                let store = {
                    numbers: this.numbers,
                    score: this.score,
                    bestScore: this.bestScore,
                    gameOver: this.gameOver,
                    currentGameDim: this.currentGameDim,
                };
                localStorage.setItem("_2048_game_data", JSON.stringify(store));
            },
            restoreDataFromHistory: function () {
                let data = localStorage.getItem("_2048_game_data");
                if (data) {
                    let {numbers, score, bestScore, gameOver, currentGameDim} = JSON.parse(data);
                    if (typeof(currentGameDim) !== "undefined") {
                        this.score = score;
                        this.bestScore = bestScore;
                        this.gameOver = gameOver;
                        this.currentGameDim = currentGameDim;
                        GAME_DIM = currentGameDim;
                        this.numbers = numbers;
                    }
                }
            },
            startAction: function(calOP, duration, haveChanged, haveAdd, score, stone, resolve){
                let calResult = calOP(this.numbers, stone);
                haveChanged = haveChanged || calResult.haveChanged;
                haveAdd = haveAdd || calResult.haveAdd;
                score += calResult.score;
                this.score += calResult.score;
                this.numbers = calResult.numbers;
                let _this = this;
                if (calResult.haveChanged) {
                    _.delay(function () {
                        _this.startAction(calOP, duration, haveChanged, haveAdd, score, stone, resolve);
                    }, duration);
                }
                else{
                    resolve(haveChanged, haveAdd, score);
                }
            },
            addNew: function(duration, resolve){
                this.numbers = copyTwoDimArray(randomFill(this.numbers), GAME_DIM, GAME_DIM);
                _.delay(function () {
                    resolve();
                }, duration);
            },
            playAddAudio: function(score) {
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
                oscillator.frequency.value = 300+Math.log2(score)*100;
                gainNode.gain.setValueAtTime(0, this.audioCtx.currentTime);
                gainNode.gain.linearRampToValueAtTime(1, this.audioCtx.currentTime + 0.01);
                oscillator.start(this.audioCtx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 1);
                oscillator.stop(this.audioCtx.currentTime + 1);
            },
            keyboardOP: function (calOP, direction) {
                let _this = this;
                let baseTime = 70;
                let stone = initStone(direction);
                if (typeof(_this.inMoveing) !== "undefined"){
                    return;
                }
                _this.inMoveing = true;
                _this.action = direction;
                _this.duration = baseTime-GAME_DIM*5;
                _this.startAction(calOP, _this.duration, false, false, 0, stone, function (c, a, s) {
                    if (c) {
                        if (a) {
                            _this.playAddAudio(s);
                        }
                        _this.action = "new";
                        _this.duration = 200;
                        _this.addNew(_this.duration, function () {
                            _this.action = "";
                            _this.numbers = fixCopyTwoDimArray(_this.numbers, GAME_DIM, GAME_DIM);
                            _this.storeDataToHistory();
                            delete _this.inMoveing;
                        });
                    }
                    else{
                        _this.action = "";
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
                let keyCode = e.key;
                if(keyCode === "ArrowLeft"){
                    this.keyLeft();
                }
                else if (keyCode === "ArrowRight"){
                    this.keyRight();
                }
                else if (keyCode === "ArrowUp"){
                    this.keyUp();
                }
                else if (keyCode === "ArrowDown"){
                    this.keyDown();
                }
            }
        },
        watch: {
            score: function (val) {
                this.bestScore = val>this.bestScore?val:this.bestScore;
            },
            currentGameDim: function (val) {
                if (GAME_DIM !== val) {
                    GAME_DIM = val;
                    this.newGame();
                }
            }
        },
        created: function(){
            document.onkeyup = this.keyboardAction;
            this.restoreDataFromHistory();
        },
        mounted: function(){
            let _this = this;
            window.onresize = _.debounce(()=>{
                _this.viewWidth = document.body.clientWidth;
            }, 50);
        },
        components: {
            tweenNumber,
            number,
            arrowKeyboard,
            rateFeedback,
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
        text-align: center;
        user-select: none;
    }
    .heading .title {
        display: inline-block;
        text-align: left;
        padding-right: 1%;
        color: #776e65;
        font-size: 40px;
        font-weight: bold;
        vertical-align: middle;
    }
    .heading .score {
        display: inline-block;
        width: 80px;
        background: #bbada0;
        font-weight: bold;
        font-size: 10px;
        border-radius: 3px 3px 3px 3px;
        color: white;
        text-align: center;
        vertical-align: middle;
    }
    .heading .best-score {
        display: inline-block;
        width: 80px;
        background: #bbada0;
        font-weight: bold;
        font-size: 10px;
        border-radius: 3px 3px 3px 3px;
        color: white;
        text-align: center;
        vertical-align: middle;
    }
    .heading .order-action{
        display: inline-block;
        width: 50px;
        height: 36px;
        margin-left: 1%;
        font-weight: bold;
        line-height: 36px;
        color: #776e65;
        text-align: center;
        vertical-align: middle;
    }
    .heading .order-text{
        display: block;
        font-size: 17px;
        height: 20px;
        line-height: 20px;
    }
    .heading .order-minus{
        display: block;
        margin: 0;
        padding: 0;
        width: 0;
        height: 0;
        border-bottom: 8px solid  #776e65;
        border-left: 25px solid transparent ;
        border-right: 25px solid transparent ;
        cursor: pointer;
    }
    .heading .order-add{
        display: block;
        margin: 0;
        padding: 0;
        width: 0;
        height: 0;
        border-top: 8px solid  #776e65;
        border-left: 25px solid transparent ;
        border-right: 25px solid transparent ;
        cursor: pointer;
    }
    .heading .order-action .disabled{
        border-bottom-color: #b0a597;
        border-top-color: #b0a597;
        cursor: default;
    }
    .heading .order-action .disabled:hover{
        border-bottom-color: #b0a597;
        border-top-color: #b0a597;
    }
    .heading .order-minus:hover{
        border-bottom-color: #FF5432;
    }
    .heading .order-add:hover{
        border-top-color: #FF5432;
    }
    .heading .new-game-btn{
        display: inline-block;
        width: 30px;
        height: 36px;
        font-weight: bold;
        font-size: 25px;
        line-height: 36px;
        color: #776e65;
        text-align: center;
        vertical-align: middle;
        cursor: pointer;
    }
    .game-over {
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
        z-index: 2;
        border-radius: 1%;
    }
    .game-over .restart {
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
        right:0;
        bottom: -30px;
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
        text-align: center;
        user-select: none;
    }
    .heading-sm .title-sm {
        text-align: center;
        color: #776e65;
        font-size: 40px;
        font-weight: bold;
    }
    .heading-sm .score-sm {
        display: inline-block;
        width: 90px;
        background: #bbada0;
        font-weight: bold;
        font-size: 10px;
        border-radius: 3px 3px 3px 3px;
        color: white;
        text-align: center;
        vertical-align: middle;
    }
    .heading-sm .best-score-sm {
        display: inline-block;
        width:  90px;
        background: #bbada0;
        font-weight: bold;
        font-size: 10px;
        border-radius: 3px 3px 3px 3px;
        color: white;
        text-align: center;
        vertical-align: middle;
    }
    .heading-sm .order-action-sm{
        display: block;
        margin-top: 20px;
        height: 36px;
        font-size: 20px;
        text-align: center;
        vertical-align: middle;
    }
    .heading-sm .order-text-sm{
        display: inline-block;
        height: 36px;
        font-size: 30px;
        font-weight: bold;
        color: #776e65;
        line-height: 36px;
        vertical-align: middle;
    }
    .heading-sm .order-minus-sm{
        display: inline-block;
        margin: 0;
        padding: 0;
        width: 0;
        height: 0;
        border-right: 9px solid  #776e65;
        border-top: 18px solid transparent ;
        border-bottom: 18px solid transparent ;
        cursor: pointer;
        vertical-align: middle;
    }
    .heading-sm .order-add-sm{
        display: inline-block;
        margin: 0;
        padding: 0;
        width: 0;
        height: 0;
        border-left: 9px solid  #776e65;
        border-top: 18px solid transparent ;
        border-bottom: 18px solid transparent ;
        cursor: pointer;
        vertical-align: middle;
    }
    .heading-sm .order-minus-sm:hover{
        border-right-color: #FF5432;
    }
    .heading-sm .order-add-sm:hover{
        border-left-color: #FF5432;
    }
    .heading-sm .order-action-sm  .disabled{
        border-left-color: #b0a597;
        border-right-color: #b0a597;
        cursor: default;
    }
    .heading-sm  .order-action-sm  .disabled:hover{
        border-left-color: #b0a597;
        border-right-color: #b0a597;
    }
    .new-game-btn-sm-area{
        margin-top: 60px;
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
    #rate-feedback-sm{
        position: absolute;
        left:0;
        right: 0;
        bottom: 0;
        text-align: center;
    }
</style>