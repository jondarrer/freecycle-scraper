import cheerio from 'cheerio';
require('./types');

/**
 * @class Scrapes a single webpage
 */
class WebpageScraper {
  /**
   * Scrapes an index page
   * @param {string} html 
   * @returns {Array<string>}
   */
  scrapeIndex(html) {
    let postIds = [];
    let $ = cheerio.load(html);

    $('#group_posts_table tr td:first-child > a').each((i, el) => {
      let href = $(el).attr('href');
      let id = href.split('/').reverse()[1];
      postIds.push(id);
    });

    return postIds;
  }
  /**
   * Scrapes a post page
   * @param {string} html 
   * @returns {import('./types').Post}
   */
  scrapePost(html) {
    let post = {
      hasImage: false,
    };
    let $ = cheerio.load(html);

    let postDiv = $('#group_post');
    $('header h2', postDiv).each((i, el) => {
      let title = $(el).text();
      let indexOfColon = title.indexOf(':');
      let data;

      switch (title.substr(0, indexOfColon)) {
        case 'Post ID':
          data = title.substr(indexOfColon + 2);
          post.id = data;
          break;
        case 'OFFER':
          data = title.substr(indexOfColon + 2);
          post.subject = data;
          post.type = 'OFFER';
          break;
      }
    });
    $('#post_details div', postDiv).each((i, el) => {
      let title = $(el).text();
      let indexOfColon = title.indexOf(':');
      let data;

      switch (title.substr(0, indexOfColon - 1)) {
        case 'Location':
          data = title.substr(indexOfColon + 1);
          post.location = data;
          break;
        case 'Date':
          data = title.substr(indexOfColon + 1);
          post.date = new Date(data);
          break;
        case 'Posted by':
          data = title.substr(indexOfColon + 1);
          post.poster = data;
          break;
      }
    });
    $('div h2', postDiv).each((i, el) => {
      post.description = $('p', $(el).parent())
        .text()
        .replace(/^\s+/, '');
    });
    post.hasImage = $('#post_thumbnail', postDiv).get().length === 1;

    return post;
  }
}

export default WebpageScraper;
