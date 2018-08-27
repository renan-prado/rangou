'use strict'

const express  = require('express');
const bodyParser = require('body-parser');

const app = express();
const router = express.Router();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// Carregar Rotas
const indexRoute = require('./routes/index-route');
const ingredientesRoute = require('./routes/ingredientes-route');
const receitasRoute = require('./routes/receitas-route');


// Rodar Rota
app.use('/', indexRoute);
app.use('/ingredientes', ingredientesRoute);
app.use('/receitas', receitasRoute);

module.exports = app;