const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'infiniteglow.db'));

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS Products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type VARCHAR(50) NOT NULL,
        nameString VARCHAR(100) NOT NULL UNIQUE,
        name VARCHAR(100) NOT NULL,
        price REAL NOT NULL,
        description TEXT NOT NULL,
        image VARCHAR(255) NOT NULL
    );`);
});

module.exports = db;


