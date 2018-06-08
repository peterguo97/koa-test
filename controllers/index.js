let index = async (ctx, next) => {
   ctx.render('index.html',{
       title: 'Welcome'
   })
}

module.exports = {
    'GET /': index,
}