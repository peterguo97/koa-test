let hello = async(ctx,next) => {
    var name = ctx.params.name;
    ctx.response.body = {
        hello: 'world'
    };
}

module.exports = {
    'GET /hello/:name': hello
}