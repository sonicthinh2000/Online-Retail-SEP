const Handlebars = require('handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');

let express = require('express');
let app = express();

//Set Public Static Folder
app.use(express.static(__dirname + '/public'));

//Use View Engine
let expressHbs = require('express-handlebars');
let helper = require('./controllers/helper');
let hbs = expressHbs.create({
    extname: 'hbs',
    defaultLayout: 'layout',
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials/',
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    helpers: {
        createStarList: helper.createStarList,
        createStars: helper.createStars
    }
});
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');



app.use('/', require('./routes/indexRouter'));
app.use('/products', require('./routes/productRouter'));


app.get('/sync', (req, res) => {
    let models = require('./models');
    models.sequelize.sync()
        .then(() => {
            res.send('database sync completed!')
        });
});

app.get('/:page', (req, res) => {
    let banners = {
        blog: 'Our Blog',
        cart: 'Shopping Cart',
        category: 'Shop Category',
        checkout: 'Product Checkout',
        confirmation: 'Order Confirmation',
        contact: 'Contact Us',
        login: 'Login / Register',
        register: 'Register',
        singleblog: 'Blog Details',
        products: 'Shop Single',
        trackingorder: 'Order Tracking'
    };
    let page = req.params.page;
    res.render(page, { banner: banners[page] });
});


//Set Server Port & Start Server
app.set('port', process.env.PORT || 5000);
app.listen(app.get('port'), () => {
    console.log(`Server is running at port ${app.get('port')}`);
});