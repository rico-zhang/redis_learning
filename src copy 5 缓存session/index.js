const express = require('express');
const session = require('express-session');
const redis = require('redis')
let RedisStore = require('connect-redis')(session)
let redisClient = redis.createClient()
redisClient.select(6)
const app = express();
app.use(session({
    secret: 'rico',
    resave: false,
    saveUninitialized: false,
    store: new RedisStore({ client: redisClient ,ttl:10}),
}));

app.get('/a', (req, res) => {
    if (!req.session.a) {
        req.session.a = 1;
        req.session.b = 2;
        req.session.ran = Math.random();
    }
    res.send('session 已设置');
});

app.get('/b', (req, res) => {
    console.log(req.session);
    res.send(req.session)
})

app.listen(9527, () => {
    console.log('listen on port 9527');
})