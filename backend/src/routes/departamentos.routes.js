import { Router } from 'express';
import { validateResult } from '../middlewares/commonValidators.js';
import * as depController from '../controllers/departamentos.controller.js';
import * as depValidators from '../middlewares/validaciones/departamentos.validation.js';

import { isAuth } from '../middlewares/auth.middleware.js';
import { hasRole } from '../middlewares/role.middleware.js';

const router = Router();

router.get('/', depController.getAll);

router.use(isAuth, hasRole(['administrador']));
router.post('/', depValidators.departamentoValidator, validateResult, depController.create);
router.put('/:id', depValidators.departamentoIdValidator, depValidators.departamentoValidator, validateResult, depController.update);
router.delete('/:id', depValidators.departamentoIdValidator, validateResult, depController.remove);

export default router;
