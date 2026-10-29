const mysql = require('mysql2/promise')
require('dotenv').config()

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'personal_blog',
  waitForConnections: true,
  connectionLimit: 10,
  charset: 'utf8mb4',
  // DATE 以 YYYY-MM-DD 字符串返回，避免经 Date→ISO 时区导致差一天
  dateStrings: true,
})

module.exports = pool
