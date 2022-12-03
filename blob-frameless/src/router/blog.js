const {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog,
} = require('../controller/blog');

const { SuccessModel, ErrorModel } = require('../model/resModel');

// 统一的登录验证函数
const loginCheck = (req) => {
  if (!req?.session?.username) {
    return Promise.resolve(new ErrorModel('Not logged in'));
  }
};

const handleBologRouter = (req, res) => {
  const method = req.method; // GET POST
  const path = req.path;
  const id = req.query.id;

  // Get blog list
  if (method === 'GET' && path === '/api/blog/list') {
    const author = req.query.author || '';
    const keyword = req.query.keyword || '';
    const result = getList(author, keyword);
    return result.then((listData) => {
      return new SuccessModel(listData);
    });
  }

  // Get blog detail
  if (method === 'GET' && path === '/api/blog/detail') {
    const result = getDetail(id);
    return result.then((data) => {
      return new SuccessModel(data);
    });
  }

  // New blog
  if (method === 'POST' && path === '/api/blog/new') {
    const loginCheckResult = loginCheck(req);
    if (loginCheckResult) {
      // Not logged in
      return loginCheckResult;
    }

    req.body.author = req.session.username;
    const result = newBlog(req.body);
    return result.then((data) => {
      return new SuccessModel(data);
    });
  }

  // Update blog
  if (method === 'POST' && path === '/api/blog/update') {
    const loginCheckResult = loginCheck(req);
    if (loginCheckResult) {
      // Not logged in
      return loginCheckResult;
    }

    const result = updateBlog(req.body);
    return result.then((val) => {
      if (val) {
        return new SuccessModel();
      } else {
        return new ErrorModel('Update blog failed');
      }
    });
  }

  // Delete blog
  if (method === 'POST' && path === '/api/blog/del') {
    const loginCheckResult = loginCheck(req);
    if (loginCheckResult) {
      // Not logged in
      return loginCheckResult;
    }

    const author = req.session.username;
    const result = delBlog(req.body.id, author);
    return result.then((val) => {
      if (val) {
        return new SuccessModel();
      } else {
        return new ErrorModel('Delete blog failed');
      }
    });
  }
};

module.exports = handleBologRouter;
