const { exec, escape } = require('../db/mysql'); // 引入数据库操作
const { genPassword } = require('../utils/cryp');

const login = (username, password) => {
  username = escape(username); // 防止sql注入
  password = genPassword(password); // 生成加密密码
  password = escape(password); // 防止sql注入

  const sql = `select username, realname from users where username=${username} and password=${password}`;
  return exec(sql).then((rows) => {
    return rows[0] || {};
  });
};

module.exports = {
  login,
};
