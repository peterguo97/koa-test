/**
 * 
 * @param {String} redirectPath 
 * @param {Array} arr inital the allowed path
 * @param {Array} conditions inital the judge condition
 */

function Intercept(redirectPath,arr,conditions) {
    var context = this;
    this.arr = arr || [];
    this.conditions = conditions || [];
    this.redirectPath = redirectPath;
    this.intercept = async (ctx, next) => {
        let path = ctx.request.path;
        let result = true;
        if(context.conditions.length){
            context.conditions.forEach((fn)=>{
                if(! fn(ctx.session) ){
                    result = false;
                }
            })
        }
        if ( !result && context.arr.indexOf(path) === -1 ){
            ctx.redirect(context.redirectPath);
        } else {
            await next();
        }
    }
}

Intercept.prototype.add = function (item, isCondition = false) {
    if( ! isCondition){
        if (typeof (item) !== 'string') {
            throw TypeError('this condition is not a string');
        }
        if(this.arr.indexOf(item) === -1){
            this.arr.push(item);
        }
    }
    else{
        if(typeof(item) !== 'function'){
            throw TypeError('this condition is not a function');
        }
        this.conditions.push(item);
    }
    return this; //链式调用
}

module.exports = Intercept;