'use strict'

const express  = require('express');
const router = express.Router();

const receitasController = require('../controllers/receitas-controller'); 

router.get('/', receitasController.get);
router.get('/all', receitasController.getAll);
router.get('/:slug', receitasController.getRec);
router.post('/', receitasController.post);
router.delete('/:slug', receitasController.delete);

module.exports = router;