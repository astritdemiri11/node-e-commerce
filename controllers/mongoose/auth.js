const User = require('../../models/mongoose/user');

exports.getLogin = (req, res) => {
  res.render('mongoose/auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: false,
    linkIndex: 6,
  });
};

exports.postLogin = (req, res) => {
  User.findById('63639dd3cfc3714a0ec3b1df')
    .then((user) => {
      req.session.isLoggedIn = true;
      req.session.user = user;
      res.redirect('/');
    })
    .catch(() => {

    });
};
