<template>
    <div id="rate-feedback" @keyup.stop="" @keydown.stop="">
        <div id="rate-area" data-toggle="tooltip" data-placement="bottom" title="Good Job!">
            <a href="ms-windows-store://review/?ProductId=9WZDNCRFHVJL">&#10084;</a>
        </div>
        <div id="feedback-area" data-toggle="tooltip" data-placement="bottom" title="I Want Say!">
            <a data-toggle="modal" :data-target='"#feedback-dialog"+dialogTag'>&#9993;</a>
        </div>
        <div :id='"feedback-dialog"+dialogTag' class="modal fade">
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
                        <label for="comment">Please input your feedback and suggestions:</label>
                        <textarea id="comment" v-model="comment"></textarea>
                        <label for="email">Please leave your e-mail address:</label>
                        <input id="email" type="email" v-model="email">
                    </div>

                    <!-- footer -->
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">cancel</button>
                        <button type="button" class="btn btn-primary" data-dismiss="modal" @click="feedback">submit</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "rate-feedback",
        props: {
            dialogTag: "",
        },
        data: function() {
            return {
                email: "",
                comment: "",
            }
        },
        methods: {
            feedback: function () {
                console.log("feedback", this.email, this.comment);
                $.post('http://192.168.1.107:8080/feedback', {
                    email: this.email,
                    comment: this.comment,
                }).done(function () {
                    console.log("success");
                }).fail(function (xhr, status) {
                    console.log('失败: ' + xhr.status + ', 原因: ' + status)
                });
                this.comment = "";
                this.email = "";
            }
        },
        mounted: function () {
            this.$nextTick(function () {
                $('[data-toggle="tooltip"]').tooltip();
            });
        }
    }
</script>

<style scoped>
    #rate-feedback{
        padding: 0;
        text-align: center;
    }

    #rate-area, #feedback-area{
        display: inline-block;
        margin: 0;
        padding: 0;
    }

    #rate-area a, #feedback-area a{
        height: 30px;
        font-size: 25px;
        color: #b0a597;
        line-height: 30px;
        cursor: pointer;
    }

    #rate-area a:hover, #feedback-area a:hover {
        color: #ff0000;
        text-decoration: none;
    }

    .modal {
        margin-top: 30vh;
    }

    .modal-body{
        text-align: left;
        padding-top: 10px;
    }

    .modal-body label {
        display: block;
        font-size: 14px;
        margin-top: 15px;
        margin-bottom: 5px;
    }

    #comment, #email {
        display: block;
        width: 100%;
        padding-left: 5px;
        background-color: #f3f3f3;
        border: 1px solid #f3f3f3;
        border-radius: 3px;
    }

    #comment:focus, #email:focus {
        background-color: #ffffff;
        border: 1px solid #0697ff;
    }

    .modal-footer{
        border-top: 0;
        padding-top: 10px;
        padding-bottom: 20px;
    }
</style>
<style>
    .tooltip{
        opacity: 0.7 !important; /*Make the entire tooltip not transparent*/
    }
    .bs-tooltip-top .arrow::before, .bs-tooltip-auto[x-placement^="top"] .arrow::before {
        border-top-color: #b0a597  !important; /*change the triangle color when data-placement="top"*/
    }
    .bs-tooltip-right .arrow::before, .bs-tooltip-auto[x-placement^="right"] .arrow::before {
        border-right-color: #b0a597  !important; /*change the triangle color when data-placement="right"*/
    }
    .bs-tooltip-bottom .arrow::before, .bs-tooltip-auto[x-placement^="bottom"] .arrow::before {
        border-bottom-color:#b0a597  !important; /*change the triangle color when data-placement="bottom"*/
    }
    .bs-tooltip-left .arrow::before, .bs-tooltip-auto[x-placement^="left"] .arrow::before {
        border-left-color: #b0a597  !important; /*change the triangle color when data-placement="left"*/
    }
    .tooltip-inner{
        background-color: #b0a597 !important; /*modify background color*/
        text-align: left !important; /*Font left aligned*/
        color: #ffffff !important; /*font color*/
        border:1px solid #b0a597 ; /*add boder*/
        max-width: 400px !important; /*Modify width*/
        font-weight: bold;
        font-family: "Times New Roman",Georgia,Serif,sans-serif;
    }
</style>