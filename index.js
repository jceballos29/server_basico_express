const debug = require('debug')('app');
const express = require('express');
const usuarios = require('./routes/usuarios');
require('dotenv').config();
const morgan = require('morgan');
const config = require('config');

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.use('/api/usuarios', usuarios);

const port = process.env.PORT || 3000;

console.log('Application: ' + config.get('name'));
console.log('BD server: ' + config.get('configDB.host'));


if(app.get('env') == 'development'){
    app.use(morgan('tiny'));
    debug('Morgan: enabled')
}   

app.get('/', (req, res) => {
    res.send('Hola mundo desde Express');
});      


app.listen(port, () => {
    console.log(`Server listen in port ${port}...`);
})
