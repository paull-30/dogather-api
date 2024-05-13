import mysql from 'mysql2';

const pool = mysql
  .createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  })
  .promise();

export async function checkUsername(username) {
  const [rows] = await pool.query('SELECT * FROM user WHERE username = ?', [
    username,
  ]);
  return rows[0];
}

export async function createUser(username, email, hPassword, role) {
  await pool.query(
    'INSERT INTO user (username, email, password, role) VALUES (?,?,?,?)',
    [username, email, hPassword, role]
  );
}

export async function getUser(id) {
  const [user] = await pool.query('SELECT * FROM user WHERE id = ?', [id]);
  return user[0];
}

export async function getUsers() {
  const [users] = await pool.query('SELECT username, email, role FROM user');
  return users;
}
