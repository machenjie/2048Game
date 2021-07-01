<template>
    <div>
        {{tweenNumber}}
    </div>
</template>

<script>
    import StartTween from "../js/start-tween";

    export default {
        name: "tween-number",
        props:{
            number:{
                type: Number
            },
            duration:{
                type: Number,
                default: 1000
            },
            precision:{
                type: Number,
                default: 0
            },
        },
        data: function () {
            return {
                tweenNumber: this.number,
            }
        },
        watch: {
            number: function (val) {
                let _this = this;
                StartTween({num: this.tweenNumber}, {num: val}, function (obj) {
                    _this.tweenNumber = Number(Number(obj.num).toFixed(_this.precision));
                }, this.duration);
            }
        }
    }
</script>

<style scoped>

</style>