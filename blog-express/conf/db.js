const env = process.env.NODE_ENV; // 环境参数

// 配置
let MYSQL_CONF = {};
let REDIS_CONF = {};

if (env === 'dev') {
  MYSQL_CONF = {
    host: 'localhost',
    user: 'root',
    password: 'root',
    port: '3090',
    database: 'myblog',
  };
  REDIS_CONF = {
    port: 6379,
    host: '127.0.0.1',
    auth_pass: '123456',
  };
}

if (env === 'production') {
  MYSQL_CONF = {
    host: 'localhost',
    user: 'root',
    password: 'root',
    port: '3090',
    database: 'myblog',
  };
  REDIS_CONF = {
    port: 6379,
    host: '127.0.0.1',
    auth_pass: '123456',
  };
}

module.exports = {
  MYSQL_CONF,
  REDIS_CONF,
};
