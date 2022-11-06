import * as mongoose from './connection/mongoose';
import app from './utils/mongoose/app';

mongoose.connect(() => {
  const port = process.env.PORT || 3000;

  app.listen(port, () => {
    console.log(`Running on port ${port}`);
  });
});

// import app from './utils/sequelize/app';
// import sequelizeConnect from './connection/sequelize';

// sequelizeConnect(() => {
//   const port = process.env.PORT || 3000;

//   app.listen(port, () => {
//     console.log(`Running on port ${port}`);
//   });
// });
