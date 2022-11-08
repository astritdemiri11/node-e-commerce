import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { Request, Response } from 'express';
import * as nodemailer from 'nodemailer';
import { validationResult } from 'express-validator';
import User from '../../models/mongoose/user';

const sendgridTransport = require('nodemailer-sendgrid-transport');

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: process.env.SENDGRID_KEY
    }
  })
);
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
    values: {
      email: '',
      password: '',
    },
    validationErrors: [],
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
    values: {
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationErrors: [],
    linkIndex: 7,
  });
};

export const postLogin = (req: any, res: Response) => {
  const { email, password } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('mongoose/auth/login', {
      path: '/login',
      pageTitle: 'Login',
      values: {
        email: email,
        password: password
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
      linkIndex: 6,
    });
  }

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
  const errors = validationResult(req);


  if (!errors.isEmpty()) {
    return res.status(422).render('mongoose/auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      errorMessage: errors.array()[0].msg,
      values: {
        email,
        password,
        confirmPassword: req.body.confirmPassword
      },
      validationErrors: errors.array(),
      linkIndex: 7,
    });;
  }

  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      const user = new User({
        email,
        password: hashedPassword,
        cart: { items: [] },
      });
      return user.save();
    })
    .then(() => {
      res.redirect('/login');
      transporter.sendMail({
        to: email,
        from: 'astritdemiri06@gmail.com',
        subject: 'Signup succeeded!',
        html: '<h1>You successfully signed up!</h1>'
      });
    })
    .catch(() => {
    });
};

export const postLogout = (req: Request, res: Response) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
};

export const getReset = (req: Request, res: Response) => {
  const error = req.flash('error');
  let message;

  if (error.length > 0) {
    [message] = error;
  } else {
    message = null;
  }

  res.render('mongoose/auth/reset', {
    path: '/reset',
    pageTitle: 'Reset Password',
    errorMessage: message,
    linkIndex: -1,
  });
};

export const postReset = (req: Request, res: Response) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      return res.redirect('/reset');
    }

    const token = buffer.toString('hex');

    User.findOne({ email: req.body.email })
      .then((user: any) => {
        if (!user) {
          req.flash('error', 'No account with that email found.');
          return res.redirect('/reset');
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then(() => {
        res.redirect('/');
        transporter.sendMail({
          to: req.body.email,
          from: 'astritdemiri06@gmail.com',
          subject: 'Password reset',
          html: `
            <p>You requested a password reset</p>
            <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password.</p>
          `
        });
      })
      .catch(error => {
        throw new Error(error);
      });
  });
};

export const getNewPassword = (req: Request, res: Response) => {
  const token = req.params.token;
  User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    .then((user: any) => {
      const error = req.flash('error');
      let message;

      if (error.length > 0) {
        [message] = error;
      } else {
        message = null;
      }

      res.render('mongoose/auth/new-password', {
        path: '/new-password',
        pageTitle: 'New Password',
        errorMessage: message,
        userId: user._id.toString(),
        passwordToken: token,
        linkIndex: -1,
      });
    })
    .catch(error => {
      throw new Error(error);
    });
};

export const postNewPassword = (req: Request, res: Response) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  let resetUser: any;

  User.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId
  })
    .then(user => {
      resetUser = user;
      return bcrypt.hash(newPassword, 12);
    })
    .then(hashedPassword => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then(() => {
      res.redirect('/login');
    })
    .catch(error => {
      throw new Error(error);
    });
};
