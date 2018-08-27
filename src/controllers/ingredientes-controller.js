'use strict'

const fb = require('../firebase/config');
const database = fb.firebase.database();


exports.get = (req, res, next) => {

    database
        .ref('/ingredientes')
        .once('value')
        .then(function(ingredientes) {
            const ac_ingredientes = [];

            ingredientes.forEach(function(ingrediente){
                if(ingrediente.val().ativo){ ac_ingredientes.push(ingrediente); };
            });
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.status(200).send({ ingredientes: ac_ingredientes });
        });

};

exports.getAll = (req, res, next) => {

    database
        .ref('/ingredientes')
        .once('value')
        .then(function(ingredientes) {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.status(200).send({ ingredientes: ingredientes });
        });

};

exports.getIng = (req, res, next) => {

    const slug = req.params.slug;

    database
        .ref('/ingredientes/' + slug)
        .once('value')
        .then(function(ingrediente) {
            res.status(201).send(ingrediente);
        }).catch(function(){

            let msg = "Houve problemas ao resgatar o item";
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.status(400).send(msg);
            console.log(msg);
        });


};

exports.post = (req, res, next) => {
    
    let ingrediente = req.body.nome;
    let tagslug        = getSlug(req.body.nome);

    database
        .ref('ingredientes/' + tagslug)
        .set({ 
            
            nome: ingrediente,
            slug : tagslug,
            ativo: true
        })
        .then(function(){

            let msg = {
                item: [ 'ingrediente', tagslug ],
                acao : "Criar",
                sucess: true,
                msg: "Ingrediente: " + req.body.nome + " adicionado com sucesso!"
            }
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.status(201).send(msg);
        }).catch(function(){

            let msg = {
                item: [ 'ingrediente', tagslug ],
                acao : "Criar",
                sucess: false,
                msg: "Houve problemas ao adicionar o item"
            }
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.status(400).send(msg);

            console.log(msg.msg);
        });

};


exports.delete = (req, res, next) => {

    const tagslug = req.params.slug;

    var updates = {};
    updates['/ingredientes/' + tagslug + '/'] = null;
    database
        .ref()
        .update(updates)
        .then(function(){

            let msg = {
                item: [ 'ingrediente', tagslug ],
                acao : "Deletar",
                sucess: true,
                msg: "Item removido com sucesso"
            }
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.status(200).send(msg);
        }).catch(function(){

            let msg = {
                item: [ 'ingrediente', tagslug ],
                acao : "Deletar",
                sucess: false,
                msg: "Houve problemas ao deletar item"
            }
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.status(400).send(msg);

            console.log(msg.msg);
        });

    const id = req.params.id;
    
};



/*

exports.put = (req, res, next) => {

    const id = req.params.id;
    res.status(200).send({
        id: id,
        item: req.body
    });
};



*/


function getSlug (str) {
    str = str.replace(/^\s+|\s+$/g, ''); // trim
    str = str.toLowerCase();
  
    // remove accents, swap ñ for n, etc
    var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
    var to   = "aaaaeeeeiiiioooouuuunc------";
    for (var i=0, l=from.length ; i<l ; i++) {
        str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }

    str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
        .replace(/\s+/g, '-') // collapse whitespace and replace by -
        .replace(/-+/g, '-'); // collapse dashes

    return str;
}