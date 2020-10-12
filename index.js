import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import hbs from 'hbs'
import path from 'path'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import fileUpload from 'express-fileupload'
import fs from 'fs'

import { getProduct, iniDatabase, iniTable, insertProduct } from './database.js'
import { fstat } from 'fs'
//import { get } from 'http'

const __dirname = path.resolve()
const app = express()
const db = iniDatabase()
iniTable(db)

app.set('views', __dirname + '/layouts')
app.set('view engine', 'html')
app.engine('html', hbs.__express)

// Using file upload
app.use(fileUpload())

// Log incoming request
app.use(morgan('combined'))

// Parse request body
app.use(bodyParser.urlencoded({ extended: false}))

// Serve static filess
app.use('/assets', express.static(__dirname + '/assets'))
app.use('/files', express.static(__dirname + '/files'))

app.get('/', (req, res, next) => {
    res.send({ success: true })
})

//Get product list
app.get('/product', async (req, res, nexxt) => {
    //const product = getProduct(db)
    
    /*getProduct(db).then(product => {
        console.log('Product Result', product)
        res.render('product')
    }).catch(error => {
        console.error(error)
    })*/

    /*const product = await getProduct(db)
    console.log('Product Result', product)
    res.render('product')*/

    let products
    try {
        products = await getProduct(db)
    } catch (error) {
        return next(error)
    }

    res.render('product', { products })
})

// Handle from GET method
app.get('/add-product', (req, res, next) => {
    res.send(req.query)
})

// Handle from POST method
app.post('/add-product', (req, res, next) => {
    console.log('Request', req.body)
    console.log('File', req.files)
    // Get file name
    const fileName = Date.now() + req.files.photo.name
    // Write (simpan) file
    fs.writeFile(path.join(__dirname, '/files/', fileName), req.files.photo.data, (err) => {
        if (err) {
            console.error(err)
            return
        }
    })

    // Insert product
    insertProduct(db, req.body.name, parseInt(req.body.price), `/files/${fileName}`)
    // Redirect
    res.redirect('/product')
})

app.use((err, req, res, next) => {
    res.send(err.message)
})

// Use port environment variable
app.listen(process.env.PORT, () => {
    console.log(`App listen on port ${process.env.PORT}`)
})