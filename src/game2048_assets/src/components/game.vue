<template>
  <div @touchstart="touchAction"
       @touchmove="touchAction"
       @touchend="touchAction">
    <div class="heading d-block d-sm-none d-md-block">
      <div class="title">
        <identity class="identity"/>
      </div>
      <div class="score">
        {{ $t('score') }}
        <tween-number :number="score" :duration="200"></tween-number>
      </div>
      <div class="best-score">
        {{ $t('best') }}
        <tween-number :number="bestScore" :duration="200"></tween-number>
      </div>
      <div class="order-action">
        <div class="order-minus" :class="{disabled: currentGameDim===4}" @click="orderMinus"
             :title="$t('decrease')"></div>
        <div class="order-text">{{ currentGameDim }}&#215;{{ currentGameDim }}</div>
        <div class="order-add" :class="{disabled: currentGameDim===9}" @click="orderAdd" :title="$t('increase')"></div>
      </div>
      <a class="new-game-btn" title="new game" @click="newGame">
        &#10227;
      </a>
    </div>
    <div class="row  no-gutters">
      <div class="col-0 col-sm-0 col-md-3 col-lg-3 col-xl"></div>
      <div class="col-12 col-sm-8 col-md-6 col-lg-6 col-xl game">
        <div class="game-over" v-if="gameOver">
          {{ $t('over') }}<br>
          <a class="restart" @click="newGame">{{ $t('again') }}</a>
        </div>
        <div class="row  no-gutters" v-for="row in rowCol">
          <div class="col" v-for="rc in row">
            <number ref="number" :number="numbers[rc.row][rc.col]" :view-width="viewWidth"
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
               :title='$t("mode")'
               @mouseover="challengeModeNavMouseOver"
               @mouseout="challengeModeNavMouseOut"
               @click="challengeModeNavMouseClick">
            &#10152;
          </div>
          <radio-toggle class="radio-toggle" v-model="radioStat"></radio-toggle>
        </div>
      </div>
      <div class="col-0 col-sm-4 col-md-3 col-lg-3 col-xl">
        <div class="heading-sm d-none d-sm-block d-md-none">
          <div class="title-sm">
            <identity class="identity-sm"/>
          </div>
          <div class="score-area">
            <div class="score-sm">
              {{ $t('score') }}
              <tween-number :number="score" :duration="200"></tween-number>
            </div>
            <div class="best-score-sm">
              {{ $t('best') }}
              <tween-number :number="bestScore" :duration="200"></tween-number>
            </div>
          </div>
          <div class="order-action-sm">
            <div class="order-minus-sm" :class="{disabled: currentGameDim===4}" @click="orderMinus"
                 :title="$t('decrease')"></div>
            <div class="order-text-sm">{{ currentGameDim }}&#215;{{ currentGameDim }}</div>
            <div class="order-add-sm" :class="{disabled: currentGameDim===9}" @click="orderAdd"
                 :title="$t('increase')"></div>
          </div>
          <div class="new-game-btn-sm-area">
            <a class="new-game-btn-sm" title="new game" @click="newGame">
              &#10227;
            </a>
          </div>
        </div>
        <div class="tip-sm d-none d-sm-block d-md-none">
          {{ $t('left') }} &larr; &uarr; &rarr; &darr; {{ $t('right') }}!
        </div>
        <div id="last-line-sm" class="d-none d-sm-block d-md-none">
          <div id="last-line-container-sm">
            <rate-feedback id="rate-feedback-sm" dialogTag="small"></rate-feedback>
            <div class="challenge-mode-navigate-sm">
              <div data-toggle="tooltip"
                   data-placement="bottom"
                   trigger="manual"
                   :title='$t("mode")'
                   @mouseover="challengeModeNavMouseOverSM"
                   @mouseout="challengeModeNavMouseOutSM"
                   @click="challengeModeNavMouseClickSM">
                &#10152;
              </div>
              <radio-toggle class="radio-toggle-sm" v-model="radioStat"></radio-toggle>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="tip d-block d-sm-none d-md-block">
      {{ $t('left') }} &larr; &uarr; &rarr; &darr; {{ $t('right') }}
    </div>
  </div>
</template>

<i18n>
{
  "ar": {
    "left": "نصائح: استخدام",
    "right": "للعب!",
    "score": "أحرز هدفا",
    "best": "الأفضل",
    "over": "انتهت اللعبة!",
    "again": "حاول مرة أخري",
    "mode": "وضع التحدي",
    "decrease": "انخفاض الطلب",
    "increase": "زيادة الطلب"
  },
  "ko": {
    "left": "팁 : 사용",
    "right": "놀아라!",
    "score": "점수",
    "best": "베스트",
    "over": "게임 끝!",
    "again": "다시 시도하십시오.",
    "mode": "챌린지 모드",
    "decrease": "질서를 낮추다",
    "increase": "주문을 늘리다"
  },
  "de": {
    "left": "Tipps: verwenden",
    "right": "spielen!",
    "score": "ERGEBNIS",
    "best": "BESTE",
    "over": "Spiel ist aus!",
    "again": "Versuchen Sie es nochmal",
    "mode": "Herausforderungsmodus",
    "decrease": "Reihenfolge verringern",
    "increase": "Reihenfolge erhöhen"
  },
  "ru": {
    "left": "Советы: используйте",
    "right": "играть!",
    "score": "ГОЛ",
    "best": "ЛУЧШИЙ",
    "over": "Игра окончена!",
    "again": "Попробуйте снова",
    "mode": "Режим соревнования",
    "decrease": "уменьшить порядок",
    "increase": "увеличить заказ"
  },
  "fr": {
    "left": "Astuces: utiliser",
    "right": "jouer!",
    "score": "BUT",
    "best": "MEILLEUR",
    "over": "Jeu terminé!",
    "again": "Réessayer",
    "mode": "Mode Défi",
    "decrease": "ordre décroissant",
    "increase": "augmenter l'ordre"
  },
  "bn": {
    "left": "টিপস: ব্যবহার",
    "right": "খেলতে!",
    "score": "স্কোর",
    "best": "সর্বোত্তম",
    "over": "খেলা শেষ!",
    "again": "আবার চেষ্টা কর",
    "mode": "চ্যালেঞ্জ মোড",
    "decrease": "ক্রম কমানো",
    "increase": "ক্রম বৃদ্ধি"
  },
  "pt-br": {
    "left": "Dicas: use",
    "right": "jogar!",
    "score": "PONTO",
    "best": "MELHOR",
    "over": "Fim de jogo!",
    "again": "Tente novamente",
    "mode": "Modo desafio",
    "decrease": "diminuir a ordem",
    "increase": "aumentar a ordem"
  },
  "ja": {
    "left": "ヒント：使用",
    "right": "遊ぶ！",
    "score": "スコア",
    "best": "ベスト",
    "over": "ゲームオーバー！",
    "again": "再試行する",
    "mode": "チャレンジモード",
    "decrease": "降順",
    "increase": "注文を増やす"
  },
  "es": {
    "left": "Consejos: uso",
    "right": "¡jugar!",
    "score": "PUNTUACIÓN",
    "best": "MEJOR",
    "over": "¡Juego terminado!",
    "again": "Inténtalo de nuevo",
    "mode": "Modo Desafío",
    "decrease": "disminuir orden",
    "increase": "aumentar orden"
  },
  "hi": {
    "left": "सुझाव: उपयोग करें",
    "right": "खेलने के लिए!",
    "score": "स्कोर",
    "best": "श्रेष्ठ",
    "over": "खेल खत्म!",
    "again": "पुनः प्रयास करें",
    "mode": "चुनौती मोड",
    "decrease": "आदेश में कमी",
    "increase": "आदेश बढ़ाएं"
  },
  "zh-cn": {
    "left": "提示：使用",
    "right": "来玩！",
    "score": "得分",
    "best": "最高",
    "over": "游戏结束！",
    "again": "再试一次",
    "mode": "挑战模式",
    "decrease": "减少阶数",
    "increase": "增加阶数"
  },
  "zh-tw": {
    "left": "提示：使用",
    "right": "来玩！",
    "score": "得分",
    "best": "最高",
    "over": "遊戲結束！",
    "again": "再試一次",
    "mode": "挑戰模式",
    "decrease": "減少階數",
    "increase": "增加階數"
  },
  "zh-hk": {
    "left": "提示：使用",
    "right": "来玩！",
    "score": "得分",
    "best": "最高",
    "over": "遊戲結束！",
    "again": "再試一次",
    "mode": "挑戰模式",
    "decrease": "減少階數",
    "increase": "增加階數"
  },
  "en": {
    "left": "Tips: use",
    "right": "to play!",
    "score": "SCORE",
    "best": "BEST",
    "over": "Game over!",
    "again": "Try again",
    "mode": "Challenge Mode",
    "decrease": "decrease order",
    "increase": "increase order"
  }
}
</i18n>

<script>
import number from "./number";
import tweenNumber from "../common/vuecomponet/tween-number";
import arrowKeyboard from "./arrow-keyboard";
import rateFeedback from "./rate-feedback";
import radioToggle from "./radio-toggle";
import identity from "./identity";
import GaReport, {CategoryActions} from '../api/ga-report';
import _ from "lodash";

let GAME_DIM = 4;
const NEW_DURATION = 200;

function initTwoDimArray(x, y, init = 0) {
  let a = new Array(x);
  for (let i = 0; i < x; i++) {
    a[i] = new Array(y);
  }
  for (let i = 0; i < x; i++) {
    for (let j = 0; j < y; j++) {
      a[i][j] = init;
    }
  }
  return a;
}

function initRowCol(row, col) {
  let a = new Array(row);
  for (let i = 0; i < row; i++) {
    a[i] = new Array(col);
  }
  for (let i = 0; i < row; i++) {
    for (let j = 0; j < col; j++) {
      a[i][j] = {row: i, col: j};
    }
  }
  return a;
}

function copyTwoDimArray(copyArray, x, y) {
  let a = initTwoDimArray(x, y);
  for (let i = 0; i < x; i++) {
    for (let j = 0; j < y; j++) {
      a[i][j] = copyArray[i][j];
    }
  }
  return a;
}

function initStone(direction) {
  let stone = new Array(GAME_DIM);
  switch (direction) {
    case "down":
    case "right":
      for (let i = 0; i < stone.length; i++) {
        stone[i] = GAME_DIM - 1;
      }
      break;
    case "up":
    case "left":
      for (let i = 0; i < stone.length; i++) {
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
  let actions = initTwoDimArray(GAME_DIM, GAME_DIM, "");
  for (let i = 0; i < GAME_DIM; i++) {
    for (let j = GAME_DIM - 1; j >= 1;) {
      if (numbers[i][j] !== 0 && stone[i] === j) {
        if ((numbers[i][j]) === (numbers[i][j - 1])) {
          actions[i][j] = "right-double";
          actions[i][j - 1] = "hidden";
          score += 2 * numbers[i][j];
          numbers[i][j] = 2 * numbers[i][j];
          numbers[i][j - 1] = 0;
          haveChanged = true;
          haveAdd = true;
          stone[i] = j - 1;
          j--;
        } else if ((numbers[i][j - 1]) !== 0) {
          stone[i] = j - 1;
          j--;
        } else {
          j--;
        }
      } else {
        if (numbers[i][j] === 0 && numbers[i][j - 1] !== 0) {
          actions[i][j] = "right";
          actions[i][j - 1] = "hidden";
          numbers[i][j] = numbers[i][j - 1];
          numbers[i][j - 1] = 0;
          haveChanged = true;
        }
        j--;
      }
    }
  }
  return {numbers, actions, haveChanged, haveAdd, score};
}

function left(a, stone) {
  let haveAdd = false;
  let haveChanged = false;
  let score = 0;
  let numbers = copyTwoDimArray(a, GAME_DIM, GAME_DIM);
  let actions = initTwoDimArray(GAME_DIM, GAME_DIM, "");

  for (let i = 0; i < GAME_DIM; i++) {
    for (let j = 0; j < GAME_DIM - 1;) {
      if (numbers[i][j] !== 0 && stone[i] === j) {
        if ((numbers[i][j]) === (numbers[i][j + 1])) {
          actions[i][j] = "left-double";
          actions[i][j + 1] = "hidden";
          score += 2 * numbers[i][j];
          numbers[i][j] = 2 * numbers[i][j];
          numbers[i][j + 1] = 0;
          haveChanged = true;
          haveAdd = true;
          stone[i] = j + 1;
          j++;
        } else if ((numbers[i][j + 1]) !== 0) {
          stone[i] = j + 1;
          j++;
        } else {
          j++;
        }
      } else {
        if (numbers[i][j] === 0 && numbers[i][j + 1] !== 0) {
          actions[i][j] = "left";
          actions[i][j + 1] = "hidden";
          numbers[i][j] = numbers[i][j + 1];
          numbers[i][j + 1] = 0;
          haveChanged = true;
        }
        j++;
      }
    }
  }

  return {numbers, actions, haveChanged, haveAdd, score};
}

function down(a, stone) {
  let haveAdd = false;
  let haveChanged = false;
  let score = 0;
  let numbers = copyTwoDimArray(a, GAME_DIM, GAME_DIM);
  let actions = initTwoDimArray(GAME_DIM, GAME_DIM, "");

  for (let i = 0; i < GAME_DIM; i++) {
    for (let j = GAME_DIM - 1; j >= 1;) {
      if (numbers[j][i] !== 0 && stone[i] === j) {
        if ((numbers[j][i]) === (numbers[j - 1][i])) {
          actions[j][i] = "down-double";
          actions[j - 1][i] = "hidden";
          score += 2 * numbers[j][i];
          numbers[j][i] = 2 * numbers[j][i];
          numbers[j - 1][i] = 0;
          haveChanged = true;
          haveAdd = true;
          stone[i] = j - 1;
          j--;
        } else if ((numbers[j - 1][i]) !== 0) {
          stone[i] = j - 1;
          j--;
        } else {
          j--;
        }
      } else {
        if (numbers[j][i] === 0 && numbers[j - 1][i] !== 0) {
          actions[j][i] = "down";
          actions[j - 1][i] = "hidden";
          numbers[j][i] = numbers[j - 1][i];
          numbers[j - 1][i] = 0;
          haveChanged = true;
        }
        j--;
      }
    }
  }

  return {numbers, actions, haveChanged, haveAdd, score};
}

function up(a, stone) {
  let haveAdd = false;
  let haveChanged = false;
  let score = 0;
  let numbers = copyTwoDimArray(a, GAME_DIM, GAME_DIM);
  let actions = initTwoDimArray(GAME_DIM, GAME_DIM, "");

  for (let i = 0; i < GAME_DIM; i++) {
    for (let j = 0; j < GAME_DIM - 1;) {
      if (numbers[j][i] !== 0 && stone[i] === j) {
        if ((numbers[j][i]) === (numbers[j + 1][i])) {
          actions[j][i] = "up-double";
          actions[j + 1][i] = "hidden";
          score += 2 * numbers[j][i];
          numbers[j][i] = 2 * numbers[j][i];
          numbers[j + 1][i] = 0;
          haveChanged = true;
          haveAdd = true;
          stone[i] = j + 1;
          j++;
        } else if ((numbers[j + 1][i]) !== 0) {
          stone[i] = j + 1;
          j++;
        } else {
          j++;
        }
      } else {
        if (numbers[j][i] === 0 && numbers[j + 1][i] !== 0) {
          actions[j][i] = "up";
          actions[j + 1][i] = "hidden";
          numbers[j][i] = numbers[j + 1][i];
          numbers[j + 1][i] = 0;
          haveChanged = true;
        }
        j++;
      }
    }
  }

  return {numbers, actions, haveChanged, haveAdd, score};
}

function randomFill(a, zeroCount = 1) {
  let numbers = copyTwoDimArray(a, GAME_DIM, GAME_DIM);
  let actions = initTwoDimArray(GAME_DIM, GAME_DIM, "");

  for (let i = 0; i < zeroCount; i++) {
    let numbersZeroCount = arrZeroCount(numbers);
    if (numbersZeroCount === 0) {
      break;
    }
    let randomNumber = _.random(1, 2) === 1 ? 4 : 2;
    let fillIndex = _.random(1, numbersZeroCount);
    let currentIndex = 0;
    let fillSuccess = false;
    for (let xIndex = 0; xIndex < GAME_DIM && !fillSuccess; xIndex++) {
      for (let yIndex = 0; yIndex < GAME_DIM && !fillSuccess; yIndex++) {
        if (numbers[xIndex][yIndex] === 0) {
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
  for (let i = 0; i < GAME_DIM; i++) {
    for (let j = 0; j < GAME_DIM; j++) {
      if (numbers[i][j] === 0) {
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
  if (arrZeroCount(numbers) !== 0) {
    return false;
  }
  return !(changeCheck(up, numbersCP, initStone("up")) || changeCheck(down, numbersCP, initStone("down"))
      || changeCheck(right, numbersCP, initStone("right")) || changeCheck(left, numbersCP, initStone("left")));
}

export default {
  name: "game",
  data: function () {
    return {
      duration: 1,
      currentGameDim: GAME_DIM,
      rowCol: initRowCol(GAME_DIM, GAME_DIM),
      numbers: initTwoDimArray(GAME_DIM, GAME_DIM),
      actions: initTwoDimArray(GAME_DIM, GAME_DIM, ""),
      score: 0,
      bestScore: 0,
      gameOver: false,
      viewWidth: document.body.clientWidth, //only just one element can receive resize event, so use viewWidth to notify others
      radioStat: true,
    }
  },
  methods: {
    challengeModeNavMouseOver: function () {
      $('.challenge-mode-navigate div').tooltip("show");
    },
    challengeModeNavMouseOut: function () {
      $('.challenge-mode-navigate div').tooltip("hide");
    },
    challengeModeNavMouseClick: function () {
      this.$router.replace("/challenge-game");
      $('.challenge-mode-navigate div').tooltip("hide");
    },
    challengeModeNavMouseOverSM: function () {
      $('.challenge-mode-navigate-sm div').tooltip("show");
    },
    challengeModeNavMouseOutSM: function () {
      $('.challenge-mode-navigate-sm div').tooltip("hide");
    },
    challengeModeNavMouseClickSM: function () {
      this.$router.replace("/challenge-game");
      $('.challenge-mode-navigate-sm div').tooltip("hide");
    },
    newGame: function () {
      let _this = this;
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
        if (typeof (currentGameDim) !== "undefined") {
          this.score = score;
          this.bestScore = bestScore;
          this.gameOver = gameOver;
          this.currentGameDim = currentGameDim;
          GAME_DIM = currentGameDim;
          this.numbers = numbers;
          this.rowCol = initRowCol(GAME_DIM, GAME_DIM);
          this.actions = initTwoDimArray(GAME_DIM, GAME_DIM, "");
          let _this = this;
          _.delay(function () {
            _this.actions = initTwoDimArray(GAME_DIM, GAME_DIM, "");
            for (let i = 0; i < GAME_DIM; i++) {
              for (let j = 0; j < GAME_DIM; j++) {
                if (_this.numbers[i][j] !== 0) {
                  _this.actions[i][j] = "new";
                  _this.duration = NEW_DURATION;
                }
              }
            }
          }, 0);
        } else {
          this.newGame();
        }
      } else {
        this.newGame();
      }
    },
    orderMinus: function () {
      if (this.currentGameDim > 4) {
        this.currentGameDim = this.currentGameDim - 1;
      }
      GaReport(this.$store.state.config.uuid, this.$store.state.config.versionNO, CategoryActions.GA_NORMAL_GAME.name, CategoryActions.GA_NORMAL_GAME.actions.OPERATION_CHANGE_ORDER_MINUS);

    },
    orderAdd: function () {
      if (this.currentGameDim < 9) {
        this.currentGameDim = this.currentGameDim + 1;
      }
      GaReport(this.$store.state.config.uuid, this.$store.state.config.versionNO, CategoryActions.GA_NORMAL_GAME.name, CategoryActions.GA_NORMAL_GAME.actions.OPERATION_CHANGE_ORDER_ADD);
    },
    startAction: function (calOP, duration, haveChanged, haveAdd, score, stone, resolve) {
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
        if (calResult.haveChanged) {
          _.delay(function () {
            _this.startAction(calOP, duration, haveChanged, haveAdd, score, stone, resolve);
          }, duration);
        } else {
          resolve(haveChanged, haveAdd, score);
        }
      }, 0);
    },
    addNew: function (duration, resolve) {
      let _this = this;
      _this.actions = initTwoDimArray(GAME_DIM, GAME_DIM, "");
      _.delay(function () {
        let fillResult = randomFill(_this.numbers);
        _this.numbers = fillResult.numbers;
        _this.actions = fillResult.actions;
        resolve();
      }, 0);
    },
    playAddAudio: function (score) {
      if (!this.radioStat) {
        return;
      }
      if (typeof (this.audioCtx) === "undefined") {
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        if (typeof (window.AudioContext) === "undefined") {
          return;
        }
        this.audioCtx = new AudioContext();
      }
      let oscillator = this.audioCtx.createOscillator();
      let gainNode = this.audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(this.audioCtx.destination);
      oscillator.type = 'sine';
      oscillator.frequency.value = 300 + (Math.log2(score) - 1) * 100;
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
      if (_this.gameOver) {
        return;
      }
      if (typeof (_this.inMoveing) !== "undefined") {
        return;
      }
      _this.inMoveing = true;
      _this.duration = baseTime - GAME_DIM * 5;
      _this.startAction(calOP, _this.duration, false, false, 0, stone, function (c, a, s) {
        if (c) {
          if (a) {
            _this.playAddAudio(s);
          }
          _this.duration = NEW_DURATION;
          _this.addNew(_this.duration, function () {
            _this.storeDataToHistory();
            delete _this.inMoveing;
          });
        } else {
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
      if (keyCode === 37) {
        this.keyLeft();
      } else if (keyCode === 39) {
        this.keyRight();
      } else if (keyCode === 38) {
        this.keyUp();
      } else if (keyCode === 40) {
        this.keyDown();
      } else if (keyCode === 13) {
        this.keyEnter();
      }

    }
  },
  watch: {
    score: function (val) {
      this.bestScore = val > this.bestScore ? val : this.bestScore;
    },
    currentGameDim: function (val) {
      if (GAME_DIM !== val) {
        GAME_DIM = val;
        this.newGame();
      }
    }
  },
  created: function () {
    // let _this = this;
    // $('body').on('keyup', function (e) {
    //     e = window.event||e;
    //     _this.keyboardAction(e);
    // });
    document.onkeyup = this.keyboardAction;
  },
  mounted: function () {
    let _this = this;
    window.onresize = _.debounce(() => {
      _this.viewWidth = document.body.clientWidth;
    }, 50);
    _this.$nextTick(function () {
      _this.restoreDataFromHistory();
      GaReport(this.$store.state.config.uuid, this.$store.state.config.versionNO, CategoryActions.GA_NORMAL_GAME.name, CategoryActions.GA_NORMAL_GAME.actions.OPERATION_START);
    });
  },
  components: {
    tweenNumber,
    number,
    arrowKeyboard,
    rateFeedback,
    radioToggle,
    identity,
  }
}
</script>

<style scoped>
.no-gutters {
  margin-right: 0;
  margin-left: 0;
}

.no-gutters .col, [class*="col-"] {
  padding-right: 0;
  padding-left: 0;
}

.heading {
  text-align: center;
  margin: 6px 0 6px 0;
  height: 54px;
  line-height: 54px;
  user-select: none;
  font-size: 0;
}

.heading .title {
  display: inline-block;
  width: 84px;
  height: 36px;
  text-align: left;
  margin-right: 5px;
  color: #776e65;
  font-size: 14px;
  font-weight: bold;
  line-height: 36px;
  vertical-align: middle;
}

.heading .title .identity {
  display: block;
  margin: auto;
}

.heading .score {
  display: inline-block;
  width: 84px;
  height: 36px;
  margin-right: 5px;
  background: #bbada0;
  font-weight: bold;
  font-size: 14px;
  line-height: 20px;
  border-radius: 3px 3px 3px 3px;
  color: white;
  text-align: center;
  vertical-align: middle;
}

.heading .best-score {
  display: inline-block;
  width: 84px;
  height: 36px;
  margin-right: 5px;
  background: #bbada0;
  font-weight: bold;
  font-size: 14px;
  line-height: 20px;
  border-radius: 3px 3px 3px 3px;
  color: white;
  text-align: center;
  vertical-align: middle;
}

.heading .order-action {
  display: inline-block;
  width: 52px;
  height: 36px;
  margin-right: 5px;
  font-weight: bold;
  line-height: 36px;
  color: #776e65;
  text-align: center;
  vertical-align: middle;
}

.heading .order-text {
  display: block;
  font-size: 24px;
  height: 24px;
  line-height: 24px;
}

.heading .order-minus {
  display: block;
  margin: 0;
  padding: 0;
  width: 0;
  height: 0;
  border-bottom: 6px solid #776e65;
  border-left: 24px solid transparent;
  border-right: 24px solid transparent;
  cursor: pointer;
}

.heading .order-add {
  display: block;
  margin: 0;
  padding: 0;
  width: 0;
  height: 0;
  border-top: 6px solid #776e65;
  border-left: 24px solid transparent;
  border-right: 24px solid transparent;
  cursor: pointer;
}

.heading .order-action .disabled {
  border-bottom-color: #b0a597;
  border-top-color: #b0a597;
  cursor: default;
}

.heading .order-action .disabled:hover {
  border-bottom-color: #b0a597;
  border-top-color: #b0a597;
}

.heading .order-minus:hover {
  border-bottom-color: #FF5432;
}

.heading .order-add:hover {
  border-top-color: #FF5432;
}

.heading .new-game-btn {
  display: inline-block;
  width: 35px;
  height: 36px;
  font-weight: bold;
  font-size: 35px;
  line-height: 36px;
  color: #776e65;
  text-align: center;
  vertical-align: middle;
  cursor: pointer;
}

.heading .new-game-btn:hover {
  color: #FF5432;
}

.game-over {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  text-align: center;
  font-weight: bold;
  font-size: 50px;
  color: #776e65;
  padding-top: 50%;
  background-color: rgba(192, 192, 192, 0.8);
  z-index: 3;
  border-radius: 1%;
}

.game-over .restart {
  padding: 1%;
  font-weight: bold;
  font-size: 18px;
  color: rgba(255, 255, 255, 1);
  background-color: #8f7a66;
  border-radius: 3px 3px 3px 3px;
  cursor: pointer;
}

#rate-feedback {
  position: absolute;
  left: 0;
  bottom: -30px;
}

.challenge-mode-navigate {
  position: absolute;
  display: inline;
  right: 0;
  bottom: -30px;
  height: 30px;
  font-size: 30px;
  color: #776e65;
  line-height: 30px;
}

.challenge-mode-navigate div {
  float: right;
  cursor: pointer;
  vertical-align: middle;
}

.challenge-mode-navigate div:hover {
  color: #FF5432;
}

.challenge-mode-navigate .radio-toggle {
  float: right;
  width: 26px;
  height: 26px;
  margin: 2px;
  vertical-align: middle;
}

.game {
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

.heading-sm .title-sm {
  text-align: center;
  height: 36px;
  width: 90px;
  color: #776e65;
  font-size: 14px;
  font-weight: bold;
  line-height: 36px;
  margin: auto;
}

.heading-sm .title-sm .identity-sm {
  display: block;
  margin: auto;
}

.heading-sm .score-area {
  padding: 0;
  margin: 18px 0 0 0;
}

.heading-sm .score-sm {
  display: inline-block;
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

.heading-sm .best-score-sm {
  display: inline-block;
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

.heading-sm .order-action-sm {
  display: block;
  margin: 18px 0 0 0;
  height: 36px;
  font-size: 20px;
  text-align: center;
  vertical-align: middle;
}

.heading-sm .order-text-sm {
  display: inline-block;
  height: 36px;
  font-size: 30px;
  font-weight: bold;
  color: #776e65;
  line-height: 36px;
  vertical-align: middle;
}

.heading-sm .order-minus-sm {
  display: inline-block;
  margin: 0;
  padding: 0;
  width: 0;
  height: 0;
  border-right: 9px solid #776e65;
  border-top: 18px solid transparent;
  border-bottom: 18px solid transparent;
  cursor: pointer;
  vertical-align: middle;
}

.heading-sm .order-add-sm {
  display: inline-block;
  margin: 0;
  padding: 0;
  width: 0;
  height: 0;
  border-left: 9px solid #776e65;
  border-top: 18px solid transparent;
  border-bottom: 18px solid transparent;
  cursor: pointer;
  vertical-align: middle;
}

.heading-sm .order-minus-sm:hover {
  border-right-color: #FF5432;
}

.heading-sm .order-add-sm:hover {
  border-left-color: #FF5432;
}

.heading-sm .order-action-sm .disabled {
  border-left-color: #b0a597;
  border-right-color: #b0a597;
  cursor: default;
}

.heading-sm .order-action-sm .disabled:hover {
  border-left-color: #b0a597;
  border-right-color: #b0a597;
}

.new-game-btn-sm-area {
  margin-top: 60px;
}

.heading-sm .new-game-btn-sm {
  height: 36px;
  font-weight: bold;
  font-size: 50px;
  line-height: 36px;
  color: #776e65;
  text-align: center;
  vertical-align: middle;
  cursor: pointer;
}

.heading-sm .new-game-btn-sm:hover {
  color: #FF5432;
}

.tip-sm {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 50px;
  padding: 0 0 0 0;
  text-align: center;
  font-size: 14px;
  font-weight: bold;
  color: #776e65;
}

#last-line-sm {
  position: absolute;
  display: block;
  bottom: 0;
  left: 0;
  right: 0;
  height: 30px;
  text-align: center;
}

#last-line-container-sm {
  position: relative;
  display: inline-block;
  width: 180px;
  height: 30px;
}

#rate-feedback-sm {
  position: absolute;
  left: 0;
  bottom: 0;
}

.challenge-mode-navigate-sm {
  position: absolute;
  display: inline;
  right: 0;
  bottom: 0;
  height: 30px;
  font-size: 30px;
  color: #776e65;
  line-height: 30px;
}

.challenge-mode-navigate-sm div {
  float: right;
  cursor: pointer;
  vertical-align: middle;
}

.challenge-mode-navigate-sm div:hover {
  color: #FF5432;
}

.challenge-mode-navigate-sm .radio-toggle-sm {
  float: right;
  width: 26px;
  height: 26px;
  margin: 2px;
  vertical-align: middle;
}
</style>
