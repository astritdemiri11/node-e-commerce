const server = require('./server/create');

const port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log(`Running on port ${port}`);
});