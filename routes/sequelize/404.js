// const path = require('path');

const express = require('express');

// Local
const errorController = require('../../controllers/sequelize/error');

const router = express.Router();

router.get('*', errorController.get404);

module.exports = router;
