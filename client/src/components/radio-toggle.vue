<template>
    <img :src='radioStat?"/images/radio/radio-on.png":"/images/radio/radio-off.png"' alt=""
         @click="changeRadioStat">
</template>

<script>
    export default {
        name: "radio-toggle",
        props: {
            value: {},
        },
        data: function () {
            return {
                radioStat: this.value,
            };
        },
        watch: {
            value: function () {
                this.radioStat = this.value;
            }
        },
        methods: {
            changeRadioStat: function () {
                let store = {
                    radioStat: !this.radioStat,
                };
                localStorage.setItem("_2048_game_radio_stat_data", JSON.stringify(store));
                this.$emit('input', !this.radioStat);
            }
        },
        mounted: function(){
            let _this = this;
            _this.$nextTick(function () {
                let data = localStorage.getItem("_2048_game_radio_stat_data");
                if (data) {
                    let {radioStat} = JSON.parse(data);
                    if (typeof(radioStat) !== "undefined" && radioStat !== this.radioStat) {
                        _this.changeRadioStat();
                    }
                }
            });
        },
    }
</script>

<style scoped>
    img {
        cursor: pointer;
    }
</style>