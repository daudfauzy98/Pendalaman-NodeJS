import sqlite from 'sqlite3'

export function iniDatabase() {
    return new sqlite.Database('data', (err) => {
        if (err) {
            throw err
        }
        console.log('Init DB success!')
    })
}


/**
 * 
 * @param {sqlite.Database} db 
 */
export function iniTable(db) {
    db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS product  (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          photo TEXT NOT NULL,
          name VARCHAR(56) NOT NULL,
          price INTEGER NOT NULL
        );`)
    })
}