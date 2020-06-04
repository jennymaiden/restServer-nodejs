/**
 * MODELO DE CATEGORIA
 */
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

//Declarar el esquema para mongo
let Schema = mongoose.Schema;

//Definir las reglas y controles
let categoriaSchema = new Schema({

    descripcion: {
        type: String,
        required: [true, 'La descipcion es oblgatoria']
    },
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'usuario'
    },
    estado: {
        type: Boolean,
        default: true
    }
});

//Declararle el plugin a utilizar para personalizar las validaciones
categoriaSchema.plugin(uniqueValidator, {
    message: '{PATH} debe de ser unico'
})

module.exports = mongoose.model('categoria', categoriaSchema);