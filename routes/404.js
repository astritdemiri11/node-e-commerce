// Core Libs.
const pathLib = require('path');

// 3rd Party Libs.
const expressLib = require('express');

// Local
const errorController = require('../controllers/error');

const router = expressLib.Router();

router.get('*', errorController.get404);

module.exports = router;