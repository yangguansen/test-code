//  mysql配置
var mysql  = require('mysql');
var pool = mysql.createPool({
    connectionLimit: 100,
    host     : '127.0.0.1',
    user     : 'user',
    password : 'pwd',
    port: '3306',
    database: 'node',
    charset: 'utf8mb4'
});

module.exports = pool;
