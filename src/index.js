import FreecycleScraper from './freecycle-scraper';
import WebsiteCrawler from './website-crawler';
import WebsiteSession from './website-session';
import fs from 'fs';
import path from 'path';
import { Pool } from 'pg';

class Worker {
  start() {
    let config = require('../config');
    let session = require('../session.json');
    config.request.sessionId = session && session.value;
    const startTime = new Date();

    console.log(
      `${startTime.toISOString()} Scraping ${config.request.scheme}://${
      config.request.hostname
      }`
    );

    let reqOptions = {};
    Object.assign(reqOptions, config.request, {
      hostname: `groups.${config.request.hostname}`,
      path: '/group',
      method: 'GET',
      cookie: `MyFreecycle=${config.request.sessionId}`,
    });
    const pool = new Pool(config.pg);
    const crawler = new WebsiteCrawler(reqOptions);
    const scraper = new FreecycleScraper();
    scraper
      .start(pool, crawler)
      .then(posts => {
        const endTime = new Date();
        const duration = Math.round(
          (endTime.getTime() - startTime.getTime()) / 1000
        );

        console.log(
          `Found ${posts.length} new offer${
          posts.length === 1 ? '' : 's'
          } (in ${duration}s)`
        );
        scraper.end(pool);
      })
      .catch(err => {
        console.error(err);
        scraper.end(pool);
      });
  }
}

class Session {
  refresh() {
    let config = require('../config');
    let credentials = require('../config/credentials.json');
    let reqOptions = {};
    Object.assign(reqOptions, config.request, {
      hostname: `my.${config.request.hostname}`,
      path: '/login',
      method: 'POST',
    });
    const startTime = new Date();

    console.log(
      `${startTime.toISOString()} Refreshing session cookie for ${
      credentials.username
      }`
    );
    const session = new WebsiteSession(reqOptions);
    session.create(credentials, (err, cookie) => {
      if (err || cookie == null) {
        return console.error('Unable to get cookie', err);
      }
      const sessionPath = path.resolve('session.json');
      console.log(`Retrieved cookie (expires ${cookie.expires}) for ${sessionPath}`);
      fs.writeFileSync(
        sessionPath,
        JSON.stringify(cookie)
      );
    });
  }
}

export { Worker, Session };
