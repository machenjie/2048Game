const Koa = require("koa");
const KoaRouter = require("koa-router");
const KoaBodyParser = require("koa-bodyparser");
const fs = require('fs');

let app = new Koa();
let router = new KoaRouter();
let fd = null;
fs.open('feedback.csv', "a", function (err, f) {
    fd = f;
});

router.post('/feedback', async (ctx, next) => {
    if (typeof(ctx.request.body.email)==="string" && typeof(ctx.request.body.comment)==="string" && fd !== null) {
        let comment = ctx.request.body.comment.replace(/"/g, "");
        let email = ctx.request.body.email.replace(/"/g, "");
        let output = "\""+email+"\","
            +"\""+comment+"\","
            +ctx.request.host
            +",\""+new Date(Date.now()).toUTCString()+"\"\n";
        fs.appendFile(fd, output, 'utf8', function () {
        });
    }
    await next();
    ctx.status = 200;
});

app.use(KoaBodyParser());
app.use(router.routes());
app.listen(8080);