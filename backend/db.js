const mysql = require("mysql2");
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "fee_system"
});
db.connect((err) => {
    if (err) {
        console.log("Database error:", err);
    } else {
        console.log("MySQL Connected");
    }
});
module.exports = db;