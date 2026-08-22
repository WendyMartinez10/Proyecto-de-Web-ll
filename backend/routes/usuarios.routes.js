import { Router } from 'express';
import { validateResult } from '../middlewares/commonValidators.js';
import * as authController from '../controllers/usuarios.controller.js';
import * as authValidators from '../middlewares/usuarios.validation.js';

import { isAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/registro', authValidators.registerValidator, validateResult, authController.register);
router.post('/login', authValidators.loginValidator, validateResult, authController.login);
router.post('/logout', isAuth, authController.logout);

router.get('/perfil', isAuth, authController.getProfile);
router.put('/perfil', isAuth, authValidators.profileValidator, validateResult, authController.updateProfile);
router.put('/password', isAuth, authValidators.passwordValidator, validateResult, authController.changePassword);

router.post('/recuperar', authValidators.recoverValidator, validateResult, authController.recoverPassword);
router.post('/restablecer', authValidators.resetValidator, validateResult, authController.resetPassword);

export default router;
