import flash from 'connect-flash';
import MongoDBStore from 'connect-mongodb-session';
import csrf from 'csurf';
import express, { NextFunction, Request, Response } from 'express';
import session from 'express-session';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';

import * as mongoose from '../../connection/mongoose';
import User from '../../models/mongoose/user';
import adminRoutes from '../../routes/mongoose/admin';
import authRoutes from '../../routes/mongoose/auth';
import notFoundRoute from '../../routes/mongoose/error';
import shopRoutes from '../../routes/mongoose/shop';
import rootDir from '../path';

const app = express();

const store = new (MongoDBStore as any)(session)({
  uri: mongoose.connectionLink,
  collection: 'sessions',
});

const storage = multer.diskStorage({
  destination: (_req: Request, _file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    cb(null, 'images');
  },
  filename: (_req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    cb(null, `${new Date().toISOString().replace(/:/g, '--').replace(/\./g, '_')} ${file.originalname}`);
  }
});

const fileFilter = (_req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const publicDir = path.join(rootDir, 'public');
const imagesDir = path.join(rootDir, 'images');

app.set('view engine', 'ejs');
app.set('views', 'src/views');

app.use(express.static(publicDir));
app.use('/images', express.static(imagesDir));
app.use(express.urlencoded({ extended: true }));
app.use(multer({ storage, fileFilter }).single('image'))

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


app.use((req: any, res: Response, next: NextFunction) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

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
    .catch((error) => {
      throw new Error(error);
    });
});

app.use('/admin', adminRoutes);
app.use(authRoutes);
app.use(shopRoutes);
app.use(notFoundRoute);

app.use((_error: Error, req: any, res: Response, _next: NextFunction) => {
  res.status(500).render('500', {
    pageTitle: 'Page Not Found',
    path: '/500',
    isAuthenticated: req.session.isLoggedIn,
    linkIndex: -1,
  });
});

export default app;
