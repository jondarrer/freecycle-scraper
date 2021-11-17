import pg from 'pg';

class DatabaseConnection {
  constructor(options) {
    this.options = options;
  }
  async create() {
    let connection = new pg.Client(this.options);
    await connection.connect();

    return connection;
  }
}

export default DatabaseConnection;
