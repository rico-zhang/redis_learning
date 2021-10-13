const express = require('express');
const Router = express.Router;

const app = express();

const router = new Router();
router.get('/:id',require('./cache')({ttl:10}), (req, res) => {
    console.log('没有使用缓存');
    res.send({
        name: '文章名称' + req.params.id,
        title: '文章标题' + req.params.id
    });
});
app.use('/api/news',router)

app.listen(9527, () => {
    console.log('listen on port 9527');
})