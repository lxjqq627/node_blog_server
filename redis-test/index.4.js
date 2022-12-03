const redis = require('redis');

(async function () {
  // 创建客户端
  const redisClient = redis.createClient(6379, '127.0.0.1', {
    auth_pass: '123456',
  });

  // 链接
  await redisClient
    .connect()
    .then(() => {
      console.log('redis connect success');
    })
    .catch((err) => {
      console.log('redis connect fail', err);
    });

  await redisClient.set('myname', 'zhangsan333');

  const myname = await redisClient.get('myname');
  console.log('myname---------->', myname);

  // 退出
  redisClient.quit();
})();
