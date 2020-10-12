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


/**
 * 
 * @param {sqlite.Database} db 
 * @param {string} name 
 * @param {number} price 
 * @param {string} photo 
 */
export function insertProduct(db, name, price, photo) {
    db.run('INSERT INTO product (photo,name,price) VALUES ($photo,$name,$price)', { $photo: photo, $name: name, $price: price }, (err) => {
        if (err) {
            throw err
        }

        console.log('product saved')
    })
}

/**
 * 
 * @param {sqlite.Database} db 
 */
export function getProduct(db) {
    db.get('SELECT * FROM product', (err, result) => {
        if(err) {
        console.log(err)
        throw err
        }
        console.log(result)
        return result
    })
}