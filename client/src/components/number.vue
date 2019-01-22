<template>
    <div ref="box" class="box" >
        <tween-number
                class="number"
                v-bind="$attrs"
                :style="numberStyle"
                :number="currentNumber"
                :duration="1">
        </tween-number>
        <tween-number
                v-if="shadow"
                class="shadow-number"
                v-bind="$attrs"
                :style="shadowNumberStyle"
                :number="currentNumber"
                :duration="1">
        </tween-number>
        <!--button @click="add">add</button-->
    </div>
</template>

<script>
    import tweenNumber from "./tween-number";
    import _ from "lodash";
    const COLOR_LIST = [
        "#FFD700",
        "#FF0000",
        "#FF6543",
        "#FF8765",
        "#FFA987",
        "#FFCBA9",
        "#EDE0C8",
        "#EEE4DA",
    ];
    const FONT_PEC = 1.5;
    function calStyleFromNumber(number, width) {
        let display = number===0?"none":"block";
        let lineHeight = "8vw";
        let fontSize = "4vw";
        let fontColorIndex = number===0?0:(Math.log2(number)-1);
        let fontColor = fontColorIndex<4?"#8f7a66":"#F8F8F8";
        let boxShadow = "";
        let backgroundColor = "#BBADA0";
        if (number===0){
            backgroundColor = "#BBADA0";
        }
        else if (fontColorIndex < COLOR_LIST.length){
            backgroundColor = COLOR_LIST[COLOR_LIST.length-fontColorIndex-1];
        }
        else{
            backgroundColor = COLOR_LIST[0];
            boxShadow = "0 0 10px "
                +(5+(fontColorIndex-COLOR_LIST.length>=5?5:fontColorIndex-COLOR_LIST.length))
                +"px rgba(243, 215, 116, "
                +(0.35+(fontColorIndex-COLOR_LIST.length)*0.15)
                +"), inset 0 0 0 1px rgba(255, 255, 255, "
                +(0.2+(fontColorIndex-COLOR_LIST.length)*0.1)
                +")";
        }
        if (width !== 0){
            if (String(number).length === 1){
                fontSize = Number(width*0.6/String(number).length).toFixed() + "px";
            }
            else if (String(number).length === 2){
                fontSize = Number(width*1/String(number).length).toFixed() + "px";
            }
            else{
                fontSize = Number(width*FONT_PEC/String(number).length).toFixed() + "px";
            }
            lineHeight = width+"px";
        }
        return {
            display: display,
            fontSize: fontSize,
            lineHeight: lineHeight,
            color: fontColor,
            backgroundColor: backgroundColor,
            transform: "",
            zIndex: 1,
            boxShadow: boxShadow,
        };
    }
    export default {
        name: "number",
        props:{
            number:{
                type: Number
            },
            duration: {
                type: Number
            },
            action: "",
            viewWidth: ""
        },
        data: function () {
            return {
                currentNumber: 0|this.number,
                numberStyle: calStyleFromNumber(this.currentNumber, 0),
                shadow: false,
                shadowNumberStyle: calStyleFromNumber(this.currentNumber, 0),
            }
        },
        methods: {
            tween: function (startValue, endValue, currentValue = null, space = null, update = null, end = null, interval = 1000) {
                if (currentValue === null) {
                    currentValue = startValue;
                }
                else{
                    currentValue += space;
                }
                let isEnd = false;
                if (space*currentValue >= space*endValue) {
                    isEnd = true;
                    currentValue = endValue;
                }
                update(currentValue);
                if (isEnd){
                    if (end !== null) {
                        end(currentValue)
                    }
                }
                else{
                    let _this = this;
                    _.delay(function () {
                        _this.tween(startValue, endValue, currentValue, space, update, end, interval);
                    }, interval);
                }
            },
            addAnimation: function () {
                let _this = this;
                this.tween(1, 1.15, null, (1.15-1)/8, function (object) {
                    _this.numberStyle.transform = "scale("+Number(object).toFixed(2)+","+Number(object).toFixed(2)+")";
                }, function () {
                    _.delay(function () {
                        _this.tween(1.15, 1, null, (1-1.15)/8, function (object) {
                            _this.numberStyle.transform = "scale("+Number(object).toFixed(2)+","+Number(object).toFixed(2)+")";
                        }, null, 100/8);
                    }, 20);
                }, 100/8);
            },
            // add: function () {
            //     this.number =this.number*2;
            // }
        },
        watch: {
            number: function (val, oldVal) {
                let _this = this;
                let width = this.$refs.box.clientWidth;
                let distance = 1.1*width;
                let space = null;
                let interval = null;
                if (distance/8>5){
                    space = distance/8;
                    interval = this.duration/8;
                }
                else{
                    space = 5;
                    interval = this.duration/(Math.abs(distance)/5);
                }

                if (val !== 0){
                    switch (this.action) {
                        case "up":
                            if (val !== 2*oldVal) {
                                val = 0|val;
                                this.currentNumber = val;
                                this.numberStyle = calStyleFromNumber(val, width);
                                this.tween(distance, 0, null, -space, function (object) {
                                    _this.numberStyle.transform = "translateY("+Number(object).toFixed()+"px)";
                                }, null, interval);
                            }
                            else if (val === 2*oldVal){
                                val = 0|val;
                                oldVal = 0|oldVal;
                                this.shadow = true;
                                this.shadowNumberStyle = calStyleFromNumber(oldVal, width);
                                this.shadowNumberStyle.zIndex = 0;
                                this.tween(distance, 0, null, -space, function (object) {
                                    _this.shadowNumberStyle.transform = "translateY("+Number(object).toFixed()+"px)";
                                }, function () {
                                    _this.shadow = false;
                                    _this.currentNumber = val;
                                    _this.numberStyle = calStyleFromNumber(val, width);
                                    setTimeout(function () {
                                        _this.addAnimation();
                                    }, 10);
                                }, interval);
                            }
                            break;
                        case "right":
                            if (val !== 2*oldVal) {
                                val = 0|val;
                                this.currentNumber = val;
                                this.numberStyle = calStyleFromNumber(val, width);
                                this.tween(-distance, 0, null, space, function (object) {
                                    _this.numberStyle.transform = "translateX("+Number(object).toFixed()+"px)";
                                }, null, interval);
                            }
                            else if (val === 2*oldVal) {
                                val = 0|val;
                                oldVal = 0|oldVal;
                                this.shadow = true;
                                this.shadowNumberStyle = calStyleFromNumber(oldVal, width);
                                this.shadowNumberStyle.zIndex = 0;
                                this.tween(-distance, 0, null, space, function (object) {
                                    _this.shadowNumberStyle.transform = "translateX("+Number(object).toFixed()+"px)";
                                }, function () {
                                    _this.shadow = false;
                                    _this.currentNumber = val;
                                    _this.numberStyle = calStyleFromNumber(val, width);
                                    setTimeout(function () {
                                        _this.addAnimation();
                                    }, 10);
                                }, interval);
                            }
                            break;
                        case "down":
                            if (val !== 2*oldVal) {
                                val = 0|val;
                                this.currentNumber = val;
                                this.numberStyle = calStyleFromNumber(val, width);
                                this.tween(-distance, 0, null, space, function (object) {
                                    _this.numberStyle.transform = "translateY("+Number(object).toFixed()+"px)";
                                }, null, interval);
                            }
                            else if (val === 2*oldVal) {
                                val = 0|val;
                                oldVal = 0|oldVal;
                                this.shadow = true;
                                this.shadowNumberStyle = calStyleFromNumber(oldVal, width);
                                this.shadowNumberStyle.zIndex = 0;
                                this.tween(-distance, 0, null, space, function (object) {
                                    _this.shadowNumberStyle.transform = "translateY("+Number(object).toFixed()+"px)";
                                }, function () {
                                    _this.shadow = false;
                                    _this.currentNumber = val;
                                    _this.numberStyle = calStyleFromNumber(val, width);
                                    setTimeout(function () {
                                        _this.addAnimation();
                                    }, 10);
                                }, interval);
                            }
                            break;
                        case "left":
                            if (val !== 2*oldVal) {
                                val = 0|val;
                                this.currentNumber = val;
                                this.numberStyle = calStyleFromNumber(val, width);
                                this.tween(distance, 0, null, -space, function (object) {
                                    _this.numberStyle.transform = "translateX("+Number(object).toFixed()+"px)";
                                }, null, interval);
                            }
                            else if (val === 2*oldVal) {
                                val = 0|val;
                                oldVal = 0|oldVal;
                                this.shadow = true;
                                this.shadowNumberStyle = calStyleFromNumber(oldVal, width);
                                this.shadowNumberStyle.zIndex = 0;
                                this.tween(distance, 0, null, -space, function (object) {
                                    _this.shadowNumberStyle.transform = "translateX("+Number(object).toFixed()+"px)";
                                }, function () {
                                    _this.shadow = false;
                                    _this.currentNumber = val;
                                    _this.numberStyle = calStyleFromNumber(val, width);
                                    setTimeout(function () {
                                        _this.addAnimation();
                                    }, 10);
                                }, interval);
                            }
                            break;
                        case "new":
                            _this.currentNumber = val;
                            this.numberStyle = calStyleFromNumber(val, width);
                            _this.tween(0.5, 1, null, (1-0.5)/8, function (object) {
                                _this.numberStyle.transform = "scale("+Number(object).toFixed(2)+","+Number(object).toFixed(2)+")";
                            }, null, this.duration/8);
                            break;
                        default:
                            _this.currentNumber = val;
                            this.numberStyle = calStyleFromNumber(val, width);
                    }
                }
                else{
                    if (oldVal !== 0) {
                        this.currentNumber = val;
                        this.numberStyle = calStyleFromNumber(val, width);
                    }
                }
            },
            viewWidth: function () {
                this.numberStyle = calStyleFromNumber(this.currentNumber, this.$refs.box.clientWidth);
            }
        },
        mounted: function() {
            const _this = this;
            _this.$nextTick(()=>{
                _this.numberStyle = calStyleFromNumber(_this.currentNumber, _this.$refs.box.clientWidth);
            })
        },
        components:{
            tweenNumber
        }
    };
</script>

<style scoped>
    .box {
        height: 0;
        padding-top: 90%;
        margin: 5%;
        border-radius: 5%;
        background-color: #BBADA0;
    }
    .number{
        position: absolute;
        margin: 5%;
        border-radius: 5%;
        text-align: center;
        font-weight: bold;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
    }
    .shadow-number{
        position: absolute;
        margin: 5%;
        border-radius: 5%;
        text-align: center;
        font-weight: bold;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
    }
</style>