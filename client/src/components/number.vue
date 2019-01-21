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
                currentNumber: Math.floor(this.number),
                numberStyle: calStyleFromNumber(this.currentNumber, 0),
                shadow: false,
                shadowNumberStyle: calStyleFromNumber(this.currentNumber, 0),
            }
        },
        methods: {
            tween: function (startValue, endValue, update, start = null, end = null, duration = 1000, mode = TWEEN.Easing.Linear.None) {
                function animate () {
                    if (TWEEN.update()) {
                        requestAnimationFrame(animate)
                    }
                }
                new TWEEN.Tween(startValue)
                    .to(endValue, duration)
                    .easing(mode)
                    .onStart(start)
                    .onUpdate(update)
                    .onComplete(end)
                    .start();
                animate();
            },
            addAnimation: function () {
                let _this = this;
                this.tween({scale: 1}, {scale: 1.15}, function (object) {
                    _this.numberStyle.transform = "scale("+Number(object.scale).toFixed(2)+","+Number(object.scale).toFixed(2)+")";
                }, null, function () {
                    setTimeout(function () {
                        _this.tween({scale: 1.15}, {scale: 1}, function (object) {
                            _this.numberStyle.transform = "scale("+Number(object.scale).toFixed(2)+","+Number(object.scale).toFixed(2)+")";
                        }, null, null, 100, TWEEN.Easing.Exponential.In);
                    }, 50);
                }, 100, TWEEN.Easing.Exponential.Out);
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
                if (val !== 0){
                    switch (this.action) {
                        case "up":
                            if (val !== 2*oldVal) {
                                val = Math.floor(val);
                                this.currentNumber = val;
                                this.numberStyle = calStyleFromNumber(val, width);
                                this.tween({distance: distance},{distance: 0}, function (object) {
                                    _this.numberStyle.transform = "translateY("+Number(object.distance).toFixed()+"px)";
                                }, null, null, this.duration);
                            }
                            else if (val === 2*oldVal){
                                val = Math.floor(val);
                                oldVal = Math.floor(oldVal);
                                this.shadow = true;
                                this.shadowNumberStyle = calStyleFromNumber(oldVal, width);
                                this.shadowNumberStyle.zIndex = 0;
                                this.tween({distance: distance}, {distance: 0}, function (object) {
                                    _this.shadowNumberStyle.transform = "translateY("+Number(object.distance).toFixed()+"px)";
                                }, null, function () {
                                    _this.shadow = false;
                                    _this.currentNumber = val;
                                    _this.numberStyle = calStyleFromNumber(val, width);
                                    setTimeout(function () {
                                        _this.addAnimation();
                                    }, 10);
                                }, this.duration);
                            }
                            break;
                        case "right":
                            if (val !== 2*oldVal) {
                                val = Math.floor(val);
                                this.currentNumber = val;
                                this.numberStyle = calStyleFromNumber(val, width);
                                this.tween({distance: -distance}, {distance: 0}, function (object) {
                                    _this.numberStyle.transform = "translateX("+Number(object.distance).toFixed()+"px)";
                                }, null, null, this.duration);
                            }
                            else if (val === 2*oldVal) {
                                val = Math.floor(val);
                                oldVal = Math.floor(oldVal);
                                this.shadow = true;
                                this.shadowNumberStyle = calStyleFromNumber(oldVal, width);
                                this.shadowNumberStyle.zIndex = 0;
                                this.tween({distance: -distance}, {distance: 0}, function (object) {
                                    _this.shadowNumberStyle.transform = "translateX("+Number(object.distance).toFixed()+"px)";
                                }, null, function () {
                                    _this.shadow = false;
                                    _this.currentNumber = val;
                                    _this.numberStyle = calStyleFromNumber(val, width);
                                    setTimeout(function () {
                                        _this.addAnimation();
                                    }, 10);
                                }, this.duration);
                            }
                            break;
                        case "down":
                            if (val !== 2*oldVal) {
                                val = Math.floor(val);
                                this.currentNumber = val;
                                this.numberStyle = calStyleFromNumber(val, width);
                                this.tween({distance: -distance},{distance: 0}, function (object) {
                                    _this.numberStyle.transform = "translateY("+Number(object.distance).toFixed()+"px)";
                                }, null, null, this.duration);
                            }
                            else if (val === 2*oldVal) {
                                val = Math.floor(val);
                                oldVal = Math.floor(oldVal);
                                this.shadow = true;
                                this.shadowNumberStyle = calStyleFromNumber(oldVal, width);
                                this.shadowNumberStyle.zIndex = 0;
                                this.tween({distance: -distance},{distance: 0}, function (object) {
                                    _this.shadowNumberStyle.transform = "translateY("+Number(object.distance).toFixed()+"px)";
                                }, null, function () {
                                    _this.shadow = false;
                                    _this.currentNumber = val;
                                    _this.numberStyle = calStyleFromNumber(val, width);
                                    setTimeout(function () {
                                        _this.addAnimation();
                                    }, 10);
                                }, this.duration);
                            }
                            break;
                        case "left":
                            if (val !== 2*oldVal) {
                                val = Math.floor(val);
                                this.currentNumber = val;
                                this.numberStyle = calStyleFromNumber(val, width);
                                this.tween({distance: distance}, {distance: 0}, function (object) {
                                    _this.numberStyle.transform = "translateX("+Number(object.distance).toFixed()+"px)";
                                }, null, null, this.duration);
                            }
                            else if (val === 2*oldVal) {
                                val = Math.floor(val);
                                oldVal = Math.floor(oldVal);
                                this.shadow = true;
                                this.shadowNumberStyle = calStyleFromNumber(oldVal, width);
                                this.shadowNumberStyle.zIndex = 0;
                                this.tween({distance: distance}, {distance: 0}, function (object) {
                                    _this.shadowNumberStyle.transform = "translateX("+Number(object.distance).toFixed()+"px)";
                                }, null, function () {
                                    _this.shadow = false;
                                    _this.currentNumber = val;
                                    _this.numberStyle = calStyleFromNumber(val, width);
                                    setTimeout(function () {
                                        _this.addAnimation();
                                    }, 10);
                                }, this.duration);
                            }
                            break;
                        case "new":
                            _this.currentNumber = val;
                            this.numberStyle = calStyleFromNumber(val, width);
                            _this.tween({scale: 0.5}, {scale: 1}, function (object) {
                                _this.numberStyle.transform = "scale("+Number(object.scale).toFixed(2)+","+Number(object.scale).toFixed(2)+")";
                            }, null, null, this.duration);
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