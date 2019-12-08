var express = require('express');
var user = require('../database/users');
const USER = user.model;
const USERSCHEMA = user.schema;
var valid = require("../utils/valid")

var router = express.Router();
var jwt = require("jsonwebtoken");

/*verificacion si el usuario tiene permiso */
function verifytoken (req, res, next){
  var token = req.headers["autorization"];
  if(token == null){
    res.status(300).json({"msn": "Error no tienes acceso"});
    return;
  }
  jwt.verify(token, "password",(err, auth) => {
    if(err){
      res.status(300).json({"msn": "Token inalido"});
      return;
    }
    res.status(200).json(auth);
    return;
    //next
  })
}

 ///////login//////////////////////////////////
router.post("/login", async(req, res, next) => {
  var params = req.body;

  if(valid.checkParams({"email":String,"password": String},params)){
    res.status(300).json({
      "msn": "Error paramentros incorrectos"});
      return;
  }

  var haspassword = sha1(params.password);
  var docs = await USER.find({email: params.email, password: haspassword},)

   if(docs.length == 1 ){
       jwt.sign({name: params.email, password: haspassword},"password", (err,token) => {
         if(err){
           res.status(300).json({"msn": "Error dentro del JWT"});
           return;
          }
          res.status(200).json({"token": token});
       });    
       return;
   }

});
/* GET home page. */
router.get('/', function(req, res, next) {
  res.status(200).json({
    msn: "Bienvenido a la API CATHOST"
   });
});


router.post('/user' , async(req, res)=>{
  var params = req.body;
  params["registerdate"] = new Date();

 /* por si los datos se introducen mal */
  if(!valid.checkParams(USERSCHEMA, params)){
       res.status(300).json({
         msn:"parametros incorrectos"
       });
       return;
  }
  if(!valid.checkPassword(params.password)){
    res.status(300).json({
      msn:"contrasena invalido"
    });
    return; 
  }

  if(!valid.checkName(params.name)){
    res.status(300).json({
      msn:"nombre invalido"
    });
    return; 
  }

  /* controlador para la introduccion de email */
  if(!valid.checkEmail(params.email)){
    res.status(300).json({
      msn:"email invalido"
    });
    return; 
  }




  var users = new USER(params);
  var result =  await users.save();
  res.status(200).json(result); 
});


/* GET muestra datos */
router.get("/user", verifytoken,async (req, res, next) => {
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
  