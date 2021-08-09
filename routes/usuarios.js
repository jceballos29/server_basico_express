const express = require('express');
const Joi = require('joi');

const Routes = express.Router();

const usuarios = [
    {id:1 , name:"Juan Ceballos"},
    {id:2 , name:"Antonio Usuga"},
    {id:3 , name:"Cindy Grajales"},
    {id:4 , name:"Vanesa Herrera"}
]

Routes.get('/', (req, res) => {
    res.send(usuarios);
});

Routes.get('/:id', (req, res) => {
    let usuario = checkUsuario(req.params.id);
    if(!usuario) res.status(404).send('Usuario no encontrado');
    else res.send(usuario);
});

// Routes.post();     //envio de datos // creacion.
Routes.post('/', (req, res) => {
    const {error,value} = validarUsuario(req.body.name);
    if(!error){
        const usuario = {
            id: usuarios.length + 1,
            name: value.name
        };
        usuarios.push(usuario);
        res.send(usuario);
    } else {
        res.status(400).send()
    }
});

// Routes.put();      //actualizacion
Routes.put('/:id', (req, res) => {
    let usuario = checkUsuario(req.params.id);
    if(!usuario) {
        res.status(404).send('Usuario no encontrado');
    }
    else {
        
        const {error,value} = validarUsuario(req.body.name);
        if(!error){
            usuario.name = value.name;
            res.send(usuario);
        } else {
            const mensaje = error.details[0].message;
            res.status(400).send(mensaje)
        }
    }
});
// Routes.delete();   //eliminacion
Routes.delete('/:id', (req, res) =>{
    let usuario = checkUsuario(req.params.id);
    if(!usuario) {
        res.status(404).send('Usuario no encontrado');
    }
    else {
        const index = usuarios.indexOf(usuario);
        usuarios.splice(index, 1);

        res.send(usuario);
    }
});


function checkUsuario(id){
    return usuarios.find(u => u.id === parseInt(id));
}

function validarUsuario(name){
    const schema = Joi.object({
        name: Joi.string()
            .min(3)
            .required()
    });

    return schema.validate({name: name});
}

module.exports = Routes;