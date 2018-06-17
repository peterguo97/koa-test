const Koa = require('koa');
const bodyParser = require("koa-bodyparser")
const router = require('koa-router')();
const controller = require('./controller');
const templating = require('./templating');
const isProduction = process.env.NODE_ENV === 'production';
//const cors = require('koa-cors');
const session = require('koa-session2');
const convert = require('koa-convert');
const Intercept = require('./intercept.js');
// 创建一个Koa对象表示web app本身:
const app = new Koa();

const ignorePath = ['/login','/userlogin','/register'];

const intercept = new Intercept('/login',ignorePath);
intercept.add( (sess) => {
    if(! sess.user){
        return false;
    }
    return true;
}, true);

app.keys = ['just a test'];

app.use(session({
    key: "SESSIONID",
    maxAge: 864000,
    httpOnly: false,
}))

app.use(bodyParser());
//app.use(cors());

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

app.use(templating('views', {
    noCache: !isProduction,
    watch: !isProduction
}));

// 对于任何请求，app将调用该异步函数处理请求：
app.use(intercept.intercept);

app.use(controller());

// 在端口3000监听:
app.listen(3000);
console.log('app started at port 3000...');