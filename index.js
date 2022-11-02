const app = require('./utils/app');
const mongoClient = require('./utils/database');

mongoClient(() => {
  const port = process.env.PORT || 3000;

  app.listen(port, () => {
    console.log(`Running on port ${port}`);
  });
});
