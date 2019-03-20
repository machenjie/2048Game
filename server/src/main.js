const Koa = require("koa");
const KoaRouter = require("koa-router");
const KoaBodyParser = require("koa-bodyparser");
const mysqlDB = require("./mysqldb");
const FeedbackStore = require("./feedback-store");

let app = new Koa();
let router = new KoaRouter();

(async function(){
    try {
        await FeedbackStore.init(mysqlDB);
        router.post('/feedback', async (ctx, next) => {
            if (typeof(ctx.request.body.email)==="string" && typeof(ctx.request.body.comment)==="string") {
                try{
                    await FeedbackStore.addOne({
                        email: ctx.request.body.email,
                        comment: ctx.request.body.comment,
                        srcIP: ctx.request.ip
                    });
                }
                catch (e) {
                    console.error(e);
                }
            }
            await next();
            ctx.status = 200;
        });
        app.use(KoaBodyParser());
        app.use(router.routes());
        app.listen(7890);
    }catch (e) {
        console.log(e);
    }
}());