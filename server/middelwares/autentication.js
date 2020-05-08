const jwt = require('jsonwebtoken');

/**
 * Middelwares para validar el token
 */
let verificarToken = (req, res, next) => {

    //Leer los headers
    let token = req.get('token');

    //Verificar token
    jwt.verify(token, process.env.SEDD, (err, decoded) => {


        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }

        req.usuario = decoded.usuario;
        next();

    });

}

//Funcion para validar el admin_role
let verificarAdmin_Role = (req, res, next) => {

    let usuario = req.usuario;
    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.json({
            ok: false,
            err: {
                message: 'Role invalido para actualizar'
            }
        });
    }
}

module.exports = { verificarToken, verificarAdmin_Role };