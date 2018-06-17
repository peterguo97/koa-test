let hello = async(ctx,next) => {
    var name = ctx.params.name;
    ctx.response.body = `<a href="/hello/jj">test</a>`;
}

module.exports = {
    'GET /hello/:name': hello
}