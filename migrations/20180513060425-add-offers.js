'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function (db) {
  return db.createTable('offers', {
    id: { type: 'int', primaryKey: true },
    group_id: 'string',
    type: 'string',
    poster: 'string',
    subject: 'string',
    location: 'string',
    description: 'text',
    date: 'datetime',
    has_image: 'boolean',
    inserted_at: 'datetime',
    updated_at: 'datetime',
  });
};

exports.down = function (db) {
  return db.dropTable('offers');
};

exports._meta = {
  version: 1,
};
