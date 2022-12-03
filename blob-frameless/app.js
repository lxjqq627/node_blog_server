const querystring = require('querystring');
const { get, set } = require('./src/db/redis');
const handleBologRouter = require('./src/router/blog');
const handleUserRouter = require('./src/router/user');
// 设置 cookie 过期时间
const getCookieExpires = () => {
  const d = new Date();
  d.setTime(d.getTime() + 24 * 60 * 60 * 1000);
  return d.toGMTString();
};

// 用户处理 post data 的函数 (promise)
const getPostData = (req) => {
  const promise = new Promise((resolve, reject) => {
    if (req.method !== 'POST') {
      resolve({});
      return;
    }
    if (req.headers['content-type'] !== 'application/json') {
      resolve({});
      return;
    }
    let postData = '';
    req.on('data', (chunk) => {
      postData += chunk.toString();
    });
    req.on('end', () => {
      if (!postData) {
        resolve({});
        return;
      }
      resolve(JSON.parse(postData));
    });
  });
  return promise;
};

const serverHandle = (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', 'true'); // 允许跨域携带 cookie
  res.setHeader('Access-Control-Allow-Origin', '*'); // 允许跨域
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS'); // 允许跨域的方法

  res.setHeader('Content-type', 'application/json');
  const url = req.url;
  req.path = url.split('?')[0];

  req.query = querystring.parse(url.split('?')[1]);

  // 解析 cookie
  req.cookie = {}; // 初始化 cookie
  const cookieStr = req.headers.cookie || ''; // k1=v1;k2=v2;k3=v3
  cookieStr.split(';').forEach((item) => {
    if (!item) {
      return;
    }
    const arr = item.split('=');
    const key = arr[0].trim();
    const val = arr[1].trim();
    req.cookie[key] = val;
  });

  // 解析 session (使用 redis)
  let needSetCookie = false;
  let userId = req.cookie.userid;
  if (!userId) {
    needSetCookie = true;
    userId = `${Date.now()}_${Math.random()}`;
    // 初始化 redis 中的 session 值
    set(userId, {});
  }

  // 获取 session
  req.sessionId = userId;
  get(req.sessionId).then((sessionData) => {
    if (sessionData == null) {
      // 初始化 redis 中的 session 值
      set(req.sessionId, {});
      // 设置 session
      req.session = {};
    } else {
      // 设置 session
      req.session = sessionData;
    }
    // 处理postdata
    return getPostData(req);
  });

  getPostData(req).then((postData) => {
    req.body = postData;

    // 处理blog路由
    const blogResult = handleBologRouter(req, res);
    if (blogResult) {
      blogResult.then((blogData) => {
        if (needSetCookie) {
          res.setHeader(
            'Set-Cookie',
            `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`
          );
        }
        res.end(JSON.stringify(blogData));
      });
      return;
    }

    // 处理user路由
    const userResult = handleUserRouter(req, res);
    if (userResult) {
      userResult.then((userData) => {
        if (needSetCookie) {
          res.setHeader(
            'Set-Cookie',
            `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`
          );
        }
        res.end(JSON.stringify(userData));
      });
      return;
    }

    // 未命中路由，返回404
    res.writeHead(404, { 'Content-type': 'text/plain' }); // text/plain: 纯文本
    res.write('404 Not Found\n');
    res.end();
  });
};

module.exports = serverHandle;
