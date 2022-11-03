const app = require('./utils/mongoose/app');
const mongoose = require('./connection/mongoose');

mongoose.connect(() => {
  const port = process.env.PORT || 3000;

  app.listen(port, () => {
    console.log(`Running on port ${port}`);
  });
});

// const app = require('./utils/sequelize/app');
// const sequelizeConnect = require('./connection/sequelize');

// sequelizeConnect(() => {
//   const port = process.env.PORT || 3000;

//   app.listen(port, () => {
//     console.log(`Running on port ${port}`);
//   });
// });
