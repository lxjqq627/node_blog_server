const { exec } = require('../db/mysql');
const xss = require('xss');

const getList = (author, keyword) => {
  let sql = `select * from blogs where 1=1 `;
  if (author) {
    sql += `and author='${author}' `; // 注意这里的空格
  }
  if (keyword) {
    sql += `and title like '%${keyword}%' `; // like '%${keyword}%' 模糊查询
  }
  sql += `order by createtime desc;`; // 按照创建时间降序排列
  return exec(sql);
};

const getDetail = (id) => {
  const sql = `select * from blogs where id='${id}'`;
  return exec(sql).then((rows) => {
    return rows[0];
  });
};

const newBlog = (blogData = {}) => {
  // blogData 是一个博客对象，包含 title content 属性
  const { title, content, author } = blogData;
  const createtime = Date.now();
  const sql = `insert into blogs (title, content, createtime, author) values ('${xss(
    title
  )}', '${xss(content)}', ${createtime}, '${author}');`;

  return exec(sql).then((insertData) => {
    return {
      id: insertData.insertId,
    };
  });
};

const updateBlog = (blogData = {}) => {
  // id 就是要更新博客的 id
  // blogData 是一个博客对象，包含 title content 属性
  const { title, content, id } = blogData;
  const sql = `update blogs set title='${xss(title)}', content='${xss(
    content
  )}' where id=${id}`;
  return exec(sql).then((updateData) => {
    return updateData.affectedRows > 0;
  });
};

const delBlog = (id, author) => {
  // id 就是要删除博客的 id
  const sql = `delete from blogs where id=${id} and author='${author}'`;
  return exec(sql).then((delData) => {
    return delData.affectedRows > 0;
  });
};

module.exports = {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog,
};
