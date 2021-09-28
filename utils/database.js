const Sequelize = require('sequelize').Sequelize;

const sequelize = new Sequelize('e-commerce', 'root', '112123321', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = sequelize;