import http from 'http';
import https from 'https';
require('./types');

class WebsiteRequest {
  /**
   * @param {any} options 
   */
  constructor(options) {
    this.options = {
      headers: {
        Connection: 'keep-alive',
        'Cache-Control': 'max-age=0',
        'Accept-Language': 'en-US;en;q=0.5',
        'Accept-Encoding': 'deflate,br',
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:71.0) Gecko/20100101 Firefox/71.0',
        Origin: options.scheme + '://' + options.hostname,
        Host: options.hostname,
      },
      scheme: options.scheme,
      hostname: options.hostname,
      path: options.path,
      method: options.method,
    };

    if (options.method === 'POST') {
      this.options.headers['Content-Type'] =
        'application/x-www-form-urlencoded';
    }

    if (options.cookie) {
      this.options.headers['Cookie'] = options.cookie;
    }
  }

  /**
   * Request a webpage
   * @param {any} options 
   * @param {any} params 
   * @param {function(any, http.IncomingMessage, string)} cb 
   */
  makeRequest(options, params, cb) {
    let responseText = '';
    const scheme = options.scheme === 'https' ? https : http;

    let req = scheme.request(options, res => {
      res.setEncoding('utf8');

      res.on('data', chunk => {
        responseText += chunk;
      });

      res.on('end', () => {
        if (res.statusCode < 400) {
          cb(null, res, responseText);
        } else {
          cb(new Error(res.statusCode), res, responseText);
        }
      });
    });

    req.on('error', e => {
      console.log(
        `WebsiteRequest#makeRequest Error calling ${options.scheme}://${options.hostname}/${options.path}`
      );
      cb(e);
    });

    if (params != null) {
      let content = Object.keys(params)
        .map(key => {
          return `${key}=${params[key]}`;
        })
        .join('&');
      req.write(content);
    }

    req.end();
  }
}

export default WebsiteRequest;
