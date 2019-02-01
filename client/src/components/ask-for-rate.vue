<template>
    <div id="rate-feedback-modal" class="modal fade">
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
                    Do you like this app?
                </div>

                <!-- footer -->
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">cancel</button>
                    <a class="btn btn-primary" href="ms-windows-store://review/?ProductId=9NN76P3B5D8G" @click="modalHide">yes</a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "ask-for-rate",
        methods: {
            modalHide: function () {
                $("#rate-feedback-modal").modal('hide');
            },
        },
        mounted() {
            this.$nextTick(function () {
                let data = localStorage.getItem("_2048_game_ask_rate");
                if (data) {
                    let startCount = JSON.parse(data);
                    startCount.num = startCount.num + 1;
                    localStorage.setItem("_2048_game_ask_rate", JSON.stringify(startCount));
                    if (startCount.num === 3 || startCount.num === 21){
                        $("#rate-feedback-modal").modal('show');
                    }
                }
                else {
                    localStorage.setItem("_2048_game_ask_rate", JSON.stringify({num: 1}));
                }
            })
        }
    }
</script>

<style scoped>
    .modal-content {
        margin-top: 30vh;
        background: #faf8ef;
        border: 0;
    }

    .modal-body{
        text-align: left;
        padding-top: 10px;
        font-size: 32px;
    }

    .modal-footer{
        border-top: 0;
        padding-top: 10px;
        padding-bottom: 20px;
    }

    .modal-footer a{
        width: 100px;
    }

    .modal-footer button{
        width: 100px;
    }
</style>