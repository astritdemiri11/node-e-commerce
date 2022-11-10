import path from 'path'

import express, { NextFunction, Response } from 'express'

import rootDir from '../path'

import notFoundRoute from '../../routes/sequelize/error'
import adminRoutes from '../../routes/sequelize/admin'
import shopRoutes from '../../routes/sequelize/shop'

import User from '../../models/sequelize/user'

const app = express();
const publicDir = path.join(rootDir, 'public');

app.set('view engine', 'ejs');
app.set('views', 'src/views')

app.use(express.static(publicDir));
app.use(express.urlencoded({ extended: true }));

app.use((req: any, _res: Response, next: NextFunction) => {
  User.findByPk(1).then((user) => {
    req.user = user;
    next();
  });
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(notFoundRoute);

export default app;
