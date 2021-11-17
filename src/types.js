/**
 * @typedef {any} Row
 */

/**
 * @typedef {Object} Result
 * @property {Array<Row>} rows
 */

/**
 * @typedef {any} Post
 */

/**
 * @typedef {Object} PreparedStatement
 * @property {string} name
 * @property {string} text
 * @property {Array<any>} values
 */

/**
 * @callback ConnectCallback
 * @returns {Promise<any>}
 */

/**
 * @callback EndCallback
 * @returns {Promise<any>}
 */

/**
 * @typedef {Object} Pool
 * @property {ConnectCallback} connect
 * @property {EndCallback} end
 */

/**
 * @callback PostsCallback
 * @param {any} err
 * @param {Array<Post>} posts
 * @returns {any}
 */

/**
 * @typedef {function(any, PostsCallback, Array<string>): any} CrawlGroupFunction
 */

/**
 * @typedef {function(string, Array<string>, PostsCallback): any} ExtractGroupContentsFunction
 */

/**
 * @typedef Crawler
 * @property {CrawlGroupFunction} crawlGroup
 * @property {ExtractGroupContentsFunction} extractGroupContents
 */

/**
 * @typedef {Object} Response
 * @property {Object<string, string|number>} headers
 */

/**
 * @typedef {Object} Cookie
 */

const __dummyModule = true;

module.exports = __dummyModule;