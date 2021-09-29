// Core Libs.
const pathLib = require('path');

// 3rd Party Libs.
const expressLib = require('express');

// Local
const rootDir = require('./path');

const adminRoutes = require('../routes/admin');
const shopRoutes = require('../routes/shop');
const notFoundRoute = require('../routes/404');

const app = expressLib();

const publicDir = pathLib.join(rootDir, './public');

app.use(expressLib.static(publicDir));

app.use(expressLib.urlencoded({ extended: true }));

app.use((req, _res, next) => {
    // User.findByPk(1).then(user => {
    //     req.user = user;
    //     next();
    // });
});

app.set('view engine', 'ejs');


// Routes
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(notFoundRoute);

module.exports = app;