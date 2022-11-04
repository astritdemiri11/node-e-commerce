import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';

import User from '../../models/mongoose/user';

export const getLogin = (req: any, res: Response) => {
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

export const getSignup = (req: any, res: Response) => {
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

export const postLogin = (req: any, res: Response) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .then((user: any) => {
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

export const postSignup = (req: any, res: Response) => {
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

export const postLogout = (req: Request, res: Response) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
};
