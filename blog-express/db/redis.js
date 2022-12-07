const redis = require('redis');
const { REDIS_CONF } = require('../conf/db');

// 创建客户端
const redisClient = redis.createClient(REDIS_CONF.port, REDIS_CONF.host, {
  auth_pass: REDIS_CONF.auth_pass,
});
redisClient.on('error', (err) => {
  console.error(err);
});

// // set
// function set(key, val) {
//   if (typeof val === 'object') {
//     val = JSON.stringify(val);
//   }
//   redisClient.set(key, val, redis.print);
// }

// // get
// function get(key) {
//   const promise = new Promise((resolve, reject) => {
//     redisClient.get(key, (err, val) => {
//       if (err) {
//         reject(err);
//         return;
//       }
//       if (val == null) {
//         resolve(null);
//         return;
//       }
//       try {
//         resolve(JSON.parse(val));
//       } catch (e) {
//         resolve(val);
//       }
//     });
//   });

//   return promise;
// }

// module.exports = {
//   set,
//   get,
// };
module.exports = redisClient;
