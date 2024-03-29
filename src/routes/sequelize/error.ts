// const path from 'path');

import express from 'express'

// Local
import * as errorController from '../../controllers/sequelize/error'

const router = express.Router();

router.get('*', errorController.get404);

export default router;
