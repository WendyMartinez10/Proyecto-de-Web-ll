import { Router } from 'express';
import { validateResult } from '../middlewares/commonValidators.js';
import * as confController from '../controllers/configuracion.controller.js';
import * as confValidators from '../middlewares/validaciones/configuracion.validation.js';
import { isAuth } from '../middlewares/auth.middleware.js';
import { hasRole } from '../middlewares/role.middleware.js';

const router = Router();

router.use(isAuth);
router.use(hasRole(['administrador']));

router.get('/', confController.getConfig);
router.put('/', confValidators.updateConfigValidator, validateResult, confController.updateConfig);

export default router;

