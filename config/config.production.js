module.exports = {
  pg: {
    host: process.env.FCAPI_DB_HOST,
    user: process.env.FCAPI_DB_USERNAME,
    password: process.env.FCAPI_DB_PASSWORD,
    database: process.env.FCAPI_DB_NAME,
  },
  request: {
    scheme: 'https',
    hostname: 'freecycle.org',
  },
};
