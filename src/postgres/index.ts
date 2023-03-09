import pg from 'pg';

const pool = new pg.Pool({
  user: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  port: +process.env.POSTGRES_PORT || 5432,
});

export default pool;
