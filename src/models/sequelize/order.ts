import Sequelize from 'sequelize'

import sequelize from '../../utils/sequelize/db'

export default sequelize.define('order', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
    unique: true,
  },
});
