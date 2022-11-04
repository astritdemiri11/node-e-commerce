import express from 'express';

import * as authController from '../../controllers/mongoose/auth';

const router = express.Router();

router.get('/login', authController.getLogin);

router.post('/login', authController.postLogin);

export default router;