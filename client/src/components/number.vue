<template>
    <div ref="box" class="box" >
        <tween-number
                class="number"
                v-bind="$attrs"
                :style="numberStyle"
                :number="number"
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
        "#FF4321",
        "#FF5432",
        "#FF6543",
        "#FF7654",
        "#FF8765",
        "#FF9876",
        "#FFA987",
        "#FFBA98",
        "#FFCBA9",
        "#FFECBA",
        "#EDE0C8",
        "#EEE4DA",
    ];

    const FONT_PEC = 1.5;

    function calStyleFromNumber(number, width) {
        let display = number===0?"none":"block";
        let lineHeight = "8vw";
        let fontSize = "4vw";
        let fontColorIndex = number===0?0:(Math.log2(number)-1)%COLOR_LIST.length;
        let fontColor = fontColorIndex<4?"#8f7a66":"#F8F8F8";
        let backgroundColor = number===0?"#BBADA0":COLOR_LIST[COLOR_LIST.length-fontColorIndex-1];

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
        // methods: {
        //     add: function () {
        //         this.number =this.number*2;
        //     }
        // },
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
        height: 0;
        padding-top: 90%;
        margin: 5%;
        border-radius: 3%;
        background-color: #BBADA0;
    }
    .number{
        position: absolute;
        left:0;
        right: 0;
        top: -10px;
        bottom: 10px;
        margin: 5%;
        border-radius: 3%;
        text-align: center;
        font-weight: bold;
    }
</style>