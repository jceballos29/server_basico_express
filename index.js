const debug = require('debug')('app');
//const dbDebug = require('debug')('app:db');
const express = require('express');
require('dotenv').config();
const Joi = require('joi');
const morgan = require('morgan');
const config = require('config');

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));

const port = config.get('port') || 3000;

console.log('Application: ' + config.get('name'));
console.log('BD server: ' + config.get('configDB.host'));


if(app.get('env') == 'development'){
    app.use(morgan('tiny'));
    //console.log('Morgan: enabled');
    debug('Morgan: enabled')
}   

debug('DB is connected.')


const usuarios = [
    {id:1 , name:"Juan Ceballos"},
    {id:2 , name:"Antonio Usuga"},
    {id:3 , name:"Cindy Grajales"},
    {id:4 , name:"Vanesa Herrera"}
]

//app.get(); //peticion
app.get('/', (req, res) => {
    res.send('Hola mundo desde Express');
});      

app.get('/api/usuarios', (req, res) => {
    res.send(usuarios);
});

app.get('/api/usuarios/:id', (req, res) => {
    let usuario = checkUsuario(req.params.id);
    if(!usuario) res.status(404).send('Usuario no encontrado');
    else res.send(usuario);
});

// app.post();     //envio de datos // creacion.
app.post('/api/usuarios', (req, res) => {
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

// app.put();      //actualizacion
app.put('/api/usuarios/:id', (req, res) => {
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
// app.delete();   //eliminacion
app.delete('/api/usuarios/:id', (req, res) =>{
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


app.listen(port, () => {
    console.log(`Server listen in port ${port}...`);
})


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