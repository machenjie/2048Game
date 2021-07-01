<template>
    <div id="rate-feedback" @keyup.stop="" @keydown.stop="">
        <div id="rate-area" data-toggle="tooltip" data-placement="bottom" :title='$t("rate")'>
            <a href="ms-windows-store://review/?ProductId=9NN76P3B5D8G" @mousedown="rateDown">&#10084;</a>
        </div>
        <div id="feedback-area" data-toggle="tooltip" data-placement="bottom" :title='$t("feedback")'>
            <a data-toggle="modal" :data-target='"#feedback-dialog"+dialogTag' @mousedown="feedbackShow">&#9993;</a>
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
                        <label for="comment">{{$t('content')}}</label>
                        <textarea id="comment" v-model="comment"></textarea>
                        <label for="email">{{$t('email')}}</label>
                        <input id="email" type="email" v-model="email">
                    </div>

                    <!-- footer -->
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal" @click="cancel">{{$t('cancel')}}</button>
                        <button type="button" class="btn btn-primary" data-dismiss="modal" @click="feedback">{{$t('submit')}}</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<i18n>
    {
    "ar": {"rate":"عمل جيد!","feedback":"اريد ان اقول!","content":"يرجى إدخال ملاحظاتك واقتراحاتك:","email":"يرجى إدخال عنوان البريد الإلكتروني الخاص بك:","cancel":"إلغاء","submit":"خضع"} ,
    "ko": {"rate":"잘 했어!","feedback":"나는 말해봐!","content":"의견 및 제안 사항을 입력하십시오.","email":"귀하의 전자 메일 주소를 입력하십시오 :","cancel":"취소","submit":"제출하다"} ,
    "de": {"rate":"Gut gemacht!","feedback":"Ich will sagen!","content":"Bitte geben Sie Ihr Feedback und Ihre Vorschläge ein:","email":"Bitte geben Sie Ihre E-Mail-Adresse ein:","cancel":"stornieren","submit":"einreichen"} ,
    "ru": {"rate":"Хорошая работа!","feedback":"Я хочу сказать!","content":"Пожалуйста, введите ваши отзывы и предложения:","email":"Пожалуйста, введите свой адрес электронной почты:","cancel":"отменить","submit":"Отправить"} ,
    "fr": {"rate":"Bon travail!","feedback":"Je veux dire!","content":"S'il vous plaît entrer vos commentaires et suggestions:","email":"Veuillez saisir votre adresse e-mail:","cancel":"Annuler","submit":"soumettre"} ,
    "bn": {"rate":"সাবাশ!","feedback":"আমি বলতে চাইছি!","content":"আপনার প্রতিক্রিয়া এবং পরামর্শ ইনপুট করুন:","email":"আপনার ইমেইল ঠিকানা ইনপুট করুন:","cancel":"বাতিল","submit":"জমা দিন"} ,
    "pt-br": {"rate":"Bom trabalho!","feedback":"Eu quero dizer!","content":"Por favor insira seus comentários e sugestões:","email":"Por favor insira o seu endereço de e-mail:","cancel":"cancelar","submit":"enviar"} ,
    "ja": {"rate":"よくやった！","feedback":"私は言いたい！","content":"あなたのフィードバックや提案を入力してください：","email":"あなたのEメールアドレスを入力してください：","cancel":"キャンセル","submit":"提出する"} ,
    "es": {"rate":"¡Buen trabajo!","feedback":"¡Yo quiero decir!","content":"Por favor ingrese sus comentarios y sugerencias:","email":"Por favor ingrese su dirección de correo electrónico:","cancel":"cancelar","submit":"enviar"} ,
    "hi": {"rate":"बहुत बढ़िया!","feedback":"मैं कहना चाहता हूॅं!","content":"कृपया अपनी प्रतिक्रिया और सुझाव दें:","email":"कृपया अपना ई-मेल पता डालें:","cancel":"रद्द करना","submit":"जमा करें"} ,
    "zh-cn": {"rate":"五星好评！","feedback":"我要吐槽！","content":"请输入您的反馈和建议：","email":"请输入您的电子邮件地址：","cancel":"取消","submit":"提交"} ,
    "zh-tw": {"rate":"五星好評！","feedback":"我要吐槽！","content":"請輸入您的反饋和建議：","email":"請輸入您的電子郵件地址：","cancel":"取消","submit":"提交"} ,
    "zh-hk": {"rate":"五星好評！","feedback":"我要吐槽！","content":"請輸入您的反饋和建議：","email":"請輸入您的電子郵件地址：","cancel":"取消","submit":"提交"} ,
    "en": { "rate": "Good Job!", "feedback": "I Want Say!", "content": "Please input your feedback and suggestions:", "email": "Please input your e-mail address:", "cancel": "cancel", "submit": "submit"}
    }
</i18n>

<script>
    import GaReport, {CategoryActions} from '../api/ga-report';

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
                //console.log("feedback", this.email, this.comment);
                $.post('http://www.laoyoutiao.xin:7890/feedback', {
                    email: this.email,
                    comment: this.comment,
                }).done(function () {
                    //console.log("success");
                }).fail(function (xhr, status) {
                    //console.log('失败: ' + xhr.status + ', 原因: ' + status)
                });
                this.comment = "";
                this.email = "";
                GaReport(this.$store.state.config.uuid, this.$store.state.config.versionNO, CategoryActions.GA_FEEDBACK.name, CategoryActions.GA_FEEDBACK.actions.OPERATION_SUBMIT);
            },
            rateDown: function () {
                GaReport(this.$store.state.config.uuid, this.$store.state.config.versionNO, CategoryActions.GA_RATE.name, CategoryActions.GA_RATE.actions.OPERATION_YES);
            },
            feedbackShow: function () {
                GaReport(this.$store.state.config.uuid, this.$store.state.config.versionNO, CategoryActions.GA_FEEDBACK.name, CategoryActions.GA_FEEDBACK.actions.OPERATION_SHOW);
            },
            cancel: function () {
                GaReport(this.$store.state.config.uuid, this.$store.state.config.versionNO, CategoryActions.GA_FEEDBACK.name, CategoryActions.GA_FEEDBACK.actions.OPERATION_CANCEL);
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

    .modal-content {
        margin-top: 30vh;
        background: #faf8ef;
        border: 0;
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
        background-color: #BBADA0;
        border: 1px solid #BBADA0;
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