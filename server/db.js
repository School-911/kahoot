// server/db.js
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // nhập mật khẩu nếu có
  database: 'kahoot_db'
});

connection.connect((err) => {
  if (err) throw err;
  console.log('✅ Kết nối MySQL thành công!');
});

module.exports = connection;
