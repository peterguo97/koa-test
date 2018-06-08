const Koa = require('koa');
const bodyParser = require("koa-bodyparser")
const router = require('koa-router')();
const controller = require('./controller');
const templating = require('./templating');
const isProduction = process.env.NODE_ENV === 'production';
const cors = require('koa-cors');

// 创建一个Koa对象表示web app本身:
const app = new Koa();

app.use( async (ctx,next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}`);
    var
        start = new Date().getTime(),
        execTime;
    await next();
    execTime = new Date().getTime() - start;
    ctx.response.set('X-Response-Time', `${execTime}ms`);
})

if(!isProduction){
    const staticFiles = require('./static-files.js');
    app.use(staticFiles('/static/',__dirname + '/static'));
}
app.use(bodyParser());
app.use(cors());
app.use(templating('views', {
    noCache: !isProduction,
    watch: !isProduction
}));

// 对于任何请求，app将调用该异步函数处理请求：
app.use(controller());

app.use(router.routes());
// 在端口3000监听:
app.listen(3000);
console.log('app started at port 3000...');