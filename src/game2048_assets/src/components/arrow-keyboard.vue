<template>
    <div class="keyboard">
        <div class="first-row">
            <a  class="up-key" @click="$emit('up-click')">
                &and;
            </a>
        </div>
        <div class="second-row">
            <a  class="left-key" @click="$emit('left-click')">
                &lt;
            </a>
            <a  class="right-key" @click="$emit('right-click')">
                &gt;
            </a>
        </div>
        <div class="third-row">
            <a  class="down-key" @click="$emit('down-click')">
                &or;
            </a>
        </div>
    </div>
</template>

<script>
    export default {
        name: "arrow-keyboard"
    }
</script>

<style scoped>
    .keyboard {
        position: relative;
        weight: 100%;
        height: 0;
        padding-top: 100%;
    }

    .first-row {
        position: absolute;
        left:0px;
        right: 0px;
        top: 0px;
        bottom: 60%;
        weight: 100%;
        height: 0;
        padding-top: 33%;
        margin: auto;
        text-align: center;
        font-weight: bold;
    }

    .second-row {
        position: absolute;
        left:0px;
        right: 0px;
        top: 33%;
        bottom: 33%;
        weight: 100%;
        height: 0;
        padding-top: 33%;
        margin: auto;
        text-align: center;
        font-weight: bold;
    }

    .third-row {
        position: absolute;
        left:0px;
        right: 0px;
        top: 66%;
        bottom: 0px;
        weight: 100%;
        height: 0px;
        padding-top: 33%;
        margin: auto;
        text-align: center;
        font-weight: bold;
    }

    .up-key {
        position: absolute;
        left:0px;
        right: 0px;
        top: 0px;
        bottom: 0px;
        weight: 0px;
        margin: auto;
        padding-top: 16.5%;
        text-align: center;
        font-weight: bold;
        font-size: 4vw;
    }

    .left-key {
        position: absolute;
        left:0px;
        right: 50%;
        top: 0px;
        bottom: 0px;
        padding-top: 16.5%;
        margin: auto;
        text-align: center;
        font-weight: bold;
        font-size: 4vw;
    }

    .right-key {
        position: absolute;
        left:50%;
        right: 0;
        top: 0;
        bottom: 0;
        padding-top: 16.5%;
        margin: auto;
        text-align: center;
        font-weight: bold;
        font-size: 4vw;
    }

    .down-key {
        position: absolute;
        left:0px;
        right: 0px;
        top: 0px;
        bottom: 0px;
        padding-top: 16.5%;
        margin: auto;
        text-align: center;
        font-weight: bold;
        font-size: 4vw;
    }
</style>