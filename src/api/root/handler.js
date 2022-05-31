import BaseHandler from '../default.js';

export default class RootHandler extends BaseHandler {
  async getHandler(_req, res, _next) {
    return super.render(res, 200, {
      status: 'success',
      message: 'This is the API root'
    });
  }

  notFoundHandler(_req, res, _next) {
    return super.render(res, 404, {
      status: 'error',
      message: 'Not found'
    });
  }
}
