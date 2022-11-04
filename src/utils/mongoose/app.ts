import MongoDBStore from 'connect-mongodb-session';
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

app.use((req: any, res: Response, next: NextFunction) => {
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

export default app;
