var express = require('express');
var USER = require('../database/users');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.status(200).json({
    msn: "hola mundo"
   });
});
router.post('/user' , async(req, res)=>{
  var params = req.body;
  params["registerdate"] = new Date();

  var users = new USER(params);
  var result =  await users.save();
  res.status(200).json(result); 
});
/* GET muestra datos */
router.get("/user", (req, res) => {
 /* USER.find({}, (err, docs) => {
    res.status(200).json(docs); 
  });*/
  
  /*para ver las tablas q quiera */
  /* esa es la ruta */
  /* http://localhost:8000/1.0/api/user?limit=3*/
  var params = req.query;
  console.log;
  var limit = 100;

  if(params.limit != null){
    limit = parseInt(params.limit);
  }

  /* para el orden ascendente o desendiente y ver si es nulo */
  /*http://localhost:8000/1.0/api/user?limit=3&order=desc */
  /*http://localhost:8000/1.0/api/user?limit=3&order=acs */
  var order = -1;
  if(params.order != null){
    if(params.order == "desc"){
      order = -1;
    } else if(params.order == "asc"){
         order = 1;
    }
  }
  /*skip es para el salto de tablas */
  /*http://localhost:8000/1.0/api/user?limit=3&order=desc&skip=1 */
  var skip
  if(params.skip != null){
    skip = parseInt(params.skip);
  }
 

   USER.find({}).limit(limit).sort({_id: order}).skip(skip).exec((err, docs) => {
    res.status(200).json(docs);
  });
});
/* es para actualizar*/
/*por ej se actualizara el nombre poniendo name y el nombre */
/*http://localhost:8000/1.0/api/user?id=5de90f66720ef900edbc7c06 */
router.patch("/user", (req, res) => {
   if (req.query.id == null){
    res.status(300).json({
      mns: "Error no existe el id"
    });
    return;
   }
   var id = req.query.id;
   var params = req.body;
   USER.findOneAndUpdate({_id: id}, params, (err, docs) => {
    res.status(200).json(docs);
   });
});

router.delete("/user", async(req, res) => {
    if(req.query.id == null){
      res.status(300).json({
         msn: "Error no existe id"
      });
      return;
    }
    var r = await USER.remove({_id: req.query.id});
    res.status(300).json(r);
});

module.exports = router;
  