<template>
    <div class="level-choose" @keyup.stop="" @keydown.stop="">
        <a id="choose-btn" data-toggle="modal" :data-target='"#choose-dialog"+dialogTag'>Level {{currentLevel}}</a>
        <div :id='"choose-dialog"+dialogTag' class="modal fade">
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
                        <label for="email">Please input your e-mail address:</label>
                        <input id="email" type="email" v-model="email">
                    </div>

                    <!-- footer -->
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" data-dismiss="modal">close</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "level-choose",
        props: {
            dialogTag: "",
            chooseList: [],
        },
        data: function () {
            return {
                currentLevel: 1,
            }
        }
    }
</script>

<style scoped>
    .level-choose{
        padding: 0;
        text-align: center;
        width: 100px;
        font-size: 20px;
        font-weight: bold;
        border-radius: 3px;
        cursor: pointer;
        color: #776e65;
        vertical-align: middle;
    }

    #choose-btn:hover{
        color: #FF5432;
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