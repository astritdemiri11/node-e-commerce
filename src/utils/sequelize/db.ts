import { Sequelize } from 'sequelize';

export default new Sequelize(
  process.env.SQL_DATABASE || '',
  process.env.SQL_USER || '',
  process.env.SQL_PASSWORD || '',
  {
    dialect: 'mysql',
    host: 'localhost',
  },
);
