'use strict'

const fb = require('../firebase/config');
const database = fb.firebase.database();


exports.get = (req, res, next) => {

    database
        .ref('/receitas')
        .once('value')
        .then(function(receitas) {

            const ac_receitas = [];
            receitas.forEach(function(receita){

                if(receita.val().ativo){ ac_receitas.push(receita); };
            });
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.status(200).send({ receitas: ac_receitas });
        });

};

exports.getAll = (req, res, next) => {

    database
        .ref('/receitas')
        .once('value')
        .then(function(receitas) {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.status(200).send({ receitas: receitas });
        });

};

exports.getRec = (req, res, next) => {

    const slug = req.params.slug;

    database
        .ref('/receitas/' + slug)
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
    
    let tagslug = getSlug(req.body.nome_receita);
    let getReceita = req.body;

    let receita = {

        ingredientes:  getReceita.ingredientes,
        modo_preparo_receita: getReceita.modo_preparo_receita,
        nome_receita: getReceita.nome_receita,
        rendimento: getReceita.rendimento,
        tempo_receita: getReceita.tempo_receita,
        unidade: getReceita.unidade,
        slug: tagslug,
        ativo: true
    }

    database
        .ref('receitas/' + tagslug)
        .set(receita)
        .then(function(){

            let msg = {
                item: [ 'receita', tagslug ],
                acao : "Criar",
                sucess: true,
                msg: "Receita: " + req.body.nome_receita + " adicionado com sucesso!"
            }
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.status(201).send(msg);


        }).catch(function(){

            let msg = {
                item: [ 'receita', tagslug ],
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
    updates['/receitas/' + tagslug + '/'] = null;
    database
        .ref()
        .update(updates)
        .then(function(){

            let msg = {
                item: [ 'receita', tagslug ],
                acao : "Deletar",
                sucess: true,
                msg: "Item removido com sucesso"
            }
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.status(200).send(msg);
        }).catch(function(){

            let msg = {
                item: [ 'receita', tagslug ],
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