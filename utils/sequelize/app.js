const path = require('path');

const express = require('express');

const rootDir = require('../path');

const notFoundRoute = require('../../routes/sequelize/404');
const adminRoutes = require('../../routes/sequelize/admin');
const shopRoutes = require('../../routes/sequelize/shop');

const User = require('../../models/sequelize/user');

const app = express();
const publicDir = path.join(rootDir, 'public');

app.set('view engine', 'ejs');

app.use(express.static(publicDir));
app.use(express.urlencoded({ extended: true }));

app.use((req, _res, next) => {
  User.findByPk(1).then((user) => {
    req.user = user;
    next();
  });
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(notFoundRoute);

module.exports = app;
