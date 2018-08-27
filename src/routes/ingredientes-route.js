'use strict'

const express  = require('express');
const router = express.Router();

const ingredientesController = require('../controllers/ingredientes-controller'); 

router.get('/', ingredientesController.get);
router.get('/all', ingredientesController.getAll);
router.get('/:slug', ingredientesController.getIng);
router.post('/', ingredientesController.post);
router.delete('/:slug', ingredientesController.delete);

module.exports = router;