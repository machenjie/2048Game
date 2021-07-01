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
                    {{$t('ask')}}
                </div>

                <!-- footer -->
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal" @click="rateNo">{{$t('no')}}</button>
                    <a class="btn btn-primary" href="ms-windows-store://review/?ProductId=9NN76P3B5D8G" @click="modalHide">{{$t('yes')}}</a>
                </div>
            </div>
        </div>
    </div>
</template>

<i18n>
    {
    "ar": {"ask":"إعطاء بعض التشجيع على هذا التطبيق.","yes":"الآن","no":"في وقت لاحق"} ,
    "ko": {"ask":"이 앱에 약간의 격려를하십시오.","yes":"지금","no":"후에"} ,
    "de": {"ask":"Ermutigen Sie diese App.","yes":"Jetzt","no":"Später"} ,
    "ru": {"ask":"Дайте некоторую поддержку этому приложению.","yes":"Сейчас","no":"Потом"} ,
    "fr": {"ask":"Donnez des encouragements à cette application.","yes":"À présent","no":"Plus tard"} ,
    "bn": {"ask":"এই অ্যাপ্লিকেশন কিছু উত্সাহ দিন।","yes":"এখন","no":"পরবর্তীতে"} ,
    "pt-br": {"ask":"Dê um pouco de incentivo para este aplicativo.","yes":"Agora","no":"Mais tarde"} ,
    "ja": {"ask":"このアプリにいくつかの励ましを与えます。","yes":"今","no":"後"} ,
    "es": {"ask":"Dar un poco de ánimo a esta aplicación.","yes":"Ahora","no":"Luego"} ,
    "hi": {"ask":"इस ऐप को कुछ प्रोत्साहन दें।","yes":"अभी व","no":"बाद में"} ,
    "zh-cn": {"ask":"给这个应用程序一些鼓励。","yes":"马上","no":"以后"} ,
    "zh-tw": {"ask":"給這個應用程序一些鼓勵。","yes":"馬上","no":"以後"} ,
    "zh-hk": {"ask":"給這個應用程序一些鼓勵。","yes":"馬上","no":"以後"} ,
    "en": {"ask": "Give some encouragement to this app.", "yes": "Now", "no": "Later"}
    }
</i18n>

<script>
    import GaReport, {CategoryActions} from '../api/ga-report';

    export default {
        name: "ask-for-rate",
        methods: {
            modalHide: function () {
                localStorage.setItem("_2048_game_ask_rate", JSON.stringify({num: 100}));
                $("#rate-feedback-modal").modal('hide');
                GaReport(this.$store.state.config.uuid, this.$store.state.config.versionNO, CategoryActions.GA_RATE.name, CategoryActions.GA_RATE.actions.OPERATION_YES);
            },
            rateNo: function () {
                GaReport(this.$store.state.config.uuid, this.$store.state.config.versionNO, CategoryActions.GA_RATE.name, CategoryActions.GA_RATE.actions.OPERATION_NO);
            }
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