const User = require('../model/student');
const crypto = require('crypto');
const secret = 'just to try';

let login = async function (ctx,next) {
    
    ctx.response.body = `
        <form action="/userlogin" method="post">
        <div>
            <label>手机</label>
            <input type="text" name="id" value=""/>
        </div>
        <div>
            <label>密码</label>
            <input type="password" name="pass" value=""/>
        </div>
        <div>
            <input type="submit" value="提交" />
        </div>
        </form>
    `
}

let userlogin = async function (ctx,next) {
    let request = ctx.request.body;
    let id = request.id;
    let result = null;
    try {
        result = await User.findById(id);
        let userpass = getPassword(request.pass);
        request.pass = '';
        if(result.pass === userpass){
            ctx.session.user = id;
            console.log(ctx.session);
            ctx.redirect('/hello/petter');
        }
        else{
            ctx.response.body = `<h1>密码错误</h1>`
        }
    } catch (error) {
        ctx.response.body = `<div>
            <a href="/register">你还未注册，请前往注册</a>
        </div>`;
    }
}

let register = async function (ctx,next) {
    ctx.render('register.html')
}

let regist = async function (ctx,next) {
    let id = ctx.request.body.userphone;
    let name = ctx.request.body.username;
    let pass = ctx.request.body.password;
    let result = null;
    try {
        result = await User.findById(id);
    } catch (error) {
        console.log(error);
    }
    
    if(!result){
       let userpass = getPassword(pass);
        const user = User.build({
            id: id,
            name: name,
            pass: userpass,
            gender: true
        });
        try {
            let result = await user.save();
        } catch (e) {
            console.log(e);
        }
    }
    else{
        console.log('此用户已注册');
    }
}

function getPassword(pass) {
     const hash = crypto.createHash('md5');
     hash.update(pass);
     const userpass = hash.digest('hex');
     return userpass;
}

module.exports = {
    'GET /login': login,
    'POST /userlogin' : userlogin,
    'GET /register': register,
    'POST /regist': regist
}