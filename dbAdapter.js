const mysql = require('mysql');
const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'ayasweet',
    database : 'login_schema'
});


connection.connect();

connection.on('error', (err) => {
    console.log(err);
});

function terminateConnection() {
    connection.end();
}

module.exports = {connection, terminateConnection};