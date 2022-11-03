// const path = require('path');

const express = require('express');

// Local
const errorController = require('../../controllers/mongoose/error');

const router = express.Router();

router.get('*', errorController.get404);

module.exports = router;
