require('./config/config')
const express = require('express')
const mongoose = require('mongoose');
const colors = require('colors');


const app = express();

const bodyParser = require('body-parser')


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
    //Parse application json
app.use(bodyParser.json())

// Configuracion global de rutas
app.use(require('./routes/index'));



mongoose.connect(process.env.URLDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}, (err, resp) => {

    if (err) throw err;
    console.log('Base de datos ONLINE'.green);
});
// mongoose.connect('mongodb://localhost:27017/cafe', (err, resp) => {
//     if (err) throw err;

//     console.log('Base de datos ONLINE');
// });


app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto', process.env.PORT);
})