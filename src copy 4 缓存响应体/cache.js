const redis = require('redis');
const { promisify } = require('util');

const client = redis.createClient();

const asyncGet = promisify(client.get).bind(client);
const asyncSet = promisify(client.set).bind(client);
const asyncExists = promisify(client.exists).bind(client);

// asyncSet('/api/news/1?a=1', JSON.stringify({ a: 1, b: 2 }));

module.exports = function (options = {}) {
    const isJSON = options.isJSON === undefined ? true : options.isJSON;
    const ttl = options.ttl || -1;
    return async function (req, res, next) {
        const key = req.originalUrl;
        const isExists = await asyncExists(key);
        if (isExists) {
            const content = await asyncGet(key);
            console.log('使用了缓存');
            console.log(content);
            let body  =content;
            if(isJSON){
                try {
                   body = JSON.parse(content); 
                } catch (error) {
                }
            }
            res.send(body);
        } else {
            const defaultWrite = res.write.bind(res);
            const defaultEnd = res.end.bind(res);

            const chunks = [];
            res.write = function (chunk, ...args) {
                chunks.push(chunk)
                defaultWrite(chunk, ...args);
            }

            res.end = function (chunk, ...args) {
                if (chunk)
                    chunks.push(chunk);
                const content = chunks.map(chunk => chunk.toString('utf-8')).join()
                if (ttl < 0)
                    asyncSet(key, content);
                else
                    asyncSet(key, content, "EX", ttl)
                defaultEnd(chunk, ...args);
            }
            next();
        }
    }
}