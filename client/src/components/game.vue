<template>
    <div @touchstart="touchAction"
         @touchmove="touchAction"
         @touchend="touchAction"
    >
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
        </div>
        <div class="row  no-gutters">
            <div class="col-0 col-sm-0 col-md-2 col-lg-3 col-xl"></div>
            <div class="col-12 col-sm-8 col-md-8 col-lg-6 col-xl">
                <div class="game-over" v-if="gameOver">
                    Game over!<br>
                    <a class="restart" @click="newGame">Try again</a>
                </div>
                <div class="row  no-gutters" v-for="number1 in numbers">
                    <div class="col" v-for="number2 in number1">
                        <number  ref="number" :number="number2" :view-width="viewWidth"></number>
                    </div>
                </div>
            </div>
            <div class="col-0 col-sm-4 col-md-2 col-lg-3 col-xl">
                <div class="heading-sm d-none d-sm-block d-md-none">
                    <div class="title-sm">2048</div>
                    <div class="score-sm">
                        SCORE
                        <tween-number :number="score" :duration="200"></tween-number>
                    </div>
                    <div class="best-score-sm">
                        BEST
                        <tween-number :number="bestScore" :duration="200"></tween-number>
                    </div>
                </div>
                <div class="tip-sm d-none d-sm-block d-md-none">
                    Tips: use &larr; &uarr; &rarr; &darr; to play!
                </div>
                <!--
                <div class="arrow-keyboard-sm d-none d-sm-block d-md-none">
                    <arrowKeyboard
                            @down-click="keyDown"
                            @up-click="keyUp"
                            @left-click="keyLeft"
                            @right-click="keyRight">
                    </arrowKeyboard>
                </div>
                -->
            </div>
        </div>
        <div class="tip d-block d-sm-none d-md-block">
            Tips: use &larr; &uarr; &rarr; &darr; to play!
        </div>
        <!--
        <div class="arrow-keyboard d-block d-sm-none">
            <arrowKeyboard
                    @down-click="keyDown"
                    @up-click="keyUp"
                    @left-click="keyLeft"
                    @right-click="keyRight">
            </arrowKeyboard>
        </div>
        -->
    </div>
</template>

<script>
    import number from "./number";
    import tweenNumber from "./tween-number";
    import arrowKeyboard from "./arrow-keyboard";
    import _ from "lodash";

    const GAME_DIM = 4;

    function compactRight(numbers) {
        let haveChanged = false;

        for(let i=0; i<GAME_DIM; i++){
            let haveSort = false;
            do {
                haveSort = false;
                let latestZeroIndex = 0;
                for (let j = GAME_DIM - 1; j >= 0; j--) {
                    if (numbers[i][j] === 0 && j > latestZeroIndex) {
                        latestZeroIndex = j;
                    }
                    else if (numbers[i][j] !== 0) {
                        if (latestZeroIndex > j) {
                            numbers[i][latestZeroIndex] = numbers[i][j];
                            numbers[i][j] = 0;
                            haveSort = true;
                            haveChanged = true;
                            break;
                        }
                    }
                }
            }while(haveSort);
        }

        return haveChanged;
    }

    function right(numbers) {
        let score = 0;
        let haveChanged = compactRight(numbers);

        for(let i=0; i<GAME_DIM; i++){
            for(let j=GAME_DIM-1; j>0; ){
                if (numbers[i][j] !== 0){
                    if (numbers[i][j] == numbers[i][j-1]){
                        numbers[i][j-1] = 2*numbers[i][j];
                        numbers[i][j] = 0;
                        score += numbers[i][j-1];
                        j-=2;
                        haveChanged = true;
                    }
                    else{
                        j--;
                    }
                }
                else{
                    j--;
                }
            }
        }

        compactRight(numbers);
        return {numbers, haveChanged, score};
    }

    function compactLeft(numbers) {
        let  haveChanged = false;

        for(let i=0; i<GAME_DIM; i++){
            let haveSort = false;
            do {
                haveSort = false;
                let latestZeroIndex = GAME_DIM - 1;
                for (let j = 0; j < GAME_DIM; j++) {
                    if (numbers[i][j] === 0 && j < latestZeroIndex) {
                        latestZeroIndex = j;
                    }
                    else if (numbers[i][j] !== 0) {
                        if (latestZeroIndex < j) {
                            numbers[i][latestZeroIndex] = numbers[i][j];
                            numbers[i][j] = 0;
                            haveSort = true;
                            haveChanged = true;
                            break;
                        }
                    }
                }
            }while(haveSort);
        }

        return haveChanged;
    }

    function left(numbers) {
        let  haveChanged = compactLeft(numbers);
        let  score = 0;

        for(let i=0; i<GAME_DIM; i++){
            for(let j=0; j<GAME_DIM&&j+1<GAME_DIM; ){
                if (numbers[i][j] !== 0){
                    if (numbers[i][j] == numbers[i][j+1]){
                        numbers[i][j+1] = 2*numbers[i][j];
                        numbers[i][j] = 0;
                        score+=numbers[i][j+1];
                        j+=2;
                        haveChanged = true;
                    }
                    else{
                        j++;
                    }
                }
                else{
                    j++;
                }
            }
        }

        compactLeft(numbers);
        return {numbers, haveChanged, score};
    }

    function compactDown(numbers) {
        let  haveChanged = false;

        for(let i=0; i<GAME_DIM; i++){
            let haveSort = false;
            do {
                haveSort = false;
                let latestZeroIndex = 0;
                for(let j=GAME_DIM-1; j>=0; j--){
                    if (numbers[j][i] === 0 && j > latestZeroIndex){
                        latestZeroIndex = j;
                    }
                    else if (numbers[j][i] !== 0){
                        if (latestZeroIndex > j){
                            numbers[latestZeroIndex][i] = numbers[j][i];
                            numbers[j][i] = 0;
                            haveSort = true;
                            haveChanged = true;
                            break;
                        }
                    }
                }
            }while(haveSort);
        }

        return haveChanged;
    }

    function down(numbers) {
        let  haveChanged = compactDown(numbers);
        let  score = 0;

        for(let i=0; i<GAME_DIM; i++){
            for(let j=GAME_DIM-1; j>0; ){
                if (numbers[j][i] !== 0){
                    if (numbers[j][i] == numbers[j-1][i]){
                        numbers[j-1][i] = 2*numbers[j][i];
                        numbers[j][i] = 0;
                        score += numbers[j-1][i];
                        j-=2;
                        haveChanged = true;
                    }
                    else{
                        j--;
                    }
                }
                else{
                    j--;
                }
            }
        }

        compactDown(numbers);
        return {numbers, haveChanged, score};
    }

    function compactUp(numbers) {
        let  haveChanged = false;

        for(let i=0; i<GAME_DIM; i++){
            let haveSort = false;
            do {
                haveSort = false;
                let latestZeroIndex = GAME_DIM - 1;
                for (let j = 0; j < GAME_DIM; j++) {
                    if (numbers[j][i] === 0 && j < latestZeroIndex) {
                        latestZeroIndex = j;
                    }
                    else if (numbers[j][i] !== 0) {
                        if (latestZeroIndex < j) {
                            numbers[latestZeroIndex][i] = numbers[j][i];
                            numbers[j][i] = 0;
                            haveSort = true;
                            haveChanged = true;
                            break;
                        }
                    }
                }
            }while(haveSort);
        }

        return haveChanged;
    }

    function up(numbers) {
        let  haveChanged = compactUp(numbers);
        let  score = 0;

        for(let i=0; i<GAME_DIM; i++){
            for(let j=0; j<GAME_DIM&&j+1<GAME_DIM; ){
                if (numbers[j][i] !== 0){
                    if (numbers[j][i] == numbers[j+1][i]){
                        numbers[j+1][i] = 2*numbers[j][i];
                        numbers[j][i] = 0;
                        score+=numbers[j+1][i];
                        j+=2;
                        haveChanged = true;
                    }
                    else{
                        j++;
                    }
                }
                else{
                    j++;
                }
            }
        }

        compactUp(numbers);
        return {numbers, haveChanged, score};
    }

    function randomFill(numbers) {
        let numbersZeroCount = arrZeroCount(numbers);
        let randomNumber = 2;
        if (numbersZeroCount>GAME_DIM * GAME_DIM){
            randomNumber = _.random(1,2)*_.random(1,2)==1?4:2;
        }
        else{
            randomNumber = _.random(1,2)*_.random(1,2)*_.random(1,2)==1?4:2;
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

    function changeCheck(f, numbers) {
        let numbersCP=new Array(GAME_DIM);
        for(let i=0;i<GAME_DIM;i++){
            numbersCP[i]=new Array(GAME_DIM);
        }
        for(let i=0; i<GAME_DIM; i++){
            for(let j=0; j<GAME_DIM; j++){
                numbersCP[i][j]=numbers[i][j];
            }
        }
        let {haveChanged} = f(numbersCP);
        return haveChanged;
    }

    function checkGameOver(numbers) {
        if (arrZeroCount(numbers) !== 0){
            return false;
        }

        return !(changeCheck(up, numbers) || changeCheck(down, numbers) || changeCheck(right, numbers) || changeCheck(left, numbers));
    }

    export default {
        name: "game",
        data: function (){
            let initData=new Array(GAME_DIM);
            for(let i=0;i<GAME_DIM;i++){
                initData[i]=new Array(GAME_DIM);
            }
            for(let i=0; i<GAME_DIM; i++){
                for(let j=0; j<GAME_DIM; j++){
                    initData[i][j] = 0;
                }
            }
            for(let i=0; i<2; i++){
                initData = randomFill(initData);
            }
            return {
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
                for(let i=0; i<GAME_DIM; i++){
                    for(let j=0; j<GAME_DIM; j++){
                        this.numbers[i][j]=0;
                    }
                }
                for(let i=0; i<2; i++){
                    this.numbers = randomFill(this.numbers);
                }
                this.numbers = Object.assign({}, this.numbers);
            },
            storeDataToHistory: function () {
                let store = {
                    numbers: this.numbers,
                    score: this.score,
                    bestScore: this.bestScore,
                    gameOver: this.gameOver,
                };
                localStorage.setItem("_2048_game_data", JSON.stringify(store));
            },
            restoreDataFromHistory: function () {
                let data = localStorage.getItem("_2048_game_data");
                if (data) {
                    let {numbers, score, bestScore, gameOver} = JSON.parse(data);
                    this.score = score;
                    this.bestScore = bestScore;
                    this.gameOver = gameOver;
                    this.numbers = Object.assign({}, numbers);
                }
            },
            keyboardOP: function (op) {
                let {numbers, haveChanged, score} = op(this.numbers);
                this.numbers = Object.assign({}, numbers);
                this.score += score;
                if (haveChanged){
                    let _this = this;
                    _.delay(function () {
                        _this.numbers = Object.assign({}, randomFill(_this.numbers));
                        _this.storeDataToHistory();
                    }, 300);
                }
                else {
                    if (!this.gameOver){
                        this.gameOver = checkGameOver(numbers);
                        _this.storeDataToHistory();
                    }
                }
            },
            keyDown: function () {
                this.keyboardOP(down);
            },
            keyUp: function () {
                this.keyboardOP(up);
            },
            keyLeft: function () {
                this.keyboardOP(left);
            },
            keyRight: function () {
                this.keyboardOP(right);
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
            }())
        },
        watch: {
            score: function (val) {
                this.bestScore = val>this.bestScore?val:this.bestScore;
            }
        },
        created: function(){
            let _this = this;
            document.onkeyup = function (e) {
                let keyCode = e.key;
                if(keyCode == "ArrowLeft"){
                    _this.keyLeft();
                }
                else if (keyCode == "ArrowRight"){
                    _this.keyRight();
                }
                else if (keyCode == "ArrowUp"){
                    _this.keyUp();
                }
                else if (keyCode == "ArrowDown"){
                    _this.keyDown();
                }
            }
            _this.restoreDataFromHistory();
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
}

.heading .title {
    display: inline-block;
    text-align: left;
    padding-right: 3%;
    color: #776e65;
    font-size: 40px;
    font-weight: bold;
    vertical-align: middle;
}

.heading .score {
    display: inline-block;
    width: 100px;
    background: #bbada0;
    font-weight: bold;
    font-size: 10px;
    border-radius: 5%;
    color: white;
    text-align: center;
    vertical-align: middle;
}

.heading .best-score {
    display: inline-block;
    width: 100px;
    background: #bbada0;
    font-weight: bold;
    font-size: 10px;
    border-radius: 5%;
    color: white;
    text-align: center;
    vertical-align: middle;
}

.game-over {
    position: absolute;
    left:0px;
    right: 0px;
    top: 0px;
    bottom: 0px;
    margin: auto;
    text-align: center;
    font-weight: bold;
    font-size: 50px;
    color: #776e65;
    padding-top: 50%;
    background-color: rgba(192,192,192,0.8);
    z-index: 1;
    border-radius: 1%;
}

.game-over .restart {
    padding: 1%;
    font-weight: bold;
    font-size: 18px;
    color: rgba(255,255,255,1);
    background-color: #8f7a66;
    border-radius: 5%;
    cursor: pointer;
}

.arrow-keyboard {
    text-align: center;
    margin: 0 0 0 0;
    padding: 0 0 0 0;
}

.arrow-keyboard-sm{
    text-align: center;
    margin: 0 0 0 0;
    padding: 0 0 0 0;
}

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
    border-radius: 5%;
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
    border-radius: 5%;
    color: white;
    text-align: center;
    vertical-align: middle;
}

.tip-sm {
    padding: 0 0 0 0;
    margin: 100% 0 0 0;
    text-align: center;
    font-size: 14px;
    font-weight: bold;
    color: #776e65;
}
</style>