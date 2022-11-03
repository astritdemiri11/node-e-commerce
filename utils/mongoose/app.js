const path = require('path');

const express = require('express');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const rootDir = require('../path');

const mongoose = require('../../connection/mongoose');

const notFoundRoute = require('../../routes/mongoose/404');
const adminRoutes = require('../../routes/mongoose/admin');
const authRoutes = require('../../routes/mongoose/auth');
const shopRoutes = require('../../routes/mongoose/shop');

const User = require('../../models/mongoose/user');

const app = express();
const store = new MongoDBStore({
  uri: mongoose.connectionLink,
  collection: 'sessions',
});

const publicDir = path.join(rootDir, 'public');

app.set('view engine', 'ejs');

app.use(express.static(publicDir));
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store,
  }),
);

app.use((req, res, next) => {
  // eslint-disable-next-line no-underscore-dangle
  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    });
});

app.use('/admin', adminRoutes);
app.use(authRoutes);
app.use(shopRoutes);
app.use(notFoundRoute);

module.exports = app;
