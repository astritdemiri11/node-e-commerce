import path from 'path'

const main = require.main;

export default path.dirname(main ? main.filename : 'index.js');
