var express = require('express');
const { pedirTodas, pedir, crear, actualizar, borrar } = require('../db/pedidos');
var router = express.Router();
const { body, validationResult } = require('express-validator');

let metas = [
  {
    "id": "1",
    "detalles": "Correr por 30 minutos",
    "plazo": "día",
    "frecuencia": 1,
    "icono": "🏃‍♂️",
    "meta": 365,
    "fecha_límite": "2030-01-01",
    "completado": 5
  },
  {
    "id": "2",
    "detalles": "Leer libros",
    "plazo": "año",
    "frecuencia": 6,
    "icono": "📚",
    "meta": 12,
    "fecha_límite": "2030-01-01",
    "completado": 0
  },
  {
    "id": "3",
    "detalles": "Viajar a nuevos lugares",
    "plazo": "mes",
    "frecuencia": 1,
    "icono": "✈️",
    "meta": 60,
    "fecha_límite": "2030-01-01",
    "completado": 40
  }
];

/* GET Lista de metas. */
router.get('/', function (req, res, next) {
  // res.json(metas);
  pedirTodas('metas', (err, metas) => {
    if (err) {
      return next(err);
    }
    console.log(metas)
    res.send(metas);
  });

});

/* Get Meta con id */
router.get('/:id', function (req, res, next) {
  const id = req.params.id;
  pedir('metas', id, (err, meta) => {
    if (err) {
      return next(err);
    }
    if (!meta.length) {
      return res.sendStatus(404);
    }
    res.send(meta[0]);
  });


    // const id = req.params.id;
  // const meta = metas.find(item => item.id === id);
  // if(!meta){
  //   return res.sendStatus(404);
  // }
  // res.send(meta);
});

/* POST Crear una meta */
router.post('/',
  body('detalles').isLength({ min: 5 }),
  body('periodo').not().isEmpty(),
  function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const nuevaMeta = req.body;
    crear('metas', nuevaMeta, (err, meta) => {
      if (err) {
        return next(err);
      }
      res.send(meta);
    });


    // const meta = req.body; // Body incluye informacion que enviamos al backend
    // metas.push(meta);
    // res.status(201); // 201 significa que hemos enviado un recurso exitosamente
    // res.send(meta);
  });

/* PUT Actualizar una meta */
router.put('/:id',
body('detalles').isLength({ min: 5 }),
body('periodo').not().isEmpty(),
function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const body = req.body;
  const id = req.params.id;
  if(body.id != id){
    return res.sendStatus(404);
  }
  pedir('metas', id, (err, meta) =>{
    if(err){
      return next(err);
    }
    if(!meta.length){
      return res.sendStatus(404);
    }
    actualizar('metas', id, body, (err, actualizada) => {
      if (err){
        return next(err);
      }
      res.send(actualizada);
    });
  });

    // const meta = req.body;
    // const id = req.params.id;
    // if (meta.id !== id) {
    //   return res.sendStatus(409); // 409 significa que ah habido un conflicto
    // }
    // const indice = metas.findIndex(item => item.id === id);
    // if (indice === -1) {
    //   return res.sendStatus(404);
    // }
    // metas[indice] = meta;
    // res.send(meta);
  });

/* DELETE Borrar meta */
router.delete('/:id', function (req, res, next) {
  const id = req.params.id;
  pedir('metas', id, (err, meta) => {
    if(err){
      return next(err);
    }
    if(!meta.length){
      return res.sendStatus(404);
    }
    borrar('metas', id, (err) =>{
      if(err){
        return next(err);
      }
      res.sendStatus(204);
    });
  });


  // const id = req.params.id;
  // const indice = metas.findIndex(item => item.id === id);
  // if (indice === -1) {
  //   return res.sendStatus(404);
  // }
  // metas.splice(indice, 1); // splice cambia el contenido de un array eliminando elementos existentes y/o agregando nuevos elementos.
  // res.sendStatus(204); // 204 significa que todo a sido exitoso pero que no estamos enviando ningun contenido de regreso.
});



module.exports = router;
