const mysql = require('mysql');

// 创建链接对象
const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  port: '3090',
  database: 'myblog',
});

con.connect();

// const sql = 'select * from users';
// const sql = `update users set realname='李四2' where username='lisi'`;

con.query(sql, (err, result) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log(result);
});

// 关闭连接
con.end();
