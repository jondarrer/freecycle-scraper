import queryDb from './query-db';
require('./types');

/**
 * @class Scrapes the Freecycle site
 */
class FreecycleScraper {
  /**
   * @type {import('./types').Crawler}
   */
  crawler;

  /**
   * 
   * @param {import('./types').Pool} pool 
   * @param {import('./types').Crawler} crawler 
   * @returns {Promise<import('./types').Result>}
   */
  async start(pool, crawler) {
    this.crawler = crawler;

    return this.getMaxOfferIds(pool).then(result => {
      return this.scrapeGroups(result).then(posts =>
        this.storeOffers(pool, posts).then(() => posts)
      );
    });
  }

  /**
   * 
   * @param {import('./types').Result} param0 
   * @returns {Promise<Array<import('./types').Post>>}
   */
  scrapeGroups({ rows }) {
    let allPosts = [];
    let counters = {
      noStarted: 0,
      noCompleted: 0,
    };
    let result = new Promise((resolve, reject) => {
      if (rows.length === 0) {
        resolve([]);
      }
      rows.map(row => {
        this.crawler.crawlGroup(
          {
            groupId: row.group_id,
            minPostId: row.id,
          },
          (err, postIds) => {
            if (
              counters.noStarted === rows.length &&
              counters.noCompleted === rows.length
            ) {
              return false;
            }

            counters.noStarted++;
            if (postIds.length > 0) {
              console.log(
                `${postIds.length} for ${row.group_id}:`,
                postIds.join(', ')
              );
            }
            if (err) {
              counters.noStarted = counters.noCompleted = rows.length;
              return reject(err);
            } else if (postIds.length === 0) {
              counters.noCompleted++;
              if (
                counters.noStarted === rows.length &&
                counters.noCompleted === rows.length
              ) {
                return resolve(allPosts);
              } else {
                return null;
              }
            }

            this.crawler.extractGroupContents(
              row.group_id,
              postIds,
              (err, posts) => {
                counters.noCompleted++;
                if (err) {
                  counters.noStarted = counters.noCompleted = rows.length;
                  return console.error(err);
                }

                allPosts = allPosts.concat(posts);

                if (
                  counters.noStarted === rows.length &&
                  counters.noCompleted === rows.length
                ) {
                  return resolve(allPosts);
                }
              }
            );
          }
        );
      });
    });

    return result;
  }

  /**
   * 
   * @param {import('./types').Pool} pool 
   * @returns {Promise<import('./types').Result>}
   */
  async getMaxOfferIds(pool) {
    const statement =
      'SELECT g.id AS group_id, COALESCE(o.id, 0) AS id FROM groups AS g LEFT OUTER JOIN (SELECT MAX(id) as id, group_id FROM offers GROUP BY group_id ORDER BY group_id ASC) AS o ON g.id = o.group_id;';

    return queryDb(pool, statement);
  }

  /**
   * 
   * @param {import('./types').Pool} pool 
   * @param {Array<import('./types').Post>} posts 
   * @returns {Promise<import('./types').Result>}
   */
  async storeOffers(pool, posts) {
    const props = {
      id: 'id',
      groupId: 'group_id',
      type: 'type',
      poster: 'poster',
      subject: 'subject',
      location: 'location',
      description: 'description',
      date: 'date',
      hasImage: 'has_image',
      insertedAt: 'inserted_at',
      updatedAt: 'updated_at',
    };
    const preparedStatement = FreecycleScraper.prepareInsertStatement(
      'offers',
      props,
      posts
    );

    if (preparedStatement.values.length === 0) {
      return Promise.resolve({ rows: [] });
    }

    return queryDb(pool, preparedStatement);
  }

  /**
   * 
   * @param {import('./types').Pool} pool 
   * @returns {Promise<void>}
   */
  async end(pool) {
    try {
      return pool.end();
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * 
   * @param {string} tableName 
   * @param {any} fields 
   * @param {Array<import('./types').Post>} rows 
   * @returns {import('./types').PreparedStatement}
   */
  static prepareInsertStatement(
    tableName,
    fields,
    rows
  ) {
    const params = [];
    const chunks = [];
    rows.forEach(row => {
      const valueClause = [];
      Object.keys(fields).forEach(p => {
        let value;
        switch (p) {
          case 'insertedAt':
            value = new Date();
            break;
          case 'updatedAt':
            value = new Date();
            break;
          default:
            value = row[p];
        }
        params.push(value);
        valueClause.push('$' + params.length);
      });
      chunks.push('(' + valueClause.join(', ') + ')');
    });

    return {
      name: `prep-ins-${tableName}`,
      text: `INSERT INTO ${tableName}(${Object.values(fields).join(
        ', '
      )}) VALUES ${chunks.join(', ')}`,
      values: params,
    };
  }
}

export default FreecycleScraper;
