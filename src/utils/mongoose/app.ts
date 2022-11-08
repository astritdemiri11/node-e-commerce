import flash from 'connect-flash';
import MongoDBStore from 'connect-mongodb-session';
import csrf from 'csurf';
import express, { NextFunction, Response } from 'express';
import session from 'express-session';
import path from 'path';

import * as mongoose from '../../connection/mongoose';
import User from '../../models/mongoose/user';
import notFoundRoute from '../../routes/mongoose/404';
import adminRoutes from '../../routes/mongoose/admin';
import authRoutes from '../../routes/mongoose/auth';
import shopRoutes from '../../routes/mongoose/shop';
import rootDir from '../path';

const app = express();
const store = new (MongoDBStore as any)(session)({
  uri: mongoose.connectionLink,
  collection: 'sessions',
});

const publicDir = path.join(rootDir, 'public');

app.set('view engine', 'ejs');
app.set('views', 'src/views');

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
app.use(csrf());
app.use(flash());

app.use((req: any, _res: Response, next: NextFunction) => {
  if (!req.session.user) {
    return next();
  }

  User.findById(req.session.user._id)
    .then(user => {
      if (!user) {
        return next();
      }

      req.user = user;
      next();
    })
    .catch(error => {
      throw new Error(error)
    });
});

app.use((req: any, res: Response, next: NextFunction) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use('/admin', adminRoutes);
app.use(authRoutes);
app.use(shopRoutes);
app.use(notFoundRoute);

export default app;
