const bcrypt = require('bcryptjs');
const User = require('../../models/mongoose/user');

exports.getLogin = (req, res) => {
  const error = req.flash('error');
  let message;

  if (error.length > 0) {
    [message] = error;
  } else {
    message = null;
  }

  res.render('mongoose/auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: message,
    linkIndex: 6,
  });
};

exports.getSignup = (req, res) => {
  const error = req.flash('error');
  let message;

  if (error.length > 0) {
    [message] = error;
  } else {
    message = null;
  }

  res.render('mongoose/auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: message,
  });
};

exports.postLogin = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        req.flash('error', 'Invalid email or password.');
        return res.redirect('/login');
      }

      return bcrypt.compare(password, user.password)
        .then((doMatch) => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;

            return req.session.save(() => res.redirect('/'));
          }

          req.flash('error', 'Invalid email or password.');
          return res.redirect('/login');
        })
        .catch(() => {
          res.redirect('/login');
        });
    })
    .catch(() => {

    });
};

exports.postSignup = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .then((userDoc) => {
      if (userDoc) {
        req.flash('error', 'E-Mail exists already, please pick a different one.');
        return res.redirect('/signup');
      }

      return bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
          const user = new User({
            email,
            password: hashedPassword,
            cart: { items: [] },
          });
          return user.save();
        })
        .then(() => res.redirect('/login'));
    })
    .catch(() => {
    });
};

exports.postLogout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
};
