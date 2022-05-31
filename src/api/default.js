export default class BaseHandler {
  render(res, statusCode, data) {
    return res.status(statusCode).json(data);
  }
}
