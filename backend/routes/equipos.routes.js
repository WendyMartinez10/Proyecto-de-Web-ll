import { Router } from 'express';
import { validateResult } from '../middlewares/commonValidators.js';
import * as eqController from '../controllers/equipos.controller.js';
import * as eqValidators from '../middlewares/equipos.validation.js';
import { isAuth } from '../middleware/auth.middleware.js';
import { hasRole } from '../middleware/role.middleware.js';
import { upload } from '../middleware/upload.middleware.js';

const router = Router();

router.use(isAuth);
router.get('/', eqController.getAll);

router.use(hasRole(['administrador']));

router.post('/', (req, res, next) => {
    upload.single('imagen')(req, res, (err) => {
        if (err) return res.status(400).json({ success: false, error: err.message });
        next();
    });
}, eqValidators.equipoValidator, validateResult, eqController.create);

router.put('/:id', (req, res, next) => {
    upload.single('imagen')(req, res, (err) => {
        if (err) return res.status(400).json({ success: false, error: err.message });
        next();
    });
}, eqValidators.updateEquipoValidator, validateResult, eqController.update);

router.delete('/:id', eqValidators.removeEquipoValidator, validateResult, eqController.remove);

export default router;
