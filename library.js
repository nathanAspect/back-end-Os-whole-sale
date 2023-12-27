const jwt = require("jsonwebtoken");
const db = require("./database.js");

function generateToken(adminId) {//generates token with embeded status and username
   return new Promise((resolve, reject) => {
     db.getItem('status', 'admin', adminId)
       .then((response) => {
         const status = response;
         const payload = { adminId, status };
         const secretKey = process.env.secret_key;
         const options = { expiresIn: '1h' };//Token expiration 1 hour, don't forget to set the cookie expire date too 
         const token = jwt.sign(payload, secretKey, options);
         resolve(token);
       })
       .catch((err) => {
         reject(err);
       });
   });
 }

 //function to extract the cookie and create a middleware
 function validateCookie(req, res, next){
    const token = req.cookies.tokenCookie;
    if(!token){
      return res.redirect('/login');
    }
    jwt.verify(token, process.env.secret_Key, (err, decoded) => {
      if (err) {
        return res.redirect('/login');
      }
      req.user = decoded;
      next();
    });
 }

 module.exports = {
   generateToken,
   validateCookie
 }