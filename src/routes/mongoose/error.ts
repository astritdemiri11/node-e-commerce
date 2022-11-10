// const path from 'path');

import express from 'express'

// Local
import * as errorController from '../../controllers/mongoose/error'

const router = express.Router();

router.get('/500', errorController.get500);
router.get('*', errorController.get404);

export default router;
