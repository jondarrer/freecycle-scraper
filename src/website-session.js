import WebsiteRequest from './website-request';
import CookieHelper from './utils/cookie-helper';
require('./types');

/**
 * 
 */
class WebsiteSession extends WebsiteRequest {
  /**
   * Create a new website session
   * @param {any} params 
   * @param {function(any, any)} cb 
   */
  create(params, cb) {
    this.makeRequest(this.options, params, (err, response, body) => {
      if (err) {
        return cb(err, body);
      }
      let cookies = CookieHelper.getCookies(response);
      cb(
        null,
        cookies.find(cookie => {
          return cookie.name === 'MyFreecycle';
        })
      );
    });
  }
}

export default WebsiteSession;
