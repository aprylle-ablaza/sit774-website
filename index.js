const express = require('express');
const morgan = require('morgan');
const path = require('path');
const db = require('./db');
const { styleText } = require('util');
const app = express();
const port = 3000;

app.use(morgan('common'));
app.use(express.urlencoded({ extended: false }));
app.use('/resources', express.static(path.join(__dirname, 'resources')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', (req, res, next)=>{
    db.all(`SELECT id, type, name, price, description, image FROM Products WHERE id IN (1, 3, 5, 10);`, (err, rows)=>{
        res.render('index', {title : 'Home | Infinite Glow', stylesheet: '/resources/styles/index.css', bestsellers : rows});
    })
})

app.get('/products', (req, res, next)=>{
    const { search } = req.query;
    if (search){
        db.all(`SELECT id, type, name, price, description, image from PRODUCTS WHERE name LIKE '%${search}%'`, (err, rows)=>{
            res.render('products', {title: 'Products | Infinite Glow', stylesheet : '/resources/styles/products.css', products : rows});
        })
    }
    else{
        db.all(`SELECT id, type, name, price, description, image from PRODUCTS`, (err, rows)=>{
            res.render('products', {title: 'Products | Infinite Glow', stylesheet : '/resources/styles/products.css', products : rows});
        })
    }
})

app.get('/products/:id', (req, res, next)=>{
        try{
            const productId = parseInt(req.params.id);
            db.all(`SELECT id, type, name, price, description, image FROM products WHERE id = ${productId};`, (err, rows)=>{
                if(rows.length === 0){
                    return next(new Error('This product does not exist'));
                }
                const product = rows[0];
                const productType = rows[0].type;
                let recommendations = [];
                db.all(`SELECT id, type, name, price, description, image FROM products WHERE type = '${productType}' AND id != ${productId};`, (err, rows)=>{
                    while(recommendations.length < 4){
                        const random = Math.floor(Math.random() * rows.length);
                        if(!recommendations.includes(rows[random]))
                        {
                            recommendations.push(rows[random])
                        }
                      }
                      res.render(`product`, {title: `${rows[0].name} | Infinite Glow`, stylesheet : '/resources/styles/style.css', product : product, recommendations : recommendations});
                })
            })
        }
        catch{
            return next(new Error('Invalid product id'));
        }
})

app.get('/services', (req, res, next)=>{
    res.render(`services`, {title : 'Services | Infinite Glow', stylesheet: '/resources/styles/services.css'});
})

app.get('/about', (req, res, next)=>{
    res.render('about', {title: 'About | Infinite Glow', stylesheet : '/resources/styles/about.css'})
})

app.get('/contact', (req, res, next)=>{
    res.render('contact', {title : 'Contact | Infinite Glow', stylesheet : '/resources/styles/contact.css'});
})
app.use((req, res, next) => {
    const err = new Error('This page does not exist.');
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.render('404', {
        title: '404 - Not Found', 
        stylesheet: '/resources/styles/404.css', 
        message: err.message || 'Internal Server Error'
    });
});
app.listen(port, ()=>{
    console.log(`Web server running at: http://localhost:${port}`);
    console.log(`Type Crtl+C to shut down the web server`);
});