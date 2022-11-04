import Sequelize from 'sequelize'

import sequelize from '../../utils/sequelize/db'

export default sequelize.define('orderItem', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
    unique: true,
  },
  quantity: Sequelize.INTEGER,
});
