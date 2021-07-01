<template>
    <div ref="box" class="box" >
        <div class="number"
             v-bind="$attrs"
             :style="numberStyle">
            {{currentNumber}}
        </div>
        <div v-if="shadow"
             class="shadow-number"
             v-bind="$attrs"
             :style="shadowNumberStyle">
            {{currentNumber}}
        </div>
        <!--button @click="add">add</button-->
    </div>
</template>

<script>
    import StartTween from "../common/js/start-tween";
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
            zIndex: 2,
            boxShadow: boxShadow,
        };
    }
    export default {
        name: "number",
        props:{
            number:{
                type: Number
            },
            action: {
                type: String
            },
            duration: {
                type: Number
            },
            viewWidth: ""
        },
        data: function () {
            return {
                currentNumber: this.number,
                numberStyle: calStyleFromNumber(this.currentNumber, 0),
                shadow: false,
                shadowNumberStyle: calStyleFromNumber(this.currentNumber, 0),
            }
        },
        methods: {
            addAnimation: function () {
                let _this = this;
                StartTween({num: 1}, {num: 1.15}, function (object) {
                    _this.numberStyle.transform = "scale("+Number(object.num).toFixed(2)+","+Number(object.num).toFixed(2)+")";
                }, 100, function () {
                    _.delay(function () {
                        StartTween({num: 1.15}, {num: 1}, function (object) {
                            _this.numberStyle.transform = "scale("+Number(object.num).toFixed(2)+","+Number(object.num).toFixed(2)+")";
                        }, 100);
                    }, 0);
                }, null, 0);
            },
            // add: function () {
            //     this.number =this.number*2;
            // }
        },
        watch: {
            number: function (val) {
                if (this.action === "static") {
                    this.currentNumber = val;
                }
            },
            action: function (val) {
                if (typeof(val) !== "string"){
                    return;
                }

                let _this = this;
                let width = this.$refs.box.clientWidth;
                let distance = 1.1*width;
                let orgOffset = 0;
                let direction = "";
                if (this.action.indexOf("up") !== -1){
                    orgOffset = distance;
                    direction = "translateY";
                }
                else if (this.action.indexOf("right") !== -1){
                    orgOffset = -distance;
                    direction = "translateX";
                }
                else if (this.action.indexOf("down") !== -1){
                    orgOffset = -distance;
                    direction = "translateY";
                }
                else if (this.action.indexOf("left") !== -1){
                    orgOffset = distance;
                    direction = "translateX";
                }

                switch (this.action) {
                    case "up":
                    case "right":
                    case "down":
                    case "left":
                        _this.currentNumber = _this.number;
                        _this.numberStyle = calStyleFromNumber(_this.currentNumber, width);
                        _this.numberStyle.transform = direction+"("+orgOffset+"px)";
                        StartTween({num: orgOffset}, {num: 0}, function (object) {
                            _this.numberStyle.transform = direction+"("+Number(object.num).toFixed()+"px)";
                        }, _this.duration);
                        break;
                    case "up-double":
                    case "right-double":
                    case "down-double":
                    case "left-double":
                        _this.shadow = true;
                        _this.shadowNumberStyle = calStyleFromNumber(_this.currentNumber, width);
                        _this.shadowNumberStyle.transform = direction+"("+orgOffset+"px)";
                        _this.shadowNumberStyle.zIndex = 1;
                        StartTween({num: orgOffset}, {num: 0}, function (object) {
                            _this.shadowNumberStyle.transform = direction+"("+Number(object.num).toFixed()+"px)";
                        }, _this.duration, function () {
                            _this.shadow = false;
                            _this.currentNumber = _this.number;
                            _this.numberStyle = calStyleFromNumber(_this.currentNumber, width);
                            _.delay(function () {
                                _this.addAnimation();
                            }, 0);
                        });
                        break;
                    case "new":
                        _this.currentNumber = _this.number;
                        _this.numberStyle = calStyleFromNumber(_this.currentNumber, width);
                        _this.numberStyle.transform = "scale(0.5)";
                        StartTween({num: 0.5}, {num: 1}, function (object) {
                            _this.numberStyle.transform = "scale("+Number(object.num).toFixed(2)+","+Number(object.num).toFixed(2)+")";
                        }, _this.duration);
                        break;
                    case "hidden":
                    case "change":
                    default:
                        _this.currentNumber = _this.number;
                        _this.numberStyle = calStyleFromNumber(_this.currentNumber, width);
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
        z-index: 0;
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