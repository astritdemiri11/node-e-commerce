const path = require('path');

const express = require('express');

const rootDir = require('./path');

const adminRoutes = require('../routes/admin');
const shopRoutes = require('../routes/shop');
const notFoundRoute = require('../routes/404');

const app = express();

const publicDir = path.join(rootDir, 'public');

app.use(express.static(publicDir));

app.use(express.urlencoded({ extended: true }));

// app.use((req, _res, next) => {
// User.findByPk(1).then(user => {
//     req.user = user;
//     next();
// });
// });

app.set('view engine', 'ejs');

// Routes
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(notFoundRoute);

module.exports = app;
