<template>
    <div v-bind="$attrs">
        {{tweenNumber}}
    </div>
</template>

<script>
    export default {
        name: "tween-number",
        props:{
            number:{
                type: Number
            },
            duration:{
                type: Number,
                default: 1000
            }
        },
        data: function () {
            return {
                tweenNumber: this.number,
            }
        },
        methods: {
            tween: function (startValue, endValue) {
                function animate () {
                    if (TWEEN.update()) {
                        requestAnimationFrame(animate)
                    }
                }

                let _this=this;
                new TWEEN.Tween({ num: startValue })
                    .to({num: endValue }, _this.duration)
                    .easing(TWEEN.Easing.Quadratic.Out)
                    .onUpdate(function (object) {
                        _this.tweenNumber = Number(object.num).toFixed(0)
                    })
                    .start();

                animate();
            }
        },
        watch: {
            number: function (val) {
                this.tween(this.tweenNumber, val);
            }
        }
    };
</script>

<style scoped>

</style>