<template>
    <div @keyup.stop="" @keydown.stop="">
        <a id="choose-btn" data-toggle="modal" :data-target='"#choose-dialog"+dialogTag' @mousedown="chooseClick">
            {{value}}
        </a>
        <div :id='"choose-dialog"+dialogTag' class="modal fade">
            <div class="modal-dialog">
                <div class="modal-content">
                    <!-- header
                    <div class="modal-header">
                        <h5 class="modal-title">TITLE</h5>
                        <button type="button" class="close" data-dismiss="modal">&times;</button>
                    </div>
                    -->

                    <!-- body -->
                    <div class="modal-body">
                        <div class="left-move" :style="leftMoveStyle"
                             @mousedown="leftMoveMouseDown"
                             @mouseup="leftMoveMouseUp"
                             @mouseover="leftMoveMouseOver"
                             @mouseout="leftMoveMouseOut">
                        </div>
                        <div class="choose-list-show-box" ref="showBox">
                            <div class="choose-list-move-box" :style='{left: boxLeft+"px"}'>
                                <ul ref="singleBox" v-for="boxItem in chooseBoxList" :key="boxItem.key">
                                    <li v-for="chooseItem in boxItem.list"
                                        :key="chooseItem.key"
                                        @mouseover="mouseOver(boxItem.key, chooseItem.key)"
                                        @mouseout="mouseOut()"
                                        @click="mouseClick(boxItem.key, chooseItem.key)"
                                        :style="numberStyleList[boxItem.key-1][chooseItem.key-1]"
                                        data-dismiss="modal">
                                        {{chooseItem.number}}
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div class="right-move" :style="rightMoveStyle"
                             @mousedown="rightMoveMouseDown"
                             @mouseup="rightMoveMouseUp"
                             @mouseover="rightMoveMouseOver"
                             @mouseout="rightMoveMouseOut">
                        </div>
                    </div>

                    <!-- footer -->
                    <!--div class="modal-footer">
                        <button type="button" class="btn btn-primary" data-dismiss="modal">close</button>
                    </div-->
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import GaReport, {CategoryActions} from '../api/ga-report';

    export default {
        inheritAttrs: false,
        props: {
            dialogTag: {},
            chooseList: {},
            value: {
                type: Number,
            },
        },
        data: function () {
            let chooseBoxList = this.initChooseBoxList();
            let numberStyleList = this.initNumberStyleList();
            let boxLeft = 0;
            let leftMoveStyle = {
                borderRightColor: "#8f7a66",
                cursor: "default",
            };
            let rightMoveStyle = {
                borderLeftColor: "#b0a597",
                cursor: "default",
            };
            return {
                chooseBoxList,
                numberStyleList,
                boxLeft,
                leftMoveStyle,
                rightMoveStyle,
            }
        },
        watch: {
            chooseList: function () {
                this.chooseBoxList = this.initChooseBoxList();
                this.numberStyleList = this.initNumberStyleList();
            },
        },
        methods: {
            chooseClick: function() {
                GaReport(this.$store.state.config.uuid, this.$store.state.config.versionNO, CategoryActions.GA_CHALLENGE_GAME.name, CategoryActions.GA_CHALLENGE_GAME.actions.OPERATION_LEVEL_CHOOSE);
            },
            initChooseBoxList: function () {
                let boxCount = Math.floor(this.chooseList.length/16)+(this.chooseList.length%16===0?0:1);
                let chooseBoxList = new Array(boxCount);
                for(let i=0; i<chooseBoxList.length; i++){
                    chooseBoxList[i] = {};
                    chooseBoxList[i].key = i+1;
                    chooseBoxList[i].list = new Array(16);
                    for(let j=0; j<chooseBoxList[i].list.length; j++){
                        chooseBoxList[i].list[j] = {};
                        chooseBoxList[i].list[j].key = j+1;
                        chooseBoxList[i].list[j].number = "";
                    }
                }
                for(let i=0; i<chooseBoxList.length; i++){
                    for(let j=0; j<chooseBoxList[i].list.length; j++){
                        let index = i*chooseBoxList[i].list.length+j;
                        if (index >= this.chooseList.length){
                            break;
                        }
                        chooseBoxList[i].list[j].number = index+1;
                    }
                }
                return chooseBoxList;
            },
            initNumberStyleList: function () {
                let boxCount = Math.floor(this.chooseList.length/16)+(this.chooseList.length%16===0?0:1);
                let numberStyleList = new Array(boxCount);
                for(let i=0; i<numberStyleList.length; i++){
                    numberStyleList[i] = new Array(16);
                    for(let j=0; j<numberStyleList[i].length; j++){
                        numberStyleList[i][j] = {
                            backgroundColor: "#BBADA0",
                            color: "#8f7a66",
                            boxShadow: "",
                        }
                    }
                }
                for(let i=0; i<numberStyleList.length; i++){
                    for(let j=0; j<numberStyleList[i].length; j++){
                        let index = i*numberStyleList[i].length+j;
                        if (index >= this.chooseList.length){
                            break;
                        }
                        if (this.chooseList[index].done){
                            numberStyleList[i][j] = {
                                backgroundColor: "#FFD700",
                                color: "#F8F8F8",
                                boxShadow: "0 0 2px 2px rgba(243, 215, 116, 0.7), inset 0 0 0 1px rgba(255, 255, 255, 0.6)",
                            }
                        }
                        else {
                            numberStyleList[i][j] = {
                                backgroundColor: "#EEE4DA",
                                color: "#8f7a66",
                                boxShadow: "",
                            }
                        }
                        numberStyleList[i][j].cursor = "normal";
                    }
                }

                return numberStyleList;
            },
            checkIsItemValid: function (key1, key2) {
                let index = (key1-1)*this.numberStyleList[key1-1].length+(key2-1);
                if (index >= this.chooseList.length) {
                    return false;
                }
                else if (index !== 0 && !this.chooseList[index-1].done){
                    return false;
                }
                return true;
            },
            mouseOver: function (key1, key2) {
                if (this.checkIsItemValid(key1, key2)){
                    let numberStyleList = this.initNumberStyleList();
                    numberStyleList[key1-1][key2-1].backgroundColor = "#FF6543";
                    numberStyleList[key1-1][key2-1].cursor = "pointer";
                    this.numberStyleList = numberStyleList;
                }
            },
            mouseOut: function () {
                this.numberStyleList = this.initNumberStyleList();
            },
            mouseClick: function (key1, key2) {
                let index = (key1-1)*this.numberStyleList[key1-1].length+(key2-1);
                if (this.checkIsItemValid(key1, key2)){
                    this.$emit('input', index+1);
                }
            },
            moveBoxMaxLength: function () {
                return this.numberStyleList.length*this.$refs.singleBox[0].clientWidth;
            },
            leftMoveMouseDown: function () {
                let _this = this;
                let moveInterval = (_this.boxLeft+_this.moveBoxMaxLength()-_this.$refs.showBox.clientWidth)/60;
                moveInterval = Math.max(Math.floor(moveInterval), 10);
                if (typeof(_this.leftMoveInterval) !== "undefined"){
                    clearInterval(_this.leftMoveInterval);
                    delete _this.leftMoveInterval;
                }
                if (typeof(_this.rightMoveInterval) !== "undefined") {
                    clearInterval(_this.rightMoveInterval);
                    delete _this.rightMoveInterval;
                }
                _this.leftMoveInterval = setInterval(function () {
                    _this.boxLeft = _this.boxLeft-moveInterval;
                    if (_this.boxLeft <= -_this.moveBoxMaxLength()+_this.$refs.showBox.clientWidth){
                        _this.boxLeft = -_this.moveBoxMaxLength()+_this.$refs.showBox.clientWidth;
                        clearInterval(_this.leftMoveInterval);
                        delete _this.leftMoveInterval;
                        _this.leftMoveStyle.borderRightColor = "#b0a597";
                        _this.leftMoveStyle.cursor = "default";
                    }
                    _this.rightMoveStyle.borderLeftColor = "#8f7a66";
                    _this.rightMoveStyle.cursor = "pointer";
                }, 50);
            },
            leftMoveMouseUp: function () {
                if (typeof(this.leftMoveInterval) !== "undefined"){
                    clearInterval(this.leftMoveInterval);
                    delete this.leftMoveInterval;
                    this.boxLeft = this.boxLeft - (75-Math.abs(this.boxLeft%this.$refs.singleBox[0].clientWidth%75));
                    if (this.boxLeft <= -this.moveBoxMaxLength()+this.$refs.showBox.clientWidth){
                        this.boxLeft = -this.moveBoxMaxLength()+this.$refs.showBox.clientWidth;
                        this.leftMoveStyle.borderRightColor = "#b0a597";
                        this.leftMoveStyle.cursor = "default";
                    }
                    this.rightMoveStyle.borderLeftColor = "#8f7a66";
                    this.rightMoveStyle.cursor = "pointer";
                }
            },
            rightMoveMouseDown: function () {
                let _this = this;
                let moveInterval = -_this.boxLeft/60;
                moveInterval = Math.max(Math.floor(moveInterval), 10);
                if (typeof(_this.leftMoveInterval) !== "undefined"){
                    clearInterval(_this.leftMoveInterval);
                    delete _this.leftMoveInterval;
                }
                if (typeof(_this.rightMoveInterval) !== "undefined") {
                    clearInterval(_this.rightMoveInterval);
                    delete _this.rightMoveInterval;
                }
                _this.rightMoveInterval = setInterval(function () {
                    _this.boxLeft = _this.boxLeft+moveInterval;
                    if (_this.boxLeft >= 0){
                        _this.boxLeft = 0;
                        clearInterval(_this.rightMoveInterval);
                        delete _this.rightMoveInterval;
                        _this.rightMoveStyle.borderLeftColor = "#b0a597";
                        _this.rightMoveStyle.cursor = "default";
                    }
                    _this.leftMoveStyle.borderRightColor = "#8f7a66";
                    _this.leftMoveStyle.cursor = "pointer";
                }, 50);
            },
            rightMoveMouseUp: function () {
                if (typeof(this.rightMoveInterval) !== "undefined"){
                    clearInterval(this.rightMoveInterval);
                    delete this.rightMoveInterval;
                    this.boxLeft = this.boxLeft + Math.abs(this.boxLeft%this.$refs.singleBox[0].clientWidth%75);
                    if (this.boxLeft >= 0){
                        this.boxLeft = 0;
                        this.rightMoveStyle.borderLeftColor = "#b0a597";
                        this.rightMoveStyle.cursor = "default";
                    }
                    this.leftMoveStyle.borderRightColor = "#8f7a66";
                    this.leftMoveStyle.cursor = "pointer";
                }
            },
            leftMoveMouseOver: function () {
                if (this.boxLeft > -this.moveBoxMaxLength()+this.$refs.showBox.clientWidth){
                    this.leftMoveStyle.borderRightColor = "#FF5432";
                    this.leftMoveStyle.cursor = "pointer";
                }
            },
            leftMoveMouseOut: function () {
                if (this.boxLeft > -this.moveBoxMaxLength()+this.$refs.showBox.clientWidth){
                    this.leftMoveStyle.borderRightColor = "#8f7a66";
                    this.leftMoveStyle.cursor = "pointer";
                }
            },
            rightMoveMouseOver: function () {
                if (this.boxLeft < 0){
                    this.rightMoveStyle.borderLeftColor = "#FF5432";
                    this.rightMoveStyle.cursor = "pointer";
                }
            },
            rightMoveMouseOut: function () {
                if (this.boxLeft < 0){
                    this.rightMoveStyle.borderLeftColor = "#8f7a66";
                    this.rightMoveStyle.cursor = "pointer";
                }
            },
        },
    }
</script>

<style scoped>
    #choose-btn{
        font-family: Georgia, Tahoma, Arial, serif;
        display: block;
        padding: 0 10px 0 10px;
    }

    .modal {
        cursor: default;
    }

    .modal-content {
        margin-top: 30vh;
        text-align: center;
        background: #faf8ef;
        border: 0;
    }

    .modal-body{
        display: inline-block;
        padding: 10px;
        font-size: 0;
    }

    .choose-list-show-box{
        display: inline-block;
        position: relative;
        height: 305px;
        width: 88%;
        overflow: hidden;
        vertical-align: middle;
        background-color: #776e65;
        border-radius: 5px;
    }

    .choose-list-move-box{
        display: inline-block;
        position: absolute;
        text-align: left;
        left: 0;
        top: 0;
        margin: 0;
        padding: 0;
        width: 2048px;
        height: 100%;
    }

    .choose-list-move-box ul{
        display: inline-block;
        width: 305px;
        height: 305px;
        margin: 0;
        padding: 0 0 5px 5px;
        white-space: nowrap;
    }

    .choose-list-move-box li{
        display: inline-block;
        float: left;
        margin: 5px 5px 0 0;
        padding: 0;
        width: 70px;
        height: 70px;
        border-radius: 5px;
        text-align: center;
        font-size: 32px;
        font-weight: bold;
        line-height: 70px;
        list-style-type: none;
    }

    .left-move{
        display: inline-block;
        margin: 0;
        padding: 0;
        width: 0;
        height: 0;
        border-right: 10px solid  #776e65;
        border-top: 152px solid transparent ;
        border-bottom: 152px solid transparent ;
        vertical-align: middle;
    }

    .right-move{
        display: inline-block;
        margin: 0;
        padding: 0;
        width: 0;
        height: 0;
        border-left: 10px solid  #776e65;
        border-top: 152px solid transparent ;
        border-bottom: 152px solid transparent ;
        vertical-align: middle;
    }
</style>