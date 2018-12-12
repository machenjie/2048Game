<template>
    <div ref="box" class="box" :style="{backgroundColor: numberStyle.backgroundColor}" >
        <tween-number
                class="number"
                v-bind="$attrs"
                :style="numberStyle"
                :number="number"
                :duration="200">
        </tween-number>
        <button @click="add">add</button>
    </div>
</template>

<script>
    import tweenNumber from "./tween-number";

    const COLOR_LIST = [
        "Sienna",
        "GoldenRod",
        "Salmon",
        "Tomato",
        "LightSalmon",
        "SandyBrown",
        "Wheat",
        "PeachPuff",
        "Moccasin",
        "MistyRose",
        "Khaki",
        "LemonChiffon",
        "PapayaWhip",
        //"SeaShell",
    ];

    const FONT_PEC = 1.5;

    function calStyleFromNumber(number, width) {
        let display = number===0?"none":"block";
        let lineHeight = "8vw";
        let fontSize = "4vw";
        let fontColorIndex = number===0?0:Math.log2(number)%COLOR_LIST.length;
        let fontColor = fontColorIndex<(COLOR_LIST.length/2)?"#8f7a66":"#F8F8F8";
        let backgroundColor = number===0?"Snow":COLOR_LIST[COLOR_LIST.length-fontColorIndex-1];

        if (width != 0){
            if (String(number).length === 1){
                fontSize = Number(width*0.6/String(number).length).toFixed() + "px";
            }
            else if (String(number).length === 2){
                fontSize = Number(width*1/String(number).length).toFixed() + "px";
            }
            else{
                fontSize = Number(width*FONT_PEC/String(number).length).toFixed() + "px";
            }
            console.log(fontSize);
            lineHeight = width+"px";
        }

        return {
            display: display,
            fontSize: fontSize,
            lineHeight: lineHeight,
            color: fontColor,
            backgroundColor: backgroundColor
        };
    }

    export default {
        name: "number",
        props:{
            number:{
                type: Number
            },
            viewWidth: ""
        },
        data: function () {
            return {
                numberStyle: calStyleFromNumber(this.number, 0)
            }
        },
        methods: {
            add: function () {
                this.number = this.number*2;
            }
        },
        watch: {
            number: function (val) {
                this.numberStyle = calStyleFromNumber(val, this.$refs.box.clientWidth);
            },
            viewWidth: function () {
                this.numberStyle = calStyleFromNumber(this.number, this.$refs.box.clientWidth);
            }
        },
        mounted: function() {
            const _this = this;
            _this.$nextTick(()=>{
                _this.numberStyle = calStyleFromNumber(_this.number, _this.$refs.box.clientWidth);
            })
        },
        components:{
            tweenNumber
        }
    };
</script>

<style scoped>
    .box {
        weight: 100%;
        height: 0;
        padding-top: 90%;
        margin: 5%;
        border-radius: 3%;
    }
    .number{
        position: absolute;
        left:0px;
        right: 0px;
        top: 0px;
        bottom: 0px;
        margin: 5%;
        border-radius: 3%;
        text-align: center;
        font-weight: bold;
    }
</style>