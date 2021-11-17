import WebsiteRequest from './website-request';
import WebpageScraper from './webpage-scraper';
require('./types');

class WebsiteCrawler extends WebsiteRequest {
  /**
   * 
   * @param {any} params 
   * @param {function(any, Array<string>): any} cb 
   * @param {Array<string>} postIds 
   */
  crawlGroup(
    params,
    cb,
    postIds
  ) {
    const scraper = new WebpageScraper();
    postIds = postIds || [];
    params.pageNo = params.pageNo || 0;
    params.pageNo = params.pageNo === 1 ? 2 : params.pageNo;

    this.getIndexPage(params, (err, response, body) => {
      let finished = false;

      if (err) {
        return cb(err, postIds);
      }
      if (params.pageNo > 4) {
        return cb(null, postIds);
      }
      scraper.scrapeIndex(body).some(postId => {
        if (postId > params.minPostId) {
          postIds.push(postId);
        } else {
          finished = true;
          cb(null, postIds);
        }
        return finished;
      });
      params.pageNo++;
      !finished && this.crawlGroup(params, cb, postIds);
    });
  }

  /**
   * Extracts the groups contents
   * @param {string} groupId 
   * @param {Array<string>} postIds 
   * @param {function(any, Array<any>): any} cb 
   */
  extractGroupContents(
    groupId,
    postIds,
    cb
  ) {
    const scraper = new WebpageScraper();
    let posts = [];
    let failed = false;

    postIds.forEach(postId => {
      this.getDetailPage(
        { groupId: groupId, postId: postId },
        (err, response, body) => {
          if (failed) {
            return null;
          }
          if (err) {
            failed = true;
            return cb(err, posts);
          }
          let post = scraper.scrapePost(body);
          post.groupId = groupId;
          posts.push(post);
          if (posts.length === postIds.length) {
            cb(null, posts);
          }
        }
      );
    });
  }

  /**
   * Gets an index page
   * @param {any} params 
   * @param {function(any, any, string): any} cb 
   * @returns 
   */
  getIndexPage(
    params,
    cb
  ) {
    let options = {};
    Object.assign(options, this.options);
    options.path =
      options.path +
      '/' +
      params.groupId +
      '/posts/offer?page=' +
      params.pageNo;

    return this.makeRequest(options, null, cb);
  }

  /**
   * Gets a detail page
   * @param {any} params 
   * @param {function(any, Array<any>): any} cb 
   * @returns 
   */
  getDetailPage(params, cb) {
    let options = {};
    Object.assign(options, this.options);
    options.path =
      options.path + '/' + params.groupId + '/posts/' + params.postId;

    return this.makeRequest(options, null, cb);
  }
}

export default WebsiteCrawler;
