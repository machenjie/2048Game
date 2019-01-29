<template>
    <div @keyup.stop="" @keydown.stop="">
        <a id="choose-btn" data-toggle="modal" :data-target='"#choose-dialog"+dialogTag'>
            LEVEL {{currentLevel}}
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
                        <div class="left-move"></div>
                        <div class="choose-list-show-box">
                            <div class="choose-list-move-box">
                                <ul v-for="boxItem in chooseBoxList" :key="boxItem.key">
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
                        <div class="right-move"></div>
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
    export default {
        name: "level-choose",
        props: {
            dialogTag: "",
            chooseList: {},
        },
        data: function () {
            let chooseBoxList = this.initChooseBoxList();
            let numberStyleList = this.initNumberStyleList();
            return {
                currentLevel: 1,
                chooseBoxList,
                numberStyleList,
            }
        },
        watch: {
            chooseList: function () {
                this.chooseBoxList = this.initChooseBoxList();
                this.numberStyleList = this.initNumberStyleList();
            },
        },
        methods: {
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
                            }
                        }
                        else {
                            numberStyleList[i][j] = {
                                backgroundColor: "#EEE4DA",
                                color: "#8f7a66",
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
                if (index !== 0 && !this.chooseList[index-1].done){
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
                    this.currentLevel = index+1;
                }
            },
        }
    }
</script>

<style scoped>
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
        left: 0;
        top: 0;
        margin: 0;
        padding: 0;
        width: max-content;
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
        cursor: pointer;
        vertical-align: middle;
        opacity: 0.5;
    }

    .left-move:hover{
        opacity: 1;
        border-right-color: #FF5432;
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
        cursor: pointer;
        vertical-align: middle;
        opacity: 0.5;
    }

    .right-move:hover{
        opacity: 1;
        border-left-color: #FF5432;
    }
</style>