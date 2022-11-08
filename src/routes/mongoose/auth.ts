import express from 'express';
import { body, check } from 'express-validator';

import * as authController from '../../controllers/mongoose/auth';
import isAuth from '../../middleware/is-auth';
import isNotAuth from '../../middleware/is-not-auth';
import User from '../../models/mongoose/user';

const router = express.Router();

router.get('/login', isNotAuth, authController.getLogin);
router.get('/signup', isNotAuth, authController.getSignup);
router.get('/reset', isNotAuth, authController.getReset);
router.get('/reset/:token', isNotAuth, authController.getNewPassword);

router.post('/login',
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email address.')
      .normalizeEmail(),
    body('password', 'Password has to be valid.')
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim()
  ],
  isNotAuth,
  authController.postLogin);
router.post('/signup',
  [
    check('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .custom((value) => {
        return User.findOne({ email: value }).then(userDoc => {
          if (userDoc) {
            return Promise.reject(
              'E-Mail exists already, please pick a different one.'
            );
          }
        });
      })
      .normalizeEmail(),
    body(
      'password',
      'Please enter a password with only numbers and text and at least 5 characters.'
    )
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
    body('confirmPassword')
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Passwords have to match!');
        }
        return true;
      })
  ],
  isNotAuth,
  authController.postSignup);
router.post('/logout', isAuth, authController.postLogout);
router.post('/reset', isAuth, authController.postReset);
router.post('/new-password', isNotAuth, authController.postNewPassword);

export default router;
