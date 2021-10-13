const redis = require('redis');
const {promisify} = require('util')

const client = redis.createClient();

client.set("name","rico",(err,reply)=>{
    console.log(reply);
});

client.get("name",(err,reply)=>{
    console.log(reply);
});

//封装成异步模式
const asyncGet = promisify(client.get).bind(client);
asyncGet('name').then(reply=>{console.log(reply);})